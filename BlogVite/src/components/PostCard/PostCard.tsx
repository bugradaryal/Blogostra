import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { formatDate } from '@/utils/date';
import { postPath } from '@/utils/slug';
import type { BlogLocationState, Post } from '@/types';
import PostCover from './PostCover';

interface PostCardProps {
  post: Post;
  index?: number;
  featured?: boolean;
}

const PostCard = ({ post, index = 0, featured = false }: PostCardProps) => {
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
    <article
      data-category={categoryName}
      style={{ animationDelay: `${Math.min(index, 10) * 55}ms` }}
      className={`group flex animate-rise flex-col overflow-hidden rounded-2xl border bg-surface transition duration-300 hover:-translate-y-1 hover:border-cat/50 hover:shadow-[0_20px_40px_-20px_var(--cat)] ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      <button
        onClick={openPost}
        tabIndex={-1}
        aria-hidden="true"
        className="block w-full overflow-hidden"
      >
        <PostCover
          post={post}
          aspect={featured ? 'aspect-[2/1]' : 'aspect-video'}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </button>
      <div className="flex flex-1 flex-col p-5">
        {categoryName && (
          <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-cat-soft px-2.5 py-0.5 text-xs font-semibold text-cat-ink">
            <span className="size-1.5 rounded-full bg-cat" />
            {t(categoryName)}
          </p>
        )}
        <h2
          className={`mt-3 leading-snug font-bold tracking-tight ${
            featured ? 'text-2xl sm:text-3xl' : 'text-xl'
          }`}
        >
          <button onClick={openPost} className="text-left transition-colors hover:text-primary">
            {post.title}
          </button>
        </h2>
        <p
          className={`mt-2 font-serif text-muted-foreground ${
            featured ? 'line-clamp-4' : 'line-clamp-3'
          }`}
        >
          {post.content}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5 text-sm text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <MessageCircle className="size-4" />
              {post.comments?.length ?? 0}
            </span>
            <span className={`flex items-center gap-1.5 ${isLiked ? 'text-like' : ''}`}>
              <ThumbsUp className={`size-4 ${isLiked ? 'fill-current' : ''}`} />
              {post.likes?.length ?? 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
