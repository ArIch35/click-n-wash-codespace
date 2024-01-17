import BaseEntity from './base-entity';

interface Message extends BaseEntity {
  content: string;
  read: boolean;
}

export default Message;
