import 'reflect-metadata';
import { App } from './app';

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', error.name, error.message);
  process.exit(1);
});

// Create and start the application
const app = new App();
app.listen();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error('Reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});