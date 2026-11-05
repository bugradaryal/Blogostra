import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CategorySelect from '@/components/CategorySelect';
import Field from '@/components/Field';
import Modal from '@/components/Modal';
import Pager from '@/components/Pager/Pager';
import Seo from '@/components/Seo';
import { ADMIN_PAGE_SIZE } from '@/constants/pagination';
import { useAdminPosts, useRemovePost, useUpdatePost } from '@/hooks/useAdmin';
import { usePostCount } from '@/hooks/usePosts';
import { button, labelClass, tableWrapClass, tdClass, textareaClass, thClass } from '@/lib/classes';
import { formatDate } from '@/utils/date';
import { getErrorDetail } from '@/utils/error';
import { fileToJpegDataUrl, toImageSrc } from '@/utils/image';
import type { ManageCommentsLocationState, Post } from '@/types';

const PostManager = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('admintable');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Post | null>(null);

  const { data: postCount = 0 } = usePostCount();
  const { data: posts = [] } = useAdminPosts(page);
  const removePost = useRemovePost();
  const updatePost = useUpdatePost();

  const maxPage = Math.max(1, Math.ceil(postCount / ADMIN_PAGE_SIZE));

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const image = await fileToJpegDataUrl(file);
      setSelected((current) => current && { ...current, image });
    } catch (error) {
      console.error(getErrorDetail(error));
    }
  };

  const handleUpdate = () => {
    if (!selected) return;

    updatePost.mutate(
      {
        id: selected.id,
        title: selected.title,
        content: selected.content,
        category: selected.categories?.name ?? '',
        image: selected.image?.split(',')[1] || '',
      },
      { onSuccess: () => setSelected(null) },
    );
  };

  const openComments = (post: Post) => {
    const state: ManageCommentsLocationState = { comments: post.comments ?? [] };
    navigate('/Admin/ManageComments', { state });
  };

  return (
    <div>
      <Seo title={t('PostM', { defaultValue: 'Posts' })} noindex />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('PostM', { defaultValue: 'Posts' })}</h1>
        <button onClick={() => navigate('/Admin/AddPost')} className={button()}>
          {t('addpostbutton')}
        </button>
      </div>

      <div className={`${tableWrapClass} mt-6`}>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={thClass}>PostId</th>
              <th className={thClass}>{t('title')}</th>
              <th className={thClass}>{t('date')}</th>
              <th className={thClass}>{t('category')}</th>
              <th className={thClass}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((row) => (
              <tr key={row.id}>
                <td className={tdClass}>{row.id}</td>
                <td className={`${tdClass} max-w-xs truncate`}>{row.title}</td>
                <td className={`${tdClass} whitespace-nowrap`}>{formatDate(row.date)}</td>
                <td className={tdClass}>{row.categories?.name}</td>
                <td className={`${tdClass} flex gap-2`}>
                  <button onClick={() => setSelected(row)} className={button('outline', 'sm')}>
                    {t('manageredit')}
                  </button>
                  <button onClick={() => openComments(row)} className={button('outline', 'sm')}>
                    {t('managercomment')}
                  </button>
                  <button
                    onClick={() => removePost.mutate(row.id)}
                    className={button('danger', 'sm')}
                  >
                    {t('managerdelete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager
        page={page}
        maxPage={maxPage}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() => setPage((current) => Math.min(maxPage, current + 1))}
      />

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={t('manageredit')}>
        <Field
          id="edit-title"
          label={t('title')}
          maxLength={250}
          value={selected?.title ?? ''}
          onChange={(e) => setSelected((c) => c && { ...c, title: e.target.value })}
        />
        <div className="grid gap-2">
          <label htmlFor="edit-content" className={labelClass}>
            {t('content')}
          </label>
          <textarea
            id="edit-content"
            name="Content"
            maxLength={1600}
            rows={6}
            value={selected?.content ?? ''}
            onChange={(e) => setSelected((c) => c && { ...c, content: e.target.value })}
            className={textareaClass}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="edit-category" className={labelClass}>
            {t('category')}
          </label>
          <CategorySelect
            id="edit-category"
            value={selected?.categories?.name ?? ''}
            onChange={(name) => setSelected((c) => c && { ...c, categories: { name } })}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="edit-image" className={labelClass}>
            Image
          </label>
          <input
            id="edit-image"
            type="file"
            accept="image/*"
            className="text-sm"
            onChange={handleImageChange}
          />
          {selected?.image ? (
            <img
              src={toImageSrc(selected.image)}
              alt="Preview"
              className="max-h-32 self-start rounded-md"
            />
          ) : (
            <p className="text-sm text-muted-foreground">{t('noimage')}</p>
          )}
        </div>
        <button
          onClick={handleUpdate}
          disabled={updatePost.isPending}
          className={`${button()} justify-self-end`}
        >
          {t('updatebutton')}
        </button>
      </Modal>
    </div>
  );
};

export default PostManager;
