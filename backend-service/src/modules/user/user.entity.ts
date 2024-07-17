import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  age: number;

  @Column()
  citizenship: string;

  @Column()
  jobtitle: string;

  @Column()
  gender: string;
}
