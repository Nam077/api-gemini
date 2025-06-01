import { create } from 'zustand';
import type { ContentData, CharacterData, DialogueSegment, FinalScript } from '../services/api';

interface VideoScriptState {
  // Current step in the process
  currentStep: number;
  
  // Data for each step
  contentData: ContentData | null;
  characters: CharacterData[];
  dialogue: DialogueSegment[];
  finalScript: FinalScript | null;
  
  // Loading states
  isGeneratingContent: boolean;
  isGeneratingCharacter: boolean;
  isGeneratingDialogue: boolean;
  isGeneratingFinalScript: boolean;
  
  // Error states
  contentError: string | null;
  characterError: string | null;
  dialogueError: string | null;
  finalScriptError: string | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setContentData: (data: ContentData) => void;
  addCharacter: (character: CharacterData) => void;
  updateCharacter: (index: number, character: CharacterData) => void;
  removeCharacter: (index: number) => void;
  setDialogue: (dialogue: DialogueSegment[]) => void;
  setFinalScript: (script: FinalScript) => void;
  
  // Loading actions
  setGeneratingContent: (loading: boolean) => void;
  setGeneratingCharacter: (loading: boolean) => void;
  setGeneratingDialogue: (loading: boolean) => void;
  setGeneratingFinalScript: (loading: boolean) => void;
  
  // Error actions
  setContentError: (error: string | null) => void;
  setCharacterError: (error: string | null) => void;
  setDialogueError: (error: string | null) => void;
  setFinalScriptError: (error: string | null) => void;
  
  // Reset actions
  resetContent: () => void;
  resetCharacters: () => void;
  resetDialogue: () => void;
  resetFinalScript: () => void;
  resetAll: () => void;
}

export const useVideoScriptStore = create<VideoScriptState>((set) => ({
  // Initial state
  currentStep: 1,
  contentData: null,
  characters: [],
  dialogue: [],
  finalScript: null,
  
  isGeneratingContent: false,
  isGeneratingCharacter: false,
  isGeneratingDialogue: false,
  isGeneratingFinalScript: false,
  
  contentError: null,
  characterError: null,
  dialogueError: null,
  finalScriptError: null,
  
  // Step management - KHÔNG tự động chuyển step
  setCurrentStep: (step) => set({ currentStep: step }),
  
  // Data setters - KHÔNG tự động chuyển step
  setContentData: (data) => set({ 
    contentData: data,
    contentError: null 
  }),
  
  addCharacter: (character) => set((state) => ({ 
    characters: [...state.characters, character],
    characterError: null
  })),
  
  updateCharacter: (index, character) => set((state) => ({
    characters: state.characters.map((char, i) => i === index ? character : char)
  })),
  
  removeCharacter: (index) => set((state) => ({
    characters: state.characters.filter((_, i) => i !== index)
  })),
  
  setDialogue: (dialogue) => set({ 
    dialogue,
    dialogueError: null 
  }),
  
  setFinalScript: (script) => set({ 
    finalScript: script,
    finalScriptError: null 
  }),
  
  // Loading setters
  setGeneratingContent: (loading) => set({ isGeneratingContent: loading }),
  setGeneratingCharacter: (loading) => set({ isGeneratingCharacter: loading }),
  setGeneratingDialogue: (loading) => set({ isGeneratingDialogue: loading }),
  setGeneratingFinalScript: (loading) => set({ isGeneratingFinalScript: loading }),
  
  // Error setters
  setContentError: (error) => set({ contentError: error }),
  setCharacterError: (error) => set({ characterError: error }),
  setDialogueError: (error) => set({ dialogueError: error }),
  setFinalScriptError: (error) => set({ finalScriptError: error }),
  
  // Reset actions
  resetContent: () => set({ 
    contentData: null, 
    contentError: null 
  }),
  
  resetCharacters: () => set({ 
    characters: [], 
    characterError: null 
  }),
  
  resetDialogue: () => set({ 
    dialogue: [], 
    dialogueError: null 
  }),
  
  resetFinalScript: () => set({ 
    finalScript: null,
    finalScriptError: null 
  }),
  
  resetAll: () => set({
    currentStep: 1,
    contentData: null,
    characters: [],
    dialogue: [],
    finalScript: null,
    isGeneratingContent: false,
    isGeneratingCharacter: false,
    isGeneratingDialogue: false,
    isGeneratingFinalScript: false,
    contentError: null,
    characterError: null,
    dialogueError: null,
    finalScriptError: null,
  }),
}));