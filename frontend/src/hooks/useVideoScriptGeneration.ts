import { type GenerateContentInput, type GenerateCharacterInput, type GenerateDialogueInput, type GenerateFinalScriptInput, videoScriptAPI } from '../services/api';
import { useVideoScriptStore } from '../stores/videoScriptStore';

export const useVideoScriptGeneration = () => {
  const store = useVideoScriptStore();

  // Step 1: Generate Content
  const generateContent = async (input: GenerateContentInput) => {
    store.setGeneratingContent(true);
    store.setContentError(null);
    
    try {
      const response = await videoScriptAPI.generateContent(input);
      
      if (response.success && response.data) {
        store.setContentData(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to generate content');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate content';
      store.setContentError(errorMessage);
      throw error;
    } finally {
      store.setGeneratingContent(false);
    }
  };

  // Step 2: Generate Character
  const generateCharacter = async (input: GenerateCharacterInput) => {
    store.setGeneratingCharacter(true);
    store.setCharacterError(null);
    
    try {
      const response = await videoScriptAPI.generateCharacter({
        ...input,
        language: input.language || input.contentData.language
      });
      
      if (response.success && response.data) {
        store.addCharacter(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to generate character');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate character';
      store.setCharacterError(errorMessage);
      throw error;
    } finally {
      store.setGeneratingCharacter(false);
    }
  };

  // Step 3: Generate Dialogue
  const generateDialogue = async (input: GenerateDialogueInput) => {
    store.setGeneratingDialogue(true);
    store.setDialogueError(null);
    
    try {
      const response = await videoScriptAPI.generateDialogue({
        ...input,
        language: input.language || input.contentData.language
      });
      
      if (response.success && response.data) {
        store.setDialogue(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to generate dialogue');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate dialogue';
      store.setDialogueError(errorMessage);
      throw error;
    } finally {
      store.setGeneratingDialogue(false);
    }
  };

  // Step 4: Generate Final Script
  const generateFinalScript = async (input: GenerateFinalScriptInput) => {
    store.setGeneratingFinalScript(true);
    store.setFinalScriptError(null);
    
    try {
      const response = await videoScriptAPI.generateFinalScript({
        ...input,
        language: input.language || input.contentData.language
      });
      
      if (response.success && response.data) {
        store.setFinalScript(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to generate final script');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate final script';
      store.setFinalScriptError(errorMessage);
      throw error;
    } finally {
      store.setGeneratingFinalScript(false);
    }
  };

  return {
    generateContent,
    generateCharacter,
    generateDialogue,
    generateFinalScript,
    // Store state
    ...store,
  };
};