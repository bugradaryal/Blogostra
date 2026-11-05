import { useTranslation } from 'react-i18next';
import Seo from '@/components/Seo';
import { useSuspendUser, useUsers } from '@/hooks/useAdmin';
import { button, tableWrapClass, tdClass, thClass } from '@/lib/classes';

const Users = () => {
  const { t } = useTranslation('admintable');
  const { data: users = [] } = useUsers();
  const suspendUser = useSuspendUser();

  return (
    <div>
      <Seo title={t('username')} noindex />
      <h1 className="text-3xl font-bold">{t('username')}</h1>
      <div className={`${tableWrapClass} mt-6`}>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>UserId</th>
              <th className={thClass}>{t('username')}</th>
              <th className={thClass}>{t('email')}</th>
              <th className={thClass}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.id}>
                <td className={`${tdClass} max-w-40 truncate`}>{row.id}</td>
                <td className={tdClass}>{row.userName}</td>
                <td className={tdClass}>{row.email}</td>
                <td className={tdClass}>
                  <button
                    onClick={() =>
                      suspendUser.mutate({ userId: row.id, suspend: !row.accountSuspended })
                    }
                    aria-pressed={row.accountSuspended}
                    className={button(row.accountSuspended ? 'danger' : 'outline', 'sm')}
                  >
                    {t('suspend')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
