export interface User {
  readonly id: number;
  readonly username: string;
  readonly email: string;
}

export interface UserLoginDetails {
  readonly username: string;
  readonly password: string;
}
