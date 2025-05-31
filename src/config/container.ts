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

// Repositories
import { UserRepository } from '../repositories/UserRepository';
import { ConversationRepository } from '../repositories/ConversationRepository';

// Controllers
import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { ConversationController } from '../controllers/ConversationController';
import { ScriptController } from '../controllers/ScriptController';

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
container.bind<ConversationRepository>(ConversationRepository).toSelf().inSingletonScope();

// Bind services
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<GeminiService>(GeminiService).toSelf().inSingletonScope();

// Bind controllers
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<ConversationController>(ConversationController).toSelf();
container.bind<ScriptController>(ScriptController).toSelf();

// Bind middlewares
container.bind<AuthMiddleware>('AuthMiddleware').to(AuthMiddleware);
container.bind<ErrorMiddleware>('ErrorMiddleware').to(ErrorMiddleware);

export { container };