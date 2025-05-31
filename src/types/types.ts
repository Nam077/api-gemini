// Dependency Injection Types
export const TYPES = {
  // Services
  UserService: Symbol.for('UserService'),
  AuthService: Symbol.for('AuthService'),
  GeminiService: Symbol.for('GeminiService'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  ConversationRepository: Symbol.for('ConversationRepository'),
  
  // Controllers
  UserController: Symbol.for('UserController'),
  AuthController: Symbol.for('AuthController'),
  ConversationController: Symbol.for('ConversationController'),
  
  // Utilities
  Logger: Symbol.for('Logger'),
  DatabaseConnection: Symbol.for('DatabaseConnection'),
} as const;