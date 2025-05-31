import { BaseEntity, User as IUser } from '../types/interfaces';

export class User implements IUser {
  constructor(
    public id: string,
    public email: string,
    public username: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isActive: boolean = true,
    public firstName?: string,
    public lastName?: string
  ) {}

  // Utility methods
  public getFullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username;
  }

  public toJSON(): Omit<IUser, 'password'> {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}