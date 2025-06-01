// Dependency Injection Types
export const TYPES = {
  // Services
  UserService: Symbol.for('UserService'),
  AuthService: Symbol.for('AuthService'),
  GeminiService: Symbol.for('GeminiService'),
  ChatSessionService: Symbol.for('ChatSessionService'),
  VideoScriptService: Symbol.for('VideoScriptService'),
  ApiKeyService: Symbol.for('ApiKeyService'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  ConversationRepository: Symbol.for('ConversationRepository'),
  
  // Controllers
  UserController: Symbol.for('UserController'),
  AuthController: Symbol.for('AuthController'),
  ConversationController: Symbol.for('ConversationController'),
  ChatSessionController: Symbol.for('ChatSessionController'),
  VideoScriptController: Symbol.for('VideoScriptController'),
  ApiKeyController: Symbol.for('ApiKeyController'),
  
  // Utilities
  Logger: Symbol.for('Logger'),
  DatabaseConnection: Symbol.for('DatabaseConnection'),
} as const;