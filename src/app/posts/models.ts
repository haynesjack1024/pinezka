import { User } from '../user/models';

export interface Post {
  readonly id: number;
  readonly city: string;
  readonly category: number;
  readonly author: User;
  readonly title: string;
  readonly content: string;
  readonly created: Date;
  readonly modified: Date;
  readonly expiry: Date;
}
