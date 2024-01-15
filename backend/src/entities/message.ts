import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from './base-entity';
import User from './user';

@Entity()
class Message extends BaseEntity {
  @Column()
  content!: string;

  @Column()
  read: boolean = false;

  @ManyToOne(() => User, (user) => user.inbox)
  to!: User;
}

export default Message;
