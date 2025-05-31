import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { container } from './config/container';
import { RouteManager } from './utils/routerUtils';
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { ILogger } from './types/interfaces';
import { TYPES } from './types/types';

// Load environment variables
dotenv.config();

export class App {
  public app: Application;
  private logger: ILogger;
  private errorMiddleware: ErrorMiddleware;

  constructor() {
    this.app = express();
    this.logger = container.get<ILogger>(TYPES.Logger);
    this.errorMiddleware = container.get<ErrorMiddleware>('ErrorMiddleware');
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    this.app.use(morgan('combined'));

    this.logger.info('Middlewares initialized successfully');
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'API is running successfully',
        data: {
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
          version: process.env.npm_package_version || '1.0.0'
        }
      });
    });

    // Setup all routes using RouteManager
    const apiVersion = process.env.API_VERSION || 'v1';
    const routeManager = new RouteManager();
    routeManager.setupRoutes(this.app, `/api/${apiVersion}`);

    this.logger.info('Routes initialized successfully');
  }

  private initializeErrorHandling(): void {
    // Handle 404 - Route not found
    this.app.use(this.errorMiddleware.handleNotFound);

    // Global error handler
    this.app.use(this.errorMiddleware.handleErrors);

    this.logger.info('Error handling initialized successfully');
  }

  public listen(): void {
    const port = process.env.PORT || 3000;
    
    this.app.listen(port, () => {
      this.logger.info(`🚀 Server is running on port ${port}`);
      this.logger.info(`📡 API endpoints available at:`);
      this.logger.info(`   - Health check: http://localhost:${port}/health`);
      this.logger.info(`   - Authentication: http://localhost:${port}/api/v1/auth`);
      this.logger.info(`   - Users: http://localhost:${port}/api/v1/users`);
      this.logger.info(`   - Conversations: http://localhost:${port}/api/v1/conversations`);
      this.logger.info(`   - Chat with Gemini: http://localhost:${port}/api/v1/conversations/chat`);
      this.logger.info(`   - Video Scripts: http://localhost:${port}/api/v1/scripts`);
      this.logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}