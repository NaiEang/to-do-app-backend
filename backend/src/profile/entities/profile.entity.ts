import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 100 })
  displayName: string;

  @Column({ length: 150 })
  email: string;
}
