import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addComment } from '../api/comments';
import {
  dislikePost,
  getPostById,
  getPostCount,
  getPosts,
  likePost,
  searchPosts,
} from '../api/posts';
import type { Post } from '../types';
import { HOME_PAGE_SIZE } from '../constants/pagination';
import { queryKeys } from './queryKeys';

export const usePostCount = () =>
  useQuery({ queryKey: queryKeys.postCount, queryFn: getPostCount });

export const usePost = (id: number, initialPost?: Post) =>
  useQuery({
    queryKey: queryKeys.post(id),
    queryFn: () => getPostById(id),
    initialData: initialPost,
    enabled: Number.isInteger(id),
    retry: false,
  });

export const usePosts = (page: number, query: string) =>
  useQuery({
    queryKey: queryKeys.postList(page, query),
    queryFn: () => (query ? searchPosts(query, page) : getPosts(page, HOME_PAGE_SIZE)),
    placeholderData: keepPreviousData,
  });

interface LikeVariables {
  userId: string;
  postId: number;
  liked: boolean;
}

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId, liked }: LikeVariables) =>
      liked ? dislikePost(userId, postId) : likePost(userId, postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
  });
};
