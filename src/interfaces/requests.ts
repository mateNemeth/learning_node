export interface CustomRequest<T> extends Express.Request {
  body: T;
}

/**
 * Request interfaces for "/user" routes
 */

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

/**
 * Request interfaces for "/notification-template" routes
 */

export interface INewNotificationTemplate {
  title: string;
  body: string;
  type?: string;
  send_at?: string;
}

export interface IUpdateNotificationTemplate {
  id: number;
  title?: string;
  body?: string;
  type?: string;
  send_at?: string;
}
