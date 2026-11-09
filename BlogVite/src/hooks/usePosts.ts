import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
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

// Yazı detayı sayfada açıkken yeniden çekilmez; değişiklik doğrudan önbelleğe yazılır.
// Liste sorguları yalnızca bayat işaretlenir, ana sayfaya dönünce tazelenir.
const patchPost = (queryClient: QueryClient, postId: number, patch: (post: Post) => Post) =>
  queryClient.setQueryData<Post>(queryKeys.post(postId), (old) => (old ? patch(old) : old));

const markListsStale = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: queryKeys.postLists });

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
    onMutate: async ({ userId, postId, liked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.post(postId) });
      const previous = queryClient.getQueryData<Post>(queryKeys.post(postId));
      patchPost(queryClient, postId, (post) => ({
        ...post,
        likes: liked
          ? (post.likes ?? []).filter((like) => like.user_id !== userId)
          : [...(post.likes ?? []), { id: -Date.now(), user_id: userId, post_id: postId }],
      }));
      return { previous };
    },
    onError: (_error, { postId }, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.post(postId), context.previous);
    },
    onSettled: () => markListsStale(queryClient),
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: (_data, { postId, userName, content }) => {
      patchPost(queryClient, postId, (post) => ({
        ...post,
        comments: [
          ...(post.comments ?? []),
          { id: -Date.now(), userName, content, date: new Date().toISOString() },
        ],
      }));
      return markListsStale(queryClient);
    },
  });
};
