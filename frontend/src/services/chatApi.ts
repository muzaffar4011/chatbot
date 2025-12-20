const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ChatStreamEvent {
  type: 'session' | 'token' | 'done' | 'error';
  sessionId?: string;
  content?: string;
  message?: string;
}

/**
 * Send a message to the chat API and stream the response
 */
export async function sendMessage(
  message: string,
  sessionId: string | null,
  preferredLanguage: 'en' | 'ur',
  onToken: (token: string) => void,
  onSessionId: (id: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<void> {
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
        preferredLanguage, // Send preferred language to backend
      }),
      signal: controller.signal,
    }).catch((fetchError) => {
      clearTimeout(timeoutId);
      // Handle network errors
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to server. Please check your connection.');
      }
      throw fetchError;
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let isComplete = false;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '' || data === '[DONE]') {
            continue;
          }

          try {
            const event: ChatStreamEvent = JSON.parse(data);
            
            switch (event.type) {
              case 'session':
                if (event.sessionId) {
                  onSessionId(event.sessionId);
                }
                break;
              
              case 'token':
                if (event.content) {
                  onToken(event.content);
                }
                break;
              
              case 'error':
                onError(event.message || 'An error occurred');
                isComplete = true;
                break;
              
              case 'done':
                if (!isComplete) {
                  onComplete();
                  isComplete = true;
                }
                break;
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim() && !isComplete) {
      const line = buffer.trim();
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data && data !== '[DONE]') {
          try {
            const event: ChatStreamEvent = JSON.parse(data);
            if (event.type === 'token' && event.content) {
              onToken(event.content);
            } else if (event.type === 'done' && !isComplete) {
              onComplete();
              isComplete = true;
            }
          } catch (e) {
            // Ignore parse errors for incomplete data
          }
        }
      }
    }

    // Only call onComplete if we haven't already
    if (!isComplete) {
      onComplete();
    }
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to send message';
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. The server is taking too long to respond.';
      } else if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Could not connect to server. Please check if the backend is running.';
      } else if (error.message.includes('Connection reset')) {
        errorMessage = 'Connection was reset. Please try again.';
      } else {
        errorMessage = error.message;
      }
    }
    
    onError(errorMessage);
  }
}

