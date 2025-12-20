import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type Language = 'en' | 'ur';

interface ChatState {
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
  preferredLanguage: Language;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setSessionId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setPreferredLanguage: (language: Language) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  preferredLanguage: 'en', // Default to English
  
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  
  setSessionId: (id) => set({ sessionId: id }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setPreferredLanguage: (language) => set({ preferredLanguage: language }),
  
  clearMessages: () => set({ messages: [], sessionId: null }),
}));

