interface CommentProps {
  userName: string;
  content: string;
}

const Comment = ({ userName, content }: CommentProps) => (
  <div className="flex gap-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
      {userName.charAt(0).toUpperCase()}
    </span>
    <div className="min-w-0">
      <p className="text-sm font-semibold">{userName}</p>
      <p className="mt-0.5 whitespace-pre-wrap break-words font-serif text-[0.95rem] leading-relaxed">
        {content}
      </p>
    </div>
  </div>
);

export default Comment;
