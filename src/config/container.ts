import { Container } from 'inversify';
import { TYPES } from '../types/types';
import {
  IUserService,
  IUserRepository,
  IAuthService,
  ILogger
} from '../types/interfaces';

// Services
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { GeminiService } from '../services/GeminiService';
import { ChatSessionService } from '../services/ChatSessionService';
import { VideoScriptService } from '../services/VideoScriptService';
import { ApiKeyService } from '../services/ApiKeyService';

// Repositories
import { UserRepository } from '../repositories/UserRepository';

// Controllers
import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { ChatSessionController } from '../controllers/ChatSessionController';
import { VideoScriptController } from '../controllers/VideoScriptController';
import { ApiKeyController } from '../controllers/ApiKeyController';

// Middlewares
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';

// Utils
import { Logger } from '../utils/Logger';

const container = new Container();

// Bind utilities
container.bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();

// Bind repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

// Bind services
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<ChatSessionService>(TYPES.ChatSessionService).to(ChatSessionService).inSingletonScope();
container.bind<ApiKeyService>(TYPES.ApiKeyService).to(ApiKeyService).inSingletonScope();
container.bind<VideoScriptService>(TYPES.VideoScriptService).to(VideoScriptService).inSingletonScope();

// Bind controllers
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<ChatSessionController>(TYPES.ChatSessionController).to(ChatSessionController);
container.bind<VideoScriptController>(TYPES.VideoScriptController).to(VideoScriptController);
container.bind<ApiKeyController>(TYPES.ApiKeyController).to(ApiKeyController);

// Bind middlewares
container.bind<AuthMiddleware>('AuthMiddleware').to(AuthMiddleware);
container.bind<ErrorMiddleware>('ErrorMiddleware').to(ErrorMiddleware);

export { container };