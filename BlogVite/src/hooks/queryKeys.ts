export const queryKeys = {
  posts: ['posts'] as const,
  post: (id: number) => ['posts', 'detail', id] as const,
  postCount: ['posts', 'count'] as const,
  postList: (page: number, query: string) => ['posts', 'list', page, query] as const,
  adminPosts: ['admin', 'posts'] as const,
  adminPostList: (page: number) => ['admin', 'posts', page] as const,
  users: ['admin', 'users'] as const,
  statistics: (start: string, end: string) => ['admin', 'statistics', start, end] as const,
};
