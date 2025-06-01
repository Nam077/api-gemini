import { Router } from 'express';
import { container } from '../config/container';
import { VideoScriptController } from '../controllers/VideoScriptController';
import { TYPES } from '../types/types';

export const setupVideoScriptRoutes = (router: Router): void => {
  const videoScriptController = container.get<VideoScriptController>(TYPES.VideoScriptController);

  // Video Script Generation Routes - 4 Steps (Stateless)
  router.post('/content/generate', videoScriptController.generateContent.bind(videoScriptController));
  router.post('/characters/generate', videoScriptController.generateCharacter.bind(videoScriptController));
  router.post('/dialogue/generate', videoScriptController.generateDialogue.bind(videoScriptController));
  router.post('/final/generate', videoScriptController.generateFinalScript.bind(videoScriptController));

  // Note: No helper routes needed in stateless version
  // FE manages all data and sends complete JSON objects
};