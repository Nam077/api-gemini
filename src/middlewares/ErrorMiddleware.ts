import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { ILogger } from '../types/interfaces';
import { TYPES } from '../types/types';

@injectable()
export class ErrorMiddleware {
  constructor(
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  public handleErrors = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    this.logger.error('Global error handler', error);

    // Default error response
    const errorResponse = {
      success: false,
      message: 'Internal server error',
      data: null,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        originalMessage: error.message 
      })
    };

    // Handle specific error types
    if (error.name === 'ValidationError') {
      res.status(400).json({
        ...errorResponse,
        message: 'Validation error',
      });
      return;
    }

    if (error.name === 'UnauthorizedError') {
      res.status(401).json({
        ...errorResponse,
        message: 'Unauthorized access',
      });
      return;
    }

    if (error.name === 'ForbiddenError') {
      res.status(403).json({
        ...errorResponse,
        message: 'Forbidden access',
      });
      return;
    }

    if (error.name === 'NotFoundError') {
      res.status(404).json({
        ...errorResponse,
        message: 'Resource not found',
      });
      return;
    }

    // Default to 500 for unhandled errors
    res.status(500).json(errorResponse);
  };

  public handleNotFound = (req: Request, res: Response, next: NextFunction): void => {
    this.logger.warn('Route not found', { 
      method: req.method, 
      url: req.url,
      ip: req.ip 
    });

    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.url} not found`,
      data: null
    });
  };
}