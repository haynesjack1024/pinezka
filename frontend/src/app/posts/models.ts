import { User } from '../user/models';

export interface PostResponse {
  readonly id: number;
  readonly city: string;
  readonly category: number;
  readonly author: User;
  readonly title: string;
  readonly content: string;
  readonly created: string;
  readonly modified: string;
  readonly expiry: string;
  readonly views: number;
}

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
  readonly views: number;
}

export interface PostRequest {
  readonly id?: number;
  readonly city: string;
  readonly category: number | null;
  readonly author: User;
  readonly title: string;
  readonly content: string;
  readonly created: Date;
  readonly modified: Date;
  readonly expiry: Date;
}
