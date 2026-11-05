import { ArrowLeft, ArrowRight } from 'lucide-react';
import { button } from '@/lib/classes';

interface PagerProps {
  page: number;
  maxPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pager = ({ page, maxPage, onPrevious, onNext }: PagerProps) => (
  <div className="mt-10 flex items-center justify-center gap-3">
    <button
      onClick={onPrevious}
      disabled={page <= 1}
      aria-label="Previous"
      className={button('outline', 'icon')}
    >
      <ArrowLeft />
    </button>
    <span className="text-sm text-muted-foreground">
      {page} / {maxPage}
    </span>
    <button
      onClick={onNext}
      disabled={page >= maxPage}
      aria-label="Next"
      className={button('outline', 'icon')}
    >
      <ArrowRight />
    </button>
  </div>
);

export default Pager;
