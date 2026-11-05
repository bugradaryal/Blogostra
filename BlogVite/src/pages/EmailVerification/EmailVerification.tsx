import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyEmail } from '@/api/auth';
import Seo from '@/components/Seo';
import { button } from '@/lib/classes';
import { getErrorDetail } from '@/utils/error';

const EmailVerification = () => {
  const { search } = useLocation();
  const { t } = useTranslation('emailtable');

  useEffect(() => {
    const params = new URLSearchParams(search);
    const userId = params.get('userId');
    const emailConfUrl = params.get('emailConfUrl');

    if (userId && emailConfUrl) {
      verifyEmail(userId, emailConfUrl).catch((error) => {
        console.error('Email verification failed:', getErrorDetail(error));
      });
    }
  }, [search]);

  return (
    <div className="mx-auto max-w-md pt-4">
      <Seo title={t('verification')} noindex />
      <h1 className="text-3xl font-bold">{t('verification')}</h1>
      <p className="mt-3 font-serif text-muted-foreground">{t('verificationtext')}</p>
      <Link to="/Login" className={`${button()} mt-6`}>
        {t('redirectlogin')}
      </Link>
    </div>
  );
};

export default EmailVerification;
