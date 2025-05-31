import { Router, Application } from 'express';
import { setupAuthRoutes } from '../routes/authRoutes';
import { setupUserRoutes } from '../routes/userRoutes';
import { setupConversationRoutes } from '../routes/conversationRoutes';
import { setupScriptRoutes } from '../routes/scriptRoutes';

interface RouteConfig {
  path: string;
  setupFunction: (router: Router) => void;
}

export class RouteManager {
  private routes: RouteConfig[] = [
    { path: '/auth', setupFunction: setupAuthRoutes },
    { path: '', setupFunction: setupUserRoutes }, // Users routes go to base path
    { path: '', setupFunction: setupConversationRoutes }, // Conversation routes go to base path
    { path: '', setupFunction: setupScriptRoutes }, // Script routes go to base path
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