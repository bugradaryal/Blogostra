import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { postPath } from '@/utils/slug';
import type { BlogLocationState, Post } from '@/types';
import PostCover from './PostCover';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation('homepagetable');

  const isLiked = !!user && !!post.likes?.some((like) => like.user_id === user.Id);
  const categoryName = post.categories?.name;

  const openPost = () => {
    const state: BlogLocationState = { post };
    navigate(postPath(post), { state });
  };

  return (
    <article data-category={categoryName}>
      <button onClick={openPost} className="block w-full overflow-hidden rounded-lg">
        <PostCover post={post} />
      </button>
      {categoryName && (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-cat" />
          {t(categoryName)}
        </p>
      )}
      <h2 className="mt-1 text-xl font-semibold">
        <button onClick={openPost} className="text-left hover:underline">
          {post.title}
        </button>
      </h2>
      <p className="mt-2 line-clamp-3 font-serif text-muted-foreground">{post.content}</p>
      <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MessageCircle className="size-4" />
          {post.comments?.length ?? 0}
        </span>
        <span className={`flex items-center gap-1.5 ${isLiked ? 'text-cat-ink' : ''}`}>
          <ThumbsUp className="size-4" />
          {post.likes?.length ?? 0}
        </span>
      </div>
    </article>
  );
};

export default PostCard;
