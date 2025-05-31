import { Router } from 'express';
import { container } from '../config/container';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { TYPES } from '../types/types';

export const setupUserRoutes = (router: Router): void => {
  const userController = container.get<UserController>(TYPES.UserController);
  const authMiddleware = container.get<AuthMiddleware>('AuthMiddleware');

  // Public routes (no authentication required)
  router.post('/users', userController.createUser);

  // Protected routes (authentication required)
  router.get('/users', authMiddleware.authenticate, userController.getAllUsers);
  router.get('/users/:id', authMiddleware.authenticate, userController.getUserById);
  router.put('/users/:id', authMiddleware.authenticate, userController.updateUser);
  router.delete('/users/:id', authMiddleware.authenticate, userController.deleteUser);
};