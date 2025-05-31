import { injectable, inject } from 'inversify';
import { IUserService, IUserRepository, CreateUserDto, UpdateUserDto, User, ILogger } from '../types/interfaces';
import { TYPES } from '../types/types';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  public async getAllUsers(): Promise<User[]> {
    this.logger.info('Service: Getting all users');
    try {
      const users = await this.userRepository.findAll();
      this.logger.info(`Service: Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Service: Error getting users', error as Error);
      throw new Error('Failed to retrieve users');
    }
  }

  public async getUserById(id: string): Promise<User | null> {
    this.logger.info('Service: Getting user by ID', { id });
    
    if (!id) {
      this.logger.warn('Service: Invalid user ID provided');
      throw new Error('User ID is required');
    }

    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        this.logger.warn('Service: User not found', { id });
      }
      return user;
    } catch (error) {
      this.logger.error('Service: Error getting user by ID', error as Error);
      throw new Error('Failed to retrieve user');
    }
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    this.logger.info('Service: Creating new user', { email: userData.email });
    
    // Validation
    if (!userData.email || !userData.username || !userData.password) {
      this.logger.warn('Service: Missing required fields for user creation');
      throw new Error('Email, username, and password are required');
    }

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        this.logger.warn('Service: User already exists', { email: userData.email });
        throw new Error('User with this email already exists');
      }

      const newUser = await this.userRepository.create(userData);
      this.logger.info('Service: User created successfully', { id: newUser.id });
      return newUser;
    } catch (error) {
      this.logger.error('Service: Error creating user', error as Error);
      throw error; // Re-throw to maintain error context
    }
  }

  public async updateUser(id: string, userData: UpdateUserDto): Promise<User | null> {
    this.logger.info('Service: Updating user', { id });
    
    if (!id) {
      this.logger.warn('Service: Invalid user ID provided for update');
      throw new Error('User ID is required');
    }

    try {
      // Check if email is being updated and if it's already taken
      if (userData.email) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
          this.logger.warn('Service: Email already taken', { email: userData.email });
          throw new Error('Email is already taken by another user');
        }
      }

      const updatedUser = await this.userRepository.update(id, userData);
      if (!updatedUser) {
        this.logger.warn('Service: User not found for update', { id });
      } else {
        this.logger.info('Service: User updated successfully', { id });
      }
      return updatedUser;
    } catch (error) {
      this.logger.error('Service: Error updating user', error as Error);
      throw error;
    }
  }

  public async deleteUser(id: string): Promise<boolean> {
    this.logger.info('Service: Deleting user', { id });
    
    if (!id) {
      this.logger.warn('Service: Invalid user ID provided for deletion');
      throw new Error('User ID is required');
    }

    try {
      const deleted = await this.userRepository.delete(id);
      if (deleted) {
        this.logger.info('Service: User deleted successfully', { id });
      } else {
        this.logger.warn('Service: User not found for deletion', { id });
      }
      return deleted;
    } catch (error) {
      this.logger.error('Service: Error deleting user', error as Error);
      throw new Error('Failed to delete user');
    }
  }
}