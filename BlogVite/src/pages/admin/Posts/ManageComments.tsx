import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import Seo from '@/components/Seo';
import { useDeleteComment } from '@/hooks/useAdmin';
import { button, tableWrapClass, tdClass, thClass } from '@/lib/classes';
import { formatDate } from '@/utils/date';
import type { ManageCommentsLocationState } from '@/types';

const CommentsTable = ({ comments: initialComments }: ManageCommentsLocationState) => {
  const { t } = useTranslation('admintable');
  const deleteComment = useDeleteComment();
  const [comments, setComments] = useState(initialComments);

  const handleDelete = (commentId: number) => {
    deleteComment.mutate(commentId, {
      onSuccess: () =>
        setComments((current) => current.filter((comment) => comment.id !== commentId)),
    });
  };

  return (
    <div>
      <Seo title={t('managercomment')} noindex />
      <Link
        to="/Admin/PostManager"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        {t('PostM', { defaultValue: 'Posts' })}
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{t('managercomment')}</h1>
      <div className={`${tableWrapClass} mt-6`}>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>{t('username')}</th>
              <th className={thClass}>{t('content')}</th>
              <th className={thClass}>{t('date')}</th>
              <th className={thClass}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {comments.length > 0 ? (
              comments.map((row) => (
                <tr key={row.id}>
                  <td className={tdClass}>{row.userName}</td>
                  <td className={`${tdClass} max-w-xs truncate`}>{row.content}</td>
                  <td className={`${tdClass} whitespace-nowrap`}>{formatDate(row.date)}</td>
                  <td className={tdClass}>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className={button('outline', 'sm')}
                    >
                      {t('managerdelete')}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={`${tdClass} text-muted-foreground`}>
                  {t('nocomment')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ManageComments = () => {
  const { state } = useLocation() as { state: ManageCommentsLocationState | null };

  if (!state) {
    return <Navigate to="/Admin/PostManager" replace />;
  }
  return <CommentsTable {...state} />;
};

export default ManageComments;
