export interface User {
  _id: { $oid: string };
  email: string;
  password: string;
  nickname: string;
}

export interface IncommingUser extends Omit<User, "_id"> {}

export interface UserDTO extends Omit<IncommingUser, "password"> {
  id: string;
}
