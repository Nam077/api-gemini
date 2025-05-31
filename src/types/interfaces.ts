// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User interfaces
export interface User extends BaseEntity {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Repository interfaces
export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserDto): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

// Service interfaces
export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(userData: CreateUserDto): Promise<User>;
  updateUser(id: string, userData: UpdateUserDto): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}

export interface IAuthService {
  login(credentials: LoginDto): Promise<AuthResponse>;
  register(userData: CreateUserDto): Promise<AuthResponse>;
  validateToken(token: string): Promise<User | null>;
}

// Utility interfaces
export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, error?: Error): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}