import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types matching your backend
export interface ContentData {
  contentId: string;
  topic: string;
  tags: string[];
  mainMessage: string;
  keyPoints: string[];
  tone: string;
  targetAudience: string;
  duration: string;
  language: string;
  createdAt: Date;
}

export interface CharacterData {
  characterId: string;
  name: string;
  role: string;
  description: string;
  personality: string[];
  appearance: string;
  voiceStyle: string;
  customPrompt?: string;
  createdAt: Date;
}

export interface DialogueSegment {
  timestamp: string;
  characterId: string;
  characterName: string;
  dialogue: string;
  emotion: string;
  action: string;
  visualCue?: string;
}

export interface FinalScript {
  scriptId: string;
  characters: CharacterData[];
  dialogue: DialogueSegment[];
  prompt: string;
  metadata: {
    title: string;
    duration: string;
    charactersCount: number;
    createdAt: Date;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    step: number;
    nextStep?: string;
  };
}

// Input types for API calls
export interface GenerateContentInput {
  topic: string;
  tags?: string[];
  duration?: string;
  language?: string;
  existingContent?: Partial<ContentData>;
}

export interface GenerateCharacterInput {
  contentData: ContentData;
  characterPrompt?: string;
  language?: string;
  existingCharacters?: CharacterData[];
}

export interface GenerateDialogueInput {
  contentData: ContentData;
  characters: CharacterData[];
  dialoguePrompt?: string;
  language?: string;
  dialogueCount?: number;
  existingDialogues?: DialogueSegment[];
}

export interface GenerateFinalScriptInput {
  contentData: ContentData;
  characters: CharacterData[];
  dialogue: DialogueSegment[];
  language?: string;
}

// API Functions matching your 4-step process
export const videoScriptAPI = {
  // Step 1: Generate Content Strategy
  generateContent: async (input: GenerateContentInput): Promise<ApiResponse<ContentData>> => {
    const response = await api.post('/video-script/content/generate', input);
    return response.data;
  },

  // Step 2: Generate Character
  generateCharacter: async (input: GenerateCharacterInput): Promise<ApiResponse<CharacterData>> => {
    const response = await api.post('/video-script/characters/generate', input);
    return response.data;
  },

  // Step 3: Generate Dialogue
  generateDialogue: async (input: GenerateDialogueInput): Promise<ApiResponse<DialogueSegment[]>> => {
    const response = await api.post('/video-script/dialogue/generate', input);
    return response.data;
  },

  // Step 4: Generate Final Script
  generateFinalScript: async (input: GenerateFinalScriptInput): Promise<ApiResponse<FinalScript>> => {
    const response = await api.post('/video-script/final/generate', input);
    return response.data;
  },
};

export default api;