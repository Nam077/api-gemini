import { injectable, inject } from 'inversify';
import { IUserRepository, CreateUserDto, UpdateUserDto, User as IUser, ILogger } from '../types/interfaces';
import { User } from '../models/User';
import { TYPES } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class UserRepository implements IUserRepository {
  // In-memory storage for demo purposes
  private users: User[] = [];

  constructor(
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleUser = new User(
      uuidv4(),
      'admin@example.com',
      'admin',
      '$2b$10$hashed_password_here', // In real app, hash this
      new Date(),
      new Date(),
      true,
      'Admin',
      'User'
    );
    this.users.push(sampleUser);
    this.logger.info('Initialized sample user data');
  }

  public async findAll(): Promise<User[]> {
    this.logger.debug('Fetching all users');
    return [...this.users];
  }

  public async findById(id: string): Promise<User | null> {
    this.logger.debug('Finding user by ID', { id });
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    this.logger.debug('Finding user by email', { email });
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  public async create(userData: CreateUserDto): Promise<User> {
    this.logger.info('Creating new user', { email: userData.email });
    
    const newUser = new User(
      uuidv4(),
      userData.email,
      userData.username,
      userData.password, // In real app, hash this
      new Date(),
      new Date(),
      true,
      userData.firstName,
      userData.lastName
    );

    this.users.push(newUser);
    this.logger.info('User created successfully', { id: newUser.id });
    return newUser;
  }

  public async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    this.logger.info('Updating user', { id });
    
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      this.logger.warn('User not found for update', { id });
      return null;
    }

    const user = this.users[userIndex];
    
    // Update fields
    if (userData.email !== undefined) user.email = userData.email;
    if (userData.username !== undefined) user.username = userData.username;
    if (userData.firstName !== undefined) user.firstName = userData.firstName;
    if (userData.lastName !== undefined) user.lastName = userData.lastName;
    if (userData.isActive !== undefined) user.isActive = userData.isActive;
    
    user.updateTimestamp();
    
    this.logger.info('User updated successfully', { id });
    return user;
  }

  public async delete(id: string): Promise<boolean> {
    this.logger.info('Deleting user', { id });
    
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      this.logger.warn('User not found for deletion', { id });
      return false;
    }

    this.users.splice(userIndex, 1);
    this.logger.info('User deleted successfully', { id });
    return true;
  }
}