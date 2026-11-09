import { Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isAnalyticsConfigured } from '@/lib/analytics';
import { useConsent } from '@/context/useConsent';
import { SITE_NAME } from '@/constants/site';

const Footer = () => {
  const { t } = useTranslation('cookietable');
  const { reset } = useConsent();

  return (
    <footer className="mt-16 border-t bg-surface/60">
      <div className="page-container flex flex-col items-start justify-between gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">
            {SITE_NAME.charAt(0)}
          </span>
          &copy; {new Date().getFullYear()} {SITE_NAME} · Buğra Daryal
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {isAnalyticsConfigured && (
            <button type="button" onClick={reset} className="transition-colors hover:text-foreground">
              {t('settings')}
            </button>
          )}
          <a
            href="https://github.com/bugradaryal"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
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
