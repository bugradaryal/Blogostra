import { postImageSrc } from '@/utils/image';
import type { Post } from '@/types';

interface PostCoverProps {
  post: Post;
  className?: string;
}

const PostCover = ({ post, className = '' }: PostCoverProps) => {
  const src = postImageSrc(post.image);

  if (src) {
    return (
      <img
        src={src}
        alt={post.title}
        loading="lazy"
        className={`aspect-video w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex aspect-video w-full items-end bg-cat-soft px-5 text-cat-ink ${className}`}
    >
      <span className="text-8xl font-extrabold leading-none">
        {post.title.trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default PostCover;
