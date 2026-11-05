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
import type { BlogLocationState, Post, PostComment } from '@/types';

const BlogContent = ({ post }: { post: Post }) => {
  const { t } = useTranslation('blogtable');
  const { t: tCategory } = useTranslation('homepagetable');
  const { user } = useAuth();
  const toggleLike = useToggleLike();
  const addComment = useAddComment();

  const [comments, setComments] = useState<Pick<PostComment, 'userName' | 'content'>[]>(
    post.comments ?? [],
  );
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(
    !!user && !!post.likes?.some((like) => like.user_id === user.Id),
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);

  const categoryName = post.categories?.name;

  const submitComment = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addComment.mutate(
      { userId: user.Id, userName: user.UserName, postId: post.id, content: commentText },
      {
        onSuccess: () => {
          setComments([...comments, { userName: user.UserName, content: commentText }]);
          setCommentText('');
        },
      },
    );
  };

  const handleLike = () => {
    if (!user) return;

    toggleLike.mutate(
      { userId: user.Id, postId: post.id, liked: isLiked },
      {
        onSuccess: () => {
          setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
          setIsLiked(!isLiked);
        },
      },
    );
  };

  return (
    <article data-category={categoryName} className="mx-auto max-w-2xl">
      <Seo
        title={post.title}
        description={post.content.replace(/\s+/g, ' ').trim().slice(0, 160)}
        path={postPath(post)}
        type="article"
      />

      <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="size-4" />
        {t('back')}
      </Link>

      {categoryName && (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-cat" />
          {t('category')}: {tCategory(categoryName)}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('date')}: {formatDate(post.date)}
      </p>

      <PostCover post={post} className="mt-6 rounded-lg" />

      <div className="mt-6 whitespace-pre-wrap break-words font-serif text-lg leading-8">
        {post.content}
      </div>

      <div className="mt-8 flex items-center gap-4 border-y py-3">
        <button
          onClick={handleLike}
          disabled={!user || toggleLike.isPending}
          aria-pressed={isLiked}
          className={`${button('outline', 'sm')} ${isLiked ? 'text-cat-ink' : ''}`}
        >
          <ThumbsUp />
          {likeCount}
        </button>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="size-4" />
          {comments.length}
        </span>
      </div>

      <h2 className="mt-8 text-xl font-semibold">{t('comments')}</h2>
      <div className="mt-4 grid gap-5">
        {comments.map((comment, index) => (
          <Comment key={index} userName={comment.userName} content={comment.content} />
        ))}
      </div>

      {user && (
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
          <button
            type="submit"
            disabled={addComment.isPending}
            className={`${button()} justify-self-start`}
          >
            {t('commentbutton')}
          </button>
        </form>
      )}
    </article>
  );
};

const Blog = () => {
  const { id } = useParams();
  const { state } = useLocation() as { state: BlogLocationState | null };
  const { isLoading } = useAuth();

  const { data: post, isPending, isError } = usePost(Number(id), state?.post);

  if (isLoading || (isPending && !isError)) {
    return <p className="text-muted-foreground">...</p>;
  }
  if (isError || !post) {
    return <Navigate to="/" replace />;
  }
  return <BlogContent key={post.id} post={post} />;
};

export default Blog;
