import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/Seo';
import { button } from '@/lib/classes';

const NotFound = () => {
  const { t } = useTranslation('hometable');

  return (
    <div className="mx-auto max-w-md pt-8 text-center">
      <Seo title={t('NotFoundTitle')} noindex />
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t('NotFoundTitle')}</h1>
      <p className="mt-2 text-muted-foreground">{t('NotFoundText')}</p>
      <Link to="/" className={`${button()} mt-6`}>
        {t('BackHome')}
      </Link>
    </div>
  );
};

export default NotFound;
