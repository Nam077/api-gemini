export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationModel {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;

  constructor(id?: string, title?: string) {
    this.id = id || this.generateId();
    this.title = title || 'Cuộc trò chuyện mới';
    this.messages = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addMessage(role: 'user' | 'assistant', content: string): Message {
    const message: Message = {
      id: this.generateId(),
      role,
      content,
      timestamp: new Date()
    };
    
    this.messages.push(message);
    this.updatedAt = new Date();
    
    return message;
  }

  updateTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  toJSON(): Conversation {
    return {
      id: this.id,
      title: this.title,
      messages: this.messages,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}