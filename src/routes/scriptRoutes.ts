import { Router } from 'express';
import { container } from '../config/container';
import { ScriptController } from '../controllers/ScriptController';

export const setupScriptRoutes = (router: Router): void => {
  const scriptController = container.get<ScriptController>(ScriptController);

  // POST /api/scripts/auto - API tự động tạo kịch bản hoàn chỉnh
  router.post('/scripts/auto', scriptController.createAutoScript.bind(scriptController));

  // POST /api/scripts/topic - Bước 1: Nhập chủ đề
  router.post('/scripts/topic', scriptController.createFromTopic.bind(scriptController));

  // POST /api/scripts/characters - Bước 2: Tạo nhân vật
  router.post('/scripts/characters', scriptController.createCharacters.bind(scriptController));

  // POST /api/scripts/dialogue - Bước 3: Tạo hội thoại
  router.post('/scripts/dialogue', scriptController.createDialogue.bind(scriptController));

  // POST /api/scripts/video - Bước 4: Tạo kịch bản video
  router.post('/scripts/video', scriptController.createVideoScript.bind(scriptController));

  // GET /api/scripts/:id - Xem script hoàn chỉnh
  router.get('/scripts/:id', scriptController.getScript.bind(scriptController));
};