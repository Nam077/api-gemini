export interface VideoScene {
  id: string;
  sceneNumber: number;
  setting: string; // "Quán cafe", "Thư viện", "Công viên"
  characters: string[]; // Tên các nhân vật trong scene
  dialogue: {
    character: string;
    text: string;
    emotion?: string;
    action?: string;
  }[];
  duration: number; // Thời lượng scene (giây)
  notes?: string; // Ghi chú đạo diễn
}

export interface VideoScript {
  id: string;
  title: string;
  topic: string;
  totalDuration: number;
  scenes: VideoScene[];
  characters: {
    name: string;
    description: string;
    personality: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export class VideoScriptModel {
  id: string;
  title: string;
  topic: string;
  totalDuration: number;
  scenes: VideoScene[];
  characters: {
    name: string;
    description: string;
    personality: string;
  }[];
  createdAt: Date;
  updatedAt: Date;

  constructor(topic: string, title?: string) {
    this.id = this.generateId();
    this.title = title || `Video Script - ${topic}`;
    this.topic = topic;
    this.totalDuration = 0;
    this.scenes = [];
    this.characters = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addCharacter(name: string, description: string, personality: string): void {
    this.characters.push({ name, description, personality });
    this.updatedAt = new Date();
  }

  addScene(scene: Omit<VideoScene, 'id'>): VideoScene {
    const newScene: VideoScene = {
      id: this.generateId(),
      ...scene
    };
    this.scenes.push(newScene);
    this.totalDuration += scene.duration;
    this.updatedAt = new Date();
    return newScene;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  toJSON(): VideoScript {
    return {
      id: this.id,
      title: this.title,
      topic: this.topic,
      totalDuration: this.totalDuration,
      scenes: this.scenes,
      characters: this.characters,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}