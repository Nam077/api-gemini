import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { VideoScriptService, RegenerateContentInput, RegenerateCharacterInput, RegenerateDialogueInput, RegenerateFinalScriptInput } from '../services/VideoScriptService';
import { TYPES } from '../types/types';

@injectable()
export class VideoScriptController {
  constructor(
    @inject(TYPES.VideoScriptService) private videoScriptService: VideoScriptService
  ) {}

  // STEP 1: POST /api/v1/video-script/content/generate
  async generateContent(req: Request, res: Response): Promise<void> {
    try {
      const { topic, tags, duration, language, existingContent } = req.body;

      if (!topic) {
        res.status(400).json({ error: 'Topic is required' });
        return;
      }

      console.log('🚀 Step 1: Generating content for topic:', topic);
      console.log('Language:', language || 'Vietnamese (default)');
      
      const input: RegenerateContentInput = {
        topic,
        tags,
        duration,
        language,
        existingContent
      };

      const result = await this.videoScriptService.generateContent(input);

      if (!result.success) {
        res.status(500).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error: any) {
      console.error('❌ Generate content error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate content',
        details: error.message 
      });
    }
  }

  // STEP 2: POST /api/v1/video-script/characters/generate
  async generateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const { contentData, characterPrompt, language, existingCharacters } = req.body;

      if (!contentData) {
        res.status(400).json({ error: 'contentData is required' });
        return;
      }

      console.log('🚀 Step 2: Generating character for topic:', contentData.topic);
      console.log('Character prompt:', characterPrompt || 'Auto-generate');
      console.log('Language:', language || contentData.language || 'Vietnamese (default)');
      console.log('Existing characters count:', existingCharacters?.length || 0);
      
      const input: RegenerateCharacterInput = {
        contentData,
        characterPrompt,
        language,
        existingCharacters
      };

      const result = await this.videoScriptService.generateCharacter(input);

      if (!result.success) {
        res.status(500).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error: any) {
      console.error('❌ Generate character error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate character',
        details: error.message 
      });
    }
  }

  // STEP 3: POST /api/v1/video-script/dialogue/generate
  async generateDialogue(req: Request, res: Response): Promise<void> {
    try {
      const { contentData, characters, dialoguePrompt, language, dialogueCount, existingDialogues } = req.body;

      if (!contentData || !characters || !Array.isArray(characters)) {
        res.status(400).json({ 
          error: 'contentData and characters array are required' 
        });
        return;
      }

      // Validate dialogueCount if provided
      if (dialogueCount !== undefined && (typeof dialogueCount !== 'number' || dialogueCount < 1 || dialogueCount > 20)) {
        res.status(400).json({ 
          error: 'dialogueCount must be a number between 1 and 20' 
        });
        return;
      }

      console.log('🚀 Step 3: Generating dialogue for topic:', contentData.topic);
      console.log('Characters count:', characters.length);
      console.log('Dialogue prompt:', dialoguePrompt || 'Auto-generate');
      console.log('Language:', language || contentData.language || 'Vietnamese (default)');
      console.log('Dialogue count requested:', dialogueCount || 'auto (5-7)');
      
      const input: RegenerateDialogueInput = {
        contentData,
        characters,
        dialoguePrompt,
        language,
        dialogueCount,
        existingDialogues
      };

      const result = await this.videoScriptService.generateDialogue(input);

      if (!result.success) {
        res.status(500).json(result);
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('❌ Generate dialogue error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate dialogue',
        details: error.message 
      });
    }
  }

  // STEP 4: POST /api/v1/video-script/final/generate
  async generateFinalScript(req: Request, res: Response): Promise<void> {
    try {
      const { contentData, characters, dialogue, language } = req.body;

      if (!contentData || !characters || !dialogue) {
        res.status(400).json({ 
          error: 'contentData, characters, and dialogue are required' 
        });
        return;
      }

      console.log('🚀 Step 4: Generating final script for topic:', contentData.topic);
      console.log('Language:', language || contentData.language || 'Vietnamese (default)');
      
      const input: RegenerateFinalScriptInput = {
        contentData,
        characters,
        dialogue,
        language
      };

      const result = await this.videoScriptService.generateFinalScript(input);

      if (!result.success) {
        res.status(500).json(result);
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('❌ Generate final script error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate final script',
        details: error.message 
      });
    }
  }
}