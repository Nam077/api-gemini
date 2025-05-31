import { Router } from 'express';
import { container } from '../config/container';
import { AuthController } from '../controllers/AuthController';
import { TYPES } from '../types/types';

export const setupAuthRoutes = (router: Router): void => {
  const authController = container.get<AuthController>(TYPES.AuthController);

  // Authentication routes
  router.post('/login', authController.login);
  router.post('/register', authController.register);
  router.post('/validate', authController.validateToken);
};