import { Router, Application } from 'express';
import { setupAuthRoutes } from '../routes/authRoutes';
import { setupUserRoutes } from '../routes/userRoutes';
import { setupChatSessionRoutes } from '../routes/chatSessionRoutes';
import { setupVideoScriptRoutes } from '../routes/videoScriptRoutes';
import { setupApiKeyRoutes } from '../routes/apiKeyRoutes';

interface RouteConfig {
  path: string;
  setupFunction: (router: Router) => void;
}

export class RouteManager {
  private routes: RouteConfig[] = [
    { path: '/auth', setupFunction: setupAuthRoutes },
    { path: '', setupFunction: setupUserRoutes },
    { path: '/chat', setupFunction: setupChatSessionRoutes },
    { path: '/video-script', setupFunction: setupVideoScriptRoutes },
    { path: '', setupFunction: setupApiKeyRoutes },
  ];

  public setupRoutes(app: Application, basePrefix: string = '/api/v1'): void {
    this.routes.forEach(({ path, setupFunction }) => {
      const router = Router();
      setupFunction(router);
      app.use(`${basePrefix}${path}`, router);
    });
  }

  public addRoute(path: string, setupFunction: (router: Router) => void): void {
    this.routes.push({ path, setupFunction });
  }
}