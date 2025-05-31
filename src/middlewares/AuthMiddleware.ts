import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthService, ILogger } from '../types/interfaces';
import { TYPES } from '../types/types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  public authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        this.logger.warn('AuthMiddleware: No valid authorization header');
        res.status(401).json({
          success: false,
          message: 'Access token is required',
          data: null
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const user = await this.authService.validateToken(token);

      if (!user) {
        this.logger.warn('AuthMiddleware: Invalid token');
        res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
          data: null
        });
        return;
      }

      req.user = user;
      this.logger.debug('AuthMiddleware: User authenticated', { userId: user.id });
      next();
    } catch (error) {
      this.logger.error('AuthMiddleware: Authentication error', error as Error);
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        data: null
      });
    }
  };

  public optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const user = await this.authService.validateToken(token);
        if (user) {
          req.user = user;
          this.logger.debug('AuthMiddleware: Optional auth - user authenticated', { userId: user.id });
        }
      }
      
      next();
    } catch (error) {
      this.logger.warn('AuthMiddleware: Optional auth error', error as Error);
      next(); // Continue even if optional auth fails
    }
  };
}