import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { IUserService, CreateUserDto, UpdateUserDto, ILogger } from '../types/interfaces';
import { TYPES } from '../types/types';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info('UserController: Get all users request received');
      
      const users = await this.userService.getAllUsers();
      
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users.map(user => ({
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
      });
    } catch (error) {
      this.logger.error('UserController: Get all users error', error as Error);
      res.status(500).json({
        success: false,
        message: (error as Error).message,
        data: null
      });
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info('UserController: Get user by ID request received', { id: req.params.id });
      
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      this.logger.error('UserController: Get user by ID error', error as Error);
      res.status(500).json({
        success: false,
        message: (error as Error).message,
        data: null
      });
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info('UserController: Create user request received');
      
      const userData: CreateUserDto = req.body;
      const newUser = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        }
      });
    } catch (error) {
      this.logger.error('UserController: Create user error', error as Error);
      const statusCode = (error as Error).message.includes('already exists') ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        message: (error as Error).message,
        data: null
      });
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info('UserController: Update user request received', { id: req.params.id });
      
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;
      const updatedUser = await this.userService.updateUser(id, userData);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          isActive: updatedUser.isActive,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      });
    } catch (error) {
      this.logger.error('UserController: Update user error', error as Error);
      const statusCode = (error as Error).message.includes('already taken') ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        message: (error as Error).message,
        data: null
      });
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info('UserController: Delete user request received', { id: req.params.id });
      
      const { id } = req.params;
      const deleted = await this.userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: null
      });
    } catch (error) {
      this.logger.error('UserController: Delete user error', error as Error);
      res.status(500).json({
        success: false,
        message: (error as Error).message,
        data: null
      });
    }
  };
}