import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MessageCircle, ThumbsUp } from 'lucide-react';
import Comment from '@/components/Comment/Comment';
import PostCover from '@/components/PostCard/PostCover';
import Seo from '@/components/Seo';
import { useAuth } from '@/auth/useAuth';
import { useAddComment, usePost, useToggleLike } from '@/hooks/usePosts';
import { button, textareaClass } from '@/lib/classes';
import { formatDate } from '@/utils/date';
import { postPath } from '@/utils/slug';
import type { BlogLocationState, Post } from '@/types';
import { getCommentError } from '@/utils/comment';

const BlogContent = ({ post }: { post: Post }) => {
  const { t } = useTranslation('blogtable');
  const { t: tCategory } = useTranslation('homepagetable');
  const { user } = useAuth();
  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const [commentText, setCommentText] = useState('');

  const likes = post.likes ?? [];
  const comments = post.comments ?? [];
  const isLiked = !!user && likes.some((like) => like.user_id === user.Id);
  const categoryName = post.categories?.name;

  const submitComment = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    addComment.mutate(
      { userId: user.Id, userName: user.UserName, postId: post.id, content: commentText },
      { onSuccess: () => setCommentText('') },
    );
  };

  const handleLike = () => {
    if (!user) return;
    toggleLike.mutate({ userId: user.Id, postId: post.id, liked: isLiked });
  };

  return (
    <article data-category={categoryName}>
      <Seo
        title={post.title}
        description={post.content.replace(/\s+/g, ' ').trim().slice(0, 160)}
        path={postPath(post)}
        type="article"
      />

      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t('back')}
      </Link>

      <PostCover
        post={post}
        aspect="aspect-[16/9] lg:aspect-[21/8]"
        className="mt-5 animate-rise rounded-3xl"
      />

      <div className="mx-auto mt-8 max-w-8xl">
        {categoryName && (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-cat-soft px-3 py-1 text-sm font-semibold text-cat-ink">
            <span className="size-2 rounded-full bg-cat" />
            {tCategory(categoryName)}
          </p>
        )}
        <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{formatDate(post.date)}</p>

        <div className="mt-8 break-words whitespace-pre-wrap font-serif text-lg leading-8">
          {post.content}
        </div>

        <div className="mt-10 flex items-center gap-3 border-y py-4">
          <button
            onClick={handleLike}
            disabled={!user || toggleLike.isPending}
            aria-pressed={isLiked}
            className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition duration-150 active:scale-95 disabled:opacity-60 ${
              isLiked
                ? 'border-like bg-like/10 text-like'
                : 'border-input text-muted-foreground enabled:hover:bg-muted enabled:hover:text-foreground'
            }`}
          >
            <ThumbsUp className={`size-4 ${isLiked ? 'animate-pop fill-current' : ''}`} />
            {likes.length}
          </button>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="size-4" />
            {comments.length}
          </span>
        </div>

        <h2 className="mt-8 text-xl font-bold">{t('comments')}</h2>
        <div className="mt-5 grid gap-4">
          {comments.map((comment, index) => (
            <Comment key={comment.id ?? index} userName={comment.userName} content={comment.content} />
          ))}
        </div>

        {user ? (
          <form onSubmit={submitComment} className="mt-6 grid gap-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              name="Content"
              rows={3}
              placeholder={t('commenttext') + '...'}
              aria-label={t('comments')}
              required
              className={textareaClass}
            />
            {addComment.isError && (
              <p className="text-sm text-destructive">{getCommentError(addComment.error)}</p>
            )}
            <button
              type="submit"
              disabled={addComment.isPending}
              className={`${button()} justify-self-start`}
            >
              {t('commentbutton')}
            </button>
          </form>
        ) : (
          <p className="mt-6 rounded-xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
            <Link to="/Login" className="font-semibold text-primary hover:underline">
              {t('loginprompt')}
            </Link>
          </p>
        )}
      </div>
    </article>
  );
};

const Blog = () => {
  const { id } = useParams();
  const { state } = useLocation() as { state: BlogLocationState | null };
  const { isLoading } = useAuth();
  const postId = Number(id);

  const { data: post, isError } = usePost(postId, state?.post);

  if (!Number.isInteger(postId)) return <Navigate to="/" replace />;
  // Veri varsa, arka plandaki bir yenileme hatası sayfayı kapatmamalı.
  if (!post) {
    return isError ? <Navigate to="/" replace /> : <p className="text-muted-foreground">...</p>;
  }
  if (isLoading) return <p className="text-muted-foreground">...</p>;

  return <BlogContent key={post.id} post={post} />;
};

export default Blog;
