import {User} from "./user.types";

export type Blog = {
  id: string;
  image_url: string;
  title: string;
  content: string;
  tags: string[];
  publisherId: string;
  total_likes: number;
  total_comments: number;
  total_views: number;
  created_at: Date;
  updated_at: Date;
};

export type CreateBlogInput = {
  image_url: string;
  title: string;
  content: string;
  tags: string[];
};

export type BlogWithPublisher = Blog & {
  publisher: User;
};
