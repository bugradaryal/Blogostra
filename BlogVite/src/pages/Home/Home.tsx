import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import Pager from '@/components/Pager/Pager';
import PostCard from '@/components/PostCard/PostCard';
import Seo from '@/components/Seo';
import { CATEGORIES } from '@/constants/categories';
import { HOME_PAGE_SIZE } from '@/constants/pagination';
import { usePostCount, usePosts } from '@/hooks/usePosts';

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

  const showFeatured =
    page === 1 && !query && category === DEFAULT_CATEGORY && (visiblePosts?.length ?? 0) >= 3;

  return (
    <div>
      <Seo title={t('blog')} description={t('seodescription')} path="/" />

      <section className="relative isolate overflow-hidden rounded-3xl bg-[#2b31d6] px-6 py-12 text-white sm:px-12 sm:py-16 dark:bg-[#171b4a]">
        <span className="pointer-events-none absolute -top-24 -right-16 -z-10 size-96 animate-drift rounded-full bg-[hsl(330_90%_62%/0.4)] blur-3xl" />
        <span className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 size-96 animate-drift rounded-full bg-[hsl(190_90%_55%/0.3)] blur-3xl [animation-delay:-6s]" />
        <h1 className="max-w-3xl animate-rise text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
          {t('herotitle')}
        </h1>
        <p className="mt-4 max-w-xl animate-rise text-lg text-white/75 [animation-delay:90ms]">
          {t('seodescription')}
        </p>
        <form
          onSubmit={handleSearch}
          className="relative mt-8 w-full max-w-xl animate-rise [animation-delay:180ms]"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('searchplaceholder')}
            aria-label={t('search')}
            className="h-14 w-full rounded-full border-0 bg-white pr-16 pl-6 text-base text-[#14162e] shadow-xl shadow-black/20 transition placeholder:text-[#5f647d] focus:ring-4 focus:ring-white/40 focus:outline-none"
          />
          <button
            type="submit"
            aria-label={t('search')}
            className="absolute top-1.5 right-1.5 flex size-11 items-center justify-center rounded-full bg-[#2b31d6] text-white transition hover:scale-105 active:scale-95"
          >
            <Search className="size-5" />
          </button>
        </form>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {[DEFAULT_CATEGORY, ...CATEGORIES].map((name) => {
          const active = category === name;
          return (
            <button
              key={name}
              data-category={name === DEFAULT_CATEGORY ? undefined : name}
              aria-pressed={active}
              onClick={() => setCategory(name)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition duration-150 active:scale-95 ${
                active
                  ? 'border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'bg-surface hover:border-primary/40 hover:bg-muted'
              }`}
            >
              {name !== DEFAULT_CATEGORY && <span className="size-2 rounded-full bg-cat" />}
              {t(name)}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visiblePosts?.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} featured={showFeatured && index === 0} />
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
