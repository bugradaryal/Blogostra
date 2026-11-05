import { api, authApi } from './client';
import type { Post } from '../types';

export const getPostCount = async () => (await api.get<number>('/Post/GetPostCounts')).data;

export const getPosts = async (page: number, pageSize: number) =>
  (
    await api.get<Post[]>('/Post/GetAllPostsByIndex', {
      params: { CurrentPage: page, index: pageSize },
    })
  ).data;

export const searchPosts = async (search: string, page: number) =>
  (await api.get<Post[]>('/Post/GetPostBySearch', { params: { search, index: page } })).data;

export const likePost = (userId: string, postId: number) =>
  authApi.post('/Post/LikeThePost', { UserId: userId, PostId: postId });

export const dislikePost = (userId: string, postId: number) =>
  authApi.post('/Post/DislikeThePost', { UserId: userId, PostId: postId });

export const getPostById = async (id: number) =>
  (await api.get<Post>('/Post/GetPostById', { params: { id } })).data;
