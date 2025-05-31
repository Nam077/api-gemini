import { injectable, inject } from 'inversify';
import { IAuthService, IUserRepository, LoginDto, CreateUserDto, AuthResponse, User, ILogger } from '../types/interfaces';
import { TYPES } from '../types/types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@injectable()
export class AuthService implements IAuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly saltRounds: number = 10;

  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  }

  public async login(credentials: LoginDto): Promise<AuthResponse> {
    this.logger.info('AuthService: Attempting login', { email: credentials.email });

    if (!credentials.email || !credentials.password) {
      this.logger.warn('AuthService: Missing credentials');
      throw new Error('Email and password are required');
    }

    try {
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user) {
        this.logger.warn('AuthService: User not found', { email: credentials.email });
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        this.logger.warn('AuthService: User account is inactive', { email: credentials.email });
        throw new Error('Account is inactive');
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        this.logger.warn('AuthService: Invalid password', { email: credentials.email });
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user);
      this.logger.info('AuthService: Login successful', { userId: user.id });

      return {
        user: this.sanitizeUser(user),
        token
      };
    } catch (error) {
      this.logger.error('AuthService: Login error', error as Error);
      throw error;
    }
  }

  public async register(userData: CreateUserDto): Promise<AuthResponse> {
    this.logger.info('AuthService: Attempting registration', { email: userData.email });

    if (!userData.email || !userData.username || !userData.password) {
      this.logger.warn('AuthService: Missing registration data');
      throw new Error('Email, username, and password are required');
    }

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        this.logger.warn('AuthService: User already exists', { email: userData.email });
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);
      
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword
      });

      const token = this.generateToken(newUser);
      this.logger.info('AuthService: Registration successful', { userId: newUser.id });

      return {
        user: this.sanitizeUser(newUser),
        token
      };
    } catch (error) {
      this.logger.error('AuthService: Registration error', error as Error);
      throw error;
    }
  }

  public async validateToken(token: string): Promise<User | null> {
    this.logger.debug('AuthService: Validating token');

    if (!token) {
      this.logger.warn('AuthService: No token provided');
      return null;
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        this.logger.warn('AuthService: User not found or inactive', { userId: decoded.userId });
        return null;
      }

      this.logger.debug('AuthService: Token validation successful', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.warn('AuthService: Token validation failed', error as Error);
      return null;
    }
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn as any
    });
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}