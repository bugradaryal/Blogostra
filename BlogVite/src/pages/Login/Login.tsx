import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { login } from '@/api/auth';
import Seo from '@/components/Seo';
import { useAuth } from '@/auth/useAuth';
import Field from '@/components/Field';
import { button } from '@/lib/classes';
import { tokenStorage } from '@/utils/tokenStorage';

const getLoginError = (error: unknown) => {
  if (!axios.isAxiosError(error) || !error.response) {
    return 'Sunucuya ulaşılamadı.';
  }
  const { status, data } = error.response;
  if (status === 400) return data?.message || data?.title || 'E-posta veya şifre hatalı.';
  if (status === 401) return 'E-posta veya şifre hatalı.';
  if (status === 403) return 'Hesabınız onaylı değil ya da askıya alınmış.';
  return 'Beklenmeyen bir hata oluştu.';
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const { t } = useTranslation('logintable');

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);

    try {
      const tokens = await login(email, password);
      if (!tokens) {
        setMessage(t('tokenError') || 'Giriş başarılı ama token alınamadı.');
        return;
      }
      tokenStorage.set(tokens.authorization, tokens.refreshToken);

      if (!(await refreshUser())) {
        setMessage('Giriş başarılı ama kullanıcı bilgileri alınamadı.');
        return;
      }
      navigate(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      setMessage(getLoginError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm pt-4">
      <Seo title={t('login')} noindex />
      <h1 className="text-3xl font-bold">{t('login')}</h1>
      <form onSubmit={handleLogin} className="mt-6 grid gap-4">
        <Field
          id="email"
          label={t('email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          id="password"
          label={t('pass')}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {message && <p className="text-sm text-destructive">{message}</p>}
        <button type="submit" disabled={submitting} className={button()}>
          {t('loginbutton')}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        {t('logintext')}{' '}
        <Link to="/Register" className="font-medium text-foreground underline">
          {t('registertext')}
        </Link>
      </p>
    </div>
  );
};

export default Login;
