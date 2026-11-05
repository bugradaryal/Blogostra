import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import {
  addPost,
  deleteComment,
  getAdminPosts,
  getStatistics,
  getUsers,
  removePost,
  suspendUser,
  updatePost,
} from '../api/admin';
import { ADMIN_PAGE_SIZE } from '../constants/pagination';
import { queryKeys } from './queryKeys';

const invalidatePosts = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
    queryClient.invalidateQueries({ queryKey: queryKeys.adminPosts }),
  ]);

export const useAdminPosts = (page: number) =>
  useQuery({
    queryKey: queryKeys.adminPostList(page),
    queryFn: () => getAdminPosts(page, ADMIN_PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

export const useAddPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPost,
    onSuccess: () => invalidatePosts(queryClient),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => invalidatePosts(queryClient),
  });
};

export const useRemovePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removePost,
    onSuccess: () => invalidatePosts(queryClient),
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => invalidatePosts(queryClient),
  });
};

export const useUsers = () => useQuery({ queryKey: queryKeys.users, queryFn: getUsers });

interface SuspendVariables {
  userId: string;
  suspend: boolean;
}

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, suspend }: SuspendVariables) => suspendUser(userId, suspend),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  });
};

export const useStatistics = (start: Date, end: Date) =>
  useQuery({
    queryKey: queryKeys.statistics(start.toISOString(), end.toISOString()),
    queryFn: () => getStatistics(start, end),
  });
