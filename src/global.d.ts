interface Obj {
  [key: string]: any;
}

type Resolver = (parent: Obj, args: Obj, context: Obj) => Promise<any>;

interface User {
  _id: string;
  avatar: string;
  createdAt: string;
  email: string;
  username: string;
  password: string;
  followers: [];
  following: [];
  notifications: [];
}

interface Post {
  author: string;
  _id: string;
  body: string;
  createdAt: string;
  likes: { author: string }[];
  comments: { author: string; body: string }[];
}

interface UserToken {
  id: string;
  username: string;
  password: string;
  email: string;
  avatar: string;
  iat: number;
  exp: number;
}
