export type PostUser = {
  username: string;
  email: string;
  password: string;
};

export type User = {
  user_id: number;
  username: string;
  email: string;
};

export type LoginUserData = {
  email: string;
  password: string;
};

export type LoggedInUser = {
  isLoggedIn: boolean;
  username: string;
  email: string;
};


