import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Express } from 'express';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    return this.usersService.delete(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // 1MB
          new FileTypeValidator({ fileType: 'text/csv' }),
        ],
      })
    )
    file: Express.Multer.File,
  ): Promise<{ message: string; count: number }> {
    const results = await this.parseCSV(file.buffer);
    results.forEach((user) => {
      this.usersService.create(user);
    });

    return { message: 'CSV processed successfully', count: results.length };
  }

  private parseCSV(buffer: Buffer): Promise<Omit<User, 'id' | 'createdAt'>[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = Readable.from(buffer.toString());

      stream
        .pipe(csv())
        .on('data', (data) => {
          if (data.name && data.email) {
            results.push({
              name: data.name,
              email: data.email,
            });
          }
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}
