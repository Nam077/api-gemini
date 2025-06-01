import { injectable } from 'inversify';
import { ILogger } from '../types/interfaces';

@injectable()
export class Logger implements ILogger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string): string {
    return `[${this.getTimestamp()}] [${level.toUpperCase()}] ${message}`;
  }

  public info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message));
    if (meta) {
      console.log('Meta:', JSON.stringify(meta, null, 2));
    }
  }

  public error(message: string, error?: Error): void {
    console.error(this.formatMessage('error', message));
    if (error) {
      console.error('Stack:', error.stack);
    }
  }

  public warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message));
    if (meta) {
      console.warn('Meta:', JSON.stringify(meta, null, 2));
    }
  }

  public debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message));
      if (meta) {
        console.debug('Meta:', JSON.stringify(meta, null, 2));
      }
    }
  }
}

