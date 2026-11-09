interface CommentProps {
  userName: string;
  content: string;
}

const Comment = ({ userName, content }: CommentProps) => (
  <div className="flex animate-rise gap-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
      {userName.charAt(0).toUpperCase()}
    </span>
    <div className="min-w-0 rounded-2xl rounded-tl-sm bg-muted/70 px-4 py-2.5">
      <p className="text-sm font-semibold">{userName}</p>
      <p className="mt-0.5 break-words whitespace-pre-wrap font-serif text-[0.95rem] leading-relaxed">
        {content}
      </p>
    </div>
  </div>
);

export default Comment;
