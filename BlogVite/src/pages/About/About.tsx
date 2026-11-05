import { useTranslation } from 'react-i18next';
import Seo from '@/components/Seo';

const team = ['Ahmet', 'Mehmet', 'Ayşe', 'Yusuf', 'Nur', 'Buğra'];

const About = () => {
  const { t } = useTranslation('abouttable');

  return (
    <div className="mx-auto max-w-2xl">
      <Seo title={t('about')} description={t('abouttext1').slice(0, 160)} path="/AboutUs" />
      <h1 className="text-4xl font-bold">{t('about')}</h1>
      <div className="mt-8 space-y-5 font-serif text-lg leading-8">
        <p>{t('abouttext1')}</p>
        <p>{t('abouttext2')}</p>
      </div>
      <h2 className="mt-14 text-2xl font-semibold">{t('employess')}</h2>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {team.map((name) => (
          <li key={name} className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-muted font-semibold">
              {name.charAt(0)}
            </span>
            <span className="font-medium">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default About;
