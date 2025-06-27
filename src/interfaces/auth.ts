export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
  userid: number;
//   user: AuthenticatedUser;
}
