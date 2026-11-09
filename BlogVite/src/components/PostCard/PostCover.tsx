import { postImageSrc } from '@/utils/image';
import type { Post } from '@/types';

interface PostCoverProps {
  post: Post;
  className?: string;
  aspect?: string;
}

const PostCover = ({ post, className = '', aspect = 'aspect-video' }: PostCoverProps) => {
  const src = postImageSrc(post.image);

  if (src) {
    return (
      <img
        src={src}
        alt={post.title}
        loading="lazy"
        className={`${aspect} w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative flex ${aspect} w-full items-end overflow-hidden bg-cat-soft px-6 text-cat-ink ${className}`}
    >
      <span className="absolute -top-10 -right-10 size-44 rounded-full bg-cat/20" />
      <span className="absolute top-8 right-16 size-16 rounded-full bg-cat/25" />
      <span className="relative text-[7rem] leading-[0.85] font-extrabold tracking-tighter">
        {post.title.trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default PostCover;
