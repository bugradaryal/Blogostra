import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { register, sendVerificationMail, type RegisterData } from '@/api/auth';
import Field from '@/components/Field';
import Seo from '@/components/Seo';
import { button } from '@/lib/classes';
import { getErrorDetail } from '@/utils/error';

const emptyForm: RegisterData = {
  Name: '',
  Surname: '',
  UserName: '',
  Email: '',
  PhoneNumber: '',
  Address: '',
  Password: '',
};

const Register = () => {
  const [form, setForm] = useState(emptyForm);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [succeeded, setSucceeded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation('registertable');

  const handleChange = (field: keyof RegisterData) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '').replace(/^0/, '');
    setForm({ ...form, PhoneNumber: digits.slice(0, 10) });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSucceeded(false);

    if (form.Password !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      setSucceeded(true);
      setMessage('Register successful!');
      sendVerificationMail(form.Email).catch((error) => {
        console.error('Verification mail failed:', getErrorDetail(error));
      });
      setTimeout(() => navigate('/Login'), 3000);
    } catch (error) {
      console.error('Register error:', error);
      const serverMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      setMessage(serverMessage || 'Register failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl pt-4">
      <Seo title={t('register')} noindex />
      <h1 className="text-3xl font-bold">{t('register')}</h1>
      <form onSubmit={handleRegister} className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          id="name"
          label={t('name')}
          value={form.Name}
          onChange={handleChange('Name')}
          required
        />
        <Field
          id="surname"
          label={t('surname')}
          value={form.Surname}
          onChange={handleChange('Surname')}
          required
        />
        <Field
          id="username"
          label={t('username')}
          autoComplete="username"
          value={form.UserName}
          onChange={handleChange('UserName')}
          required
        />
        <Field
          id="email"
          label={t('email')}
          type="email"
          autoComplete="email"
          value={form.Email}
          onChange={handleChange('Email')}
          required
        />
        <Field
          id="phone"
          label={t('phonenum')}
          type="tel"
          value={form.PhoneNumber}
          onChange={handlePhoneChange}
        />
        <Field
          id="address"
          label={t('address')}
          value={form.Address}
          onChange={handleChange('Address')}
        />
        <Field
          id="password"
          label={t('pass')}
          type="password"
          autoComplete="new-password"
          value={form.Password}
          onChange={handleChange('Password')}
          required
        />
        <Field
          id="confirm"
          label={t('confpass')}
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {message && (
          <p className={`text-sm sm:col-span-2 ${succeeded ? 'text-success' : 'text-destructive'}`}>
            {message}
          </p>
        )}
        <button type="submit" disabled={submitting} className={`${button()} sm:col-span-2`}>
          {t('regbutton')}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        {t('registertext')}{' '}
        <Link to="/Login" className="font-medium text-foreground underline">
          {t('logintext')}
        </Link>
      </p>
    </div>
  );
};

export default Register;
