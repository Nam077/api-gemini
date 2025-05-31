import { injectable } from 'inversify';
import { ConversationModel, Conversation } from '../models/Conversation';

@injectable()
export class ConversationRepository {
  private conversations: Map<string, ConversationModel> = new Map();

  findById(id: string): ConversationModel | null {
    return this.conversations.get(id) || null;
  }

  save(conversation: ConversationModel): ConversationModel {
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  create(id?: string, title?: string): ConversationModel {
    const conversation = new ConversationModel(id, title);
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  getAll(): Conversation[] {
    return Array.from(this.conversations.values()).map(conv => conv.toJSON());
  }

  delete(id: string): boolean {
    return this.conversations.delete(id);
  }
}