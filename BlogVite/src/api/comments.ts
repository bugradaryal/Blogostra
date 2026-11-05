import { authApi } from './client';

interface NewComment {
  userId: string;
  userName: string;
  postId: number;
  content: string;
}

export const addComment = ({ userId, userName, postId, content }: NewComment) =>
  authApi.post('/Comment/AddCommentToPost', {
    user_id: userId,
    UserName: userName,
    post_id: postId,
    Content: content,
  });
