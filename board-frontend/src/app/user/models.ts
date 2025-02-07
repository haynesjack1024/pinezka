export interface AdditionalFields {
  readonly name: string;
  readonly value: string;
}

export interface User {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly additionalFields: AdditionalFields[];
}

export interface UserPatchRequest extends Omit<User, 'additionalFields'> {
  readonly additionalFields: Partial<AdditionalFields>[];
  readonly password: string;
}

export interface UserLoginDetails {
  readonly username: string;
  readonly password: string;
}
