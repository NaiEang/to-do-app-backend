import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { TodoStatus } from '../entities/todo.entity.js';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsIn(['TODO', 'IN_PROGRESS', 'DONE'])
  status?: TodoStatus;
}
