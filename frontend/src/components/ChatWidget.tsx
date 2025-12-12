import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { sendMessage } from '../services/chatApi';

const ChatWidget = () => {
  const { 
    messages, 
    sessionId, 
    isLoading, 
    addMessage, 
    setSessionId, 
    setLoading,
    clearMessages 
  } = useChatStore();

  const [inputValue, setInputValue] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }, [messages, currentResponse]);

  // Scroll to bottom on initial load if messages exist
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      }, 200);
    }
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    setLoading(true);
    setCurrentResponse('');

    let fullResponse = '';

    try {
      await sendMessage(
        userMessage,
        sessionId,
        // onToken
        (token: string) => {
          fullResponse += token;
          setCurrentResponse(fullResponse);
        },
        // onSessionId
        (id: string) => {
          setSessionId(id);
        },
        // onError
        (error: string) => {
          setLoading(false);
          addMessage({
            role: 'assistant',
            content: `Sorry, there was an error: ${error}. Please try again.`,
          });
          setCurrentResponse('');
        },
        // onComplete
        () => {
          setLoading(false);
          // Clear current response first to avoid duplication
          setCurrentResponse('');
          if (fullResponse) {
            addMessage({
              role: 'assistant',
              content: fullResponse,
            });
          }
        }
      );
    } catch (error) {
      setLoading(false);
      addMessage({
        role: 'assistant',
        content: 'Sorry, there was an error. Please try again.',
      });
      setCurrentResponse('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    if (window.confirm('Are you sure you want to start a new chat?')) {
      clearMessages();
      setCurrentResponse('');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f0f2f5] overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Salon Assistant</h1>
            <p className="text-xs text-white/80">Always available</p>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="New chat"
          title="New chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Messages Area - Scrollable between header and input */}
      <div 
        className="flex-1 overflow-y-auto bg-[#efeae2] bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%23d4d4d4%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" 
        style={{ 
          paddingTop: '72px', 
          paddingBottom: '140px',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          minHeight: 'calc(100vh - 72px - 140px)'
        }}
      >
        <div className="min-h-full flex flex-col">
          {messages.length === 0 && !currentResponse && (
            <div className="flex-1 flex items-center justify-center px-4 py-6">
              <div className="text-center max-w-md w-full">
                <div className="w-20 h-20 bg-[#075e54] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome! 👋</h2>
                <p className="text-gray-600 mb-4">I'm your Salon Assistant. Ask me anything about our services, pricing, or bookings!</p>
                <p className="text-sm text-gray-500">You can ask in English or Roman Urdu</p>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[75%] sm:max-w-[65%] md:max-w-[55%] rounded-lg px-4 py-2 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-[#dcf8c6] rounded-tr-none' // WhatsApp green for user
                    : 'bg-white rounded-tl-none' // White for bot
                }`}
                style={{
                  boxShadow: message.role === 'user' 
                    ? '0 1px 2px rgba(0,0,0,0.1)' 
                    : '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${message.role === 'user' ? 'text-[#667781]' : 'text-gray-500'}`}>
                  <span className="text-[10px]">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {message.role === 'user' && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Current streaming response */}
          {currentResponse && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[75%] sm:max-w-[65%] md:max-w-[55%] bg-white rounded-lg rounded-tl-none px-4 py-2 shadow-sm">
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                  {currentResponse}
                  {isLoading && (
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse ml-1" />
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isLoading && !currentResponse && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} style={{ minHeight: '20px' }} />
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-[#f0f2f5] px-4 py-3 border-t border-gray-300 z-20 shadow-lg"
        style={{
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
          paddingLeft: 'calc(1rem + env(safe-area-inset-left))',
          paddingRight: 'calc(1rem + env(safe-area-inset-right))'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 bg-white rounded-3xl px-4 py-2 shadow-sm border border-gray-200">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
              aria-label="Attach"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none border-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent py-2 max-h-[200px] overflow-y-auto"
              style={{ fontFamily: 'inherit' }}
            />
            
            {inputValue.trim() ? (
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-[#075e54] text-white rounded-full hover:bg-[#064e46] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            ) : (
              <button
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                aria-label="Emoji"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Powered by AI • Ask in English or Roman Urdu
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
