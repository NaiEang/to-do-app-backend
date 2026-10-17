import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ default: 'TODO' })
  status: string;
}
