import { useTranslation } from 'react-i18next';
import { useConsent } from '@/context/useConsent';
import { isAnalyticsConfigured } from '@/lib/analytics';
import { button } from '@/lib/classes';

const CookieBanner = () => {
  const { t } = useTranslation('cookietable');
  const { consent, setConsent } = useConsent();

  if (!isAnalyticsConfigured || consent !== null) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-lg border bg-surface p-4">
      <p className="font-semibold">{t('title')}</p>
      <p className="mt-1 text-sm text-muted-foreground">{t('text')}</p>
      <div className="mt-3 flex gap-3">
        <button onClick={() => setConsent('granted')} className={button('primary', 'sm')}>
          {t('accept')}
        </button>
        <button onClick={() => setConsent('denied')} className={button('outline', 'sm')}>
          {t('reject')}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
