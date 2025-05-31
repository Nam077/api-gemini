export interface CharacterPersonality {
  traits: string[]; // ["thông minh", "hài hước", "nghiêm túc"]
  likes: string[];  // ["đọc sách", "cafe", "coding"]
  dislikes: string[]; // ["ồn ào", "tranh cãi"]
  background: string; // Tiểu sử nhân vật
}

export interface Character {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  personality: CharacterPersonality;
  avatar?: string;
  systemPrompt: string; // Prompt để AI hiểu vai diễn
  createdAt: Date;
  updatedAt: Date;
}

export class CharacterModel {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  personality: CharacterPersonality;
  avatar?: string;
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = this.generateId();
    this.name = data.name;
    this.age = data.age;
    this.gender = data.gender;
    this.occupation = data.occupation;
    this.personality = data.personality;
    this.avatar = data.avatar;
    this.systemPrompt = data.systemPrompt;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  generateSystemPrompt(): string {
    const traitsStr = this.personality.traits.join(', ');
    const likesStr = this.personality.likes.join(', ');
    const dislikesStr = this.personality.dislikes.join(', ');

    return `Bạn là ${this.name}, ${this.age} tuổi, giới tính ${this.gender}, nghề nghiệp ${this.occupation}.

Tính cách: ${traitsStr}
Sở thích: ${likesStr} 
Không thích: ${dislikesStr}

Tiểu sử: ${this.personality.background}

Hãy luôn nhập vai và trả lời như ${this.name}. Sử dụng ngôi thứ nhất khi nói về bản thân. Thể hiện tính cách và sở thích của ${this.name} trong cách nói chuyện.`;
  }

  updatePersonality(personality: Partial<CharacterPersonality>): void {
    this.personality = { ...this.personality, ...personality };
    this.systemPrompt = this.generateSystemPrompt();
    this.updatedAt = new Date();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  toJSON(): Character {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      gender: this.gender,
      occupation: this.occupation,
      personality: this.personality,
      avatar: this.avatar,
      systemPrompt: this.systemPrompt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}