import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { IAuthService, LoginDto, CreateUserDto, ILogger } from '../types/interfaces';
import { TYPES } from '../types/types';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info('AuthController: Login request received');
      
      const credentials: LoginDto = req.body;
      const result = await this.authService.login(credentials);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      this.logger.error('AuthController: Login error', error as Error);
      res.status(401).json({
        success: false,
        message: (error as Error).message,
        data: null
      });
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info('AuthController: Register request received');
      
      const userData: CreateUserDto = req.body;
      const result = await this.authService.register(userData);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result
      });
    } catch (error) {
      this.logger.error('AuthController: Register error', error as Error);
      res.status(400).json({
        success: false,
        message: (error as Error).message,
        data: null
      });
    }
  };

  public validateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'No token provided',
          data: null
        });
        return;
      }

      const user = await this.authService.validateToken(token);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid token',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: { user }
      });
    } catch (error) {
      this.logger.error('AuthController: Token validation error', error as Error);
      res.status(401).json({
        success: false,
        message: 'Token validation failed',
        data: null
      });
    }
  };
}