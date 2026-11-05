import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { changePassword, deleteAccount, updateAccount } from '@/api/users';
import { useAuth } from '@/auth/useAuth';
import Field from '@/components/Field';
import Modal from '@/components/Modal';
import Seo from '@/components/Seo';
import { button } from '@/lib/classes';
import { getErrorDetail } from '@/utils/error';
import type { User } from '@/types';

const emptyPasswords = { oldPassword: '', newPassword: '', confirmPassword: '' };

const Account = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('accounttable');
  const { user, refreshUser, signOut } = useAuth();
  const [draft, setDraft] = useState<User | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [passwordMessage, setPasswordMessage] = useState('');

  const profile = draft ?? user;
  if (!profile) return null;

  const handleField = (field: keyof User) => (e: ChangeEvent<HTMLInputElement>) =>
    setDraft({ ...profile, [field]: e.target.value });

  const handlePassword =
    (field: keyof typeof emptyPasswords) => (e: ChangeEvent<HTMLInputElement>) =>
      setPasswords({ ...passwords, [field]: e.target.value });

  const handleDelete = async () => {
    setDeleteOpen(false);

    try {
      await deleteAccount(profile.Id);
      signOut();
      navigate('/Login');
    } catch (error) {
      console.error(getErrorDetail(error));
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await updateAccount(profile);
      await refreshUser();
      setDraft(null);
    } catch (error) {
      console.error(getErrorDetail(error));
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords not match!!');
      return;
    }

    try {
      await changePassword({ userId: profile.Id, oldPassword, newPassword });
      setPasswordMessage('Password Changed!!');
    } catch (error) {
      console.error(getErrorDetail(error));
      setPasswordMessage("Password can't changed!!");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Seo title={profile.UserName} noindex />
      <h1 className="text-3xl font-bold">{profile.UserName}</h1>

      <form onSubmit={handleUpdate} key={profile.Id} className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          id="email"
          label="Email"
          type="email"
          value={profile.Email}
          readOnly
          className="sm:col-span-2"
        />
        <Field
          id="username"
          label="Username"
          value={profile.UserName}
          onChange={handleField('UserName')}
        />
        <Field
          id="phone"
          label={t('phonenum')}
          type="tel"
          value={profile.PhoneNumber}
          onChange={handleField('PhoneNumber')}
        />
        <Field id="name" label="Name" value={profile.Name} onChange={handleField('Name')} />
        <Field
          id="surname"
          label="Surname"
          value={profile.SurName}
          onChange={handleField('SurName')}
        />
        <Field
          id="address"
          label={t('address')}
          value={profile.Address}
          onChange={handleField('Address')}
          className="sm:col-span-2"
        />
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" className={button()}>
            {t('editaccountbutton')}
          </button>
          <button type="button" onClick={() => setDeleteOpen(true)} className={button('outline')}>
            {t('deleteaccountbutton')}
          </button>
        </div>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="mt-10 grid gap-4 border-t pt-8 sm:grid-cols-2"
      >
        <Field
          id="oldpass"
          label={t('oldpass')}
          type="password"
          autoComplete="current-password"
          onChange={handlePassword('oldPassword')}
          required
        />
        <Field
          id="newpass"
          label={t('newpass')}
          type="password"
          autoComplete="new-password"
          onChange={handlePassword('newPassword')}
          required
        />
        <Field
          id="confpass"
          label={t('confpass')}
          type="password"
          autoComplete="new-password"
          onChange={handlePassword('confirmPassword')}
          required
        />
        {passwordMessage && (
          <p className="text-sm text-muted-foreground sm:col-span-2">{passwordMessage}</p>
        )}
        <button type="submit" className={`${button()} justify-self-start sm:col-span-2`}>
          {t('changepassbutton')}
        </button>
      </form>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('deleteaccountbutton')}
      >
        <p className="text-sm text-muted-foreground">{t('deletemodaltext')}</p>
        <button onClick={handleDelete} className={`${button('danger')} justify-self-end`}>
          {t('deletebutton')}
        </button>
      </Modal>
    </div>
  );
};

export default Account;
