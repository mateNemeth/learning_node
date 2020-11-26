export interface CustomRequest<T> extends Express.Request {
  body: T;
}

export interface IUserRegister {
  name: string;
  email: string;
}

export interface IUserDeactivate {
  id: number;
}

export interface IUserNameChange {
  id: number;
  name: string;
}
