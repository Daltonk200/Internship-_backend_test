import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  create(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: this.idCounter++,
      createdAt: new Date(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, userData: Partial<User>): User {
    const user = this.findOne(id);
    Object.assign(user, userData);
    return user;
  }

  delete(id: number): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }
      }
