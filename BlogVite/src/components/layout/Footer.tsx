import { Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isAnalyticsConfigured } from '@/lib/analytics';
import { useConsent } from '@/context/useConsent';
import { SITE_NAME } from '@/constants/site';

const Footer = () => {
  const { t } = useTranslation('cookietable');
  const { reset } = useConsent();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME} · Buğra Daryal
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {isAnalyticsConfigured && (
            <button type="button" onClick={reset} className="hover:text-foreground">
              {t('settings')}
            </button>
          )}
          <a
            href="https://github.com/bugradaryal"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground"
          >
            <Code2 className="size-4" />
            github.com/bugradaryal
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
