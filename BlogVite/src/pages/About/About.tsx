import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/Seo';

const team = ['Ahmet', 'Mehmet', 'Ayşe', 'Yusuf', 'Nur', 'Buğra'];
const hues = [330, 190, 140, 270, 40, 10];

const About = () => {
  const { t } = useTranslation('abouttable');

  return (
    <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <Seo title={t('about')} description={t('abouttext1').slice(0, 160)} path="/AboutUs" />
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t('about')}</h1>
        <div className="mt-8 max-w-prose space-y-5 font-serif text-lg leading-8">
          <p>{t('abouttext1')}</p>
          <p>{t('abouttext2')}</p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold">{t('employess')}</h2>
        <ul className="mt-6 grid grid-cols-2 gap-4">
          {team.map((name, index) => (
            <li
              key={name}
              data-category
              style={{ '--hue': hues[index], animationDelay: `${index * 70}ms` } as CSSProperties}
              className="flex animate-rise items-center gap-3 rounded-2xl border bg-surface p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-18px_var(--cat)]"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-cat-soft font-bold text-cat-ink">
                {name.charAt(0)}
              </span>
              <span className="font-semibold">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default About;
