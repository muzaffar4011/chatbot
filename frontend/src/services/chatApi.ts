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
  onToken: (token: string) => void,
  onSessionId: (id: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    onError(error instanceof Error ? error.message : 'Failed to send message');
  }
}

