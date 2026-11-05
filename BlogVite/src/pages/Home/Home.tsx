import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import Pager from '@/components/Pager/Pager';
import PostCard from '@/components/PostCard/PostCard';
import Seo from '@/components/Seo';
import { CATEGORIES } from '@/constants/categories';
import { HOME_PAGE_SIZE } from '@/constants/pagination';
import { usePostCount, usePosts } from '@/hooks/usePosts';
import { button, inputClass } from '@/lib/classes';

const DEFAULT_CATEGORY = 'Default';

const Home = () => {
  const { t } = useTranslation('homepagetable');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const { data: postCount = 0 } = usePostCount();
  const { data: posts, isPending, isError } = usePosts(page, query);

  const maxPage = Math.max(1, Math.ceil(postCount / HOME_PAGE_SIZE));

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(searchInput.trim());
  };

  const visiblePosts =
    category === DEFAULT_CATEGORY
      ? posts
      : posts?.filter((post) => post.categories?.name === category);

  return (
    <div>
      <Seo title={t('blog')} description={t('seodescription')} path="/" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl font-bold">{t('blog')}</h1>
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('searchplaceholder')}
            aria-label={t('search')}
            className={`${inputClass} pr-10`}
          />
          <button
            type="submit"
            aria-label={t('search')}
            className={`${button('ghost', 'icon')} absolute right-0 top-0`}
          >
            <Search />
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[DEFAULT_CATEGORY, ...CATEGORIES].map((name) => (
          <button
            key={name}
            data-category={name === DEFAULT_CATEGORY ? undefined : name}
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
              category === name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            {name !== DEFAULT_CATEGORY && <span className="size-2 rounded-full bg-cat" />}
            {t(name)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {visiblePosts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {isPending && <p className="mt-8 text-muted-foreground">...</p>}
      {isError && <p className="mt-8 text-destructive">{t('failed')}</p>}
      {visiblePosts?.length === 0 && <p className="mt-8 text-muted-foreground">{t('empty')}</p>}

      <Pager
        page={page}
        maxPage={maxPage}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() => setPage((current) => Math.min(maxPage, current + 1))}
      />
    </div>
  );
};

export default Home;
