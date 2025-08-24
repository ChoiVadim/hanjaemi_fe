/**
 * Utility functions for chat functionality
 */

/**
 * Clear all locally stored chat data from localStorage
 * This removes any cached chat messages that were stored before implementing backend chat history
 */
export function clearLocalChatData(): void {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  try {
    const keys = Object.keys(localStorage);
    const chatKeys = keys.filter(key => 
      key.startsWith('chatMessages_') || 
      key.includes('chat') || 
      key.includes('Chat')
    );
    
    chatKeys.forEach(key => {
      console.log(`🧹 Clearing localStorage chat data: ${key}`);
      localStorage.removeItem(key);
    });
    
    console.log(`✅ Cleared ${chatKeys.length} chat-related localStorage items`);
  } catch (error) {
    console.error('❌ Failed to clear chat localStorage data:', error);
  }
}

/**
 * Transform backend chat history to frontend message format
 */
export interface BackendChatItem {
  id: number;
  message: string;
  response?: string;
  lessonContext?: number;
  createdAt: string;
}

export interface FrontendMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
}

export function transformChatHistory(chatHistory: BackendChatItem[]): FrontendMessage[] {
  const messages: FrontendMessage[] = [];
  
  // Sort by creation date to maintain chronological order
  const sortedHistory = [...chatHistory].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  sortedHistory.forEach((chat) => {
    // Add user message
    messages.push({
      id: `user-${chat.id}`,
      content: chat.message,
      sender: "user"
    });
    
    // Add assistant response if exists
    if (chat.response) {
      messages.push({
        id: `assistant-${chat.id}`,
        content: chat.response,
        sender: "assistant"
      });
    }
  });
  
  return messages;
}
