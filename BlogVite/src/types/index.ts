export interface User {
  Id: string;
  UserName: string;
  Email: string;
  Name: string;
  SurName: string;
  PhoneNumber: string;
  Address: string;
}

export interface AdminUser {
  id: string;
  userName: string;
  email: string;
  accountSuspended: boolean;
}

export interface Like {
  id: number;
  user_id: string;
  post_id: number;
}

export interface PostComment {
  id: number;
  content: string;
  userName: string;
  date?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string | null;
  likes: Like[] | null;
  comments: PostComment[] | null;
  categories: { name: string } | null;
}

export interface Statistics {
  postStatics: { month: string | number; postCount: number }[];
  commentStatics: { month: string | number; commentCount: number }[];
  likeStatics: { month: string | number; likeCount: number }[];
  userCount: number;
}

export interface BlogLocationState {
  post: Post;
}

export interface ManageCommentsLocationState {
  comments: PostComment[];
}
