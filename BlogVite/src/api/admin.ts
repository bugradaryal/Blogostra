import { authApi } from './client';
import type { AdminUser, Post, Statistics } from '../types';

export const getUsers = async () =>
  (await authApi.post<AdminUser[]>('/Admin/GetAllUsers', {})).data;

export const suspendUser = (userId: string, suspend: boolean) =>
  authApi.post('/Admin/SuspendUser', null, { params: { userId, suspend } });

export const getStatistics = async (startDate: Date, endDate: Date) =>
  (
    await authApi.post<Statistics>('/Admin/GetAllStatistics', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
  ).data;

export const getAdminPosts = async (page: number, pageSize: number) =>
  (
    await authApi.get<Post[]>('/Post/GetAllPostsByIndex', {
      params: { CurrentPage: page, index: pageSize },
    })
  ).data;

interface NewPost {
  title: string;
  content: string;
  category: string;
  image: Uint8Array | null;
}

export const addPost = ({ title, content, category, image }: NewPost) =>
  authApi.post('/Admin/AddPost', {
    Title: title,
    Content: content,
    Category: category,
    Image: image ? Array.from(image) : '',
  });

interface PostUpdate {
  id: number;
  title: string;
  content: string;
  category: string;
  image: string;
}

export const updatePost = ({ id, title, content, category, image }: PostUpdate) =>
  authApi.put('/Admin/UpdatePost', {
    Id: id,
    Title: title,
    Content: content,
    Image: image,
    Category: category,
  });

export const removePost = (postId: number) =>
  authApi.delete('/Admin/RemovePost', { data: { postId } });

export const deleteComment = (commentId: number) =>
  authApi.delete('/Admin/DeleteCommentFromPost', { params: { commentId } });
