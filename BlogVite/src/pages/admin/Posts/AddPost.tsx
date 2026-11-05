import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import CategorySelect from '@/components/CategorySelect';
import Field from '@/components/Field';
import Seo from '@/components/Seo';
import { useAddPost } from '@/hooks/useAdmin';
import { button, labelClass, textareaClass } from '@/lib/classes';
import { getErrorDetail } from '@/utils/error';
import { fileToBytes } from '@/utils/image';

const AddPost = () => {
  const { t } = useTranslation('admintable');
  const addPost = useAddPost();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<Uint8Array | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    try {
      setImage(await fileToBytes(file));
    } catch (error) {
      console.error(getErrorDetail(error));
    }
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    addPost.mutate(
      { title, content, category, image },
      { onSuccess: () => setMessage('Post added!') },
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Seo title={t('addpost')} noindex />
      <h1 className="text-3xl font-bold">{t('addpost')}</h1>
      <form onSubmit={handleAdd} className="mt-6 grid gap-4">
        <Field
          id="title"
          label={t('title')}
          maxLength={250}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="grid gap-2">
          <label htmlFor="content" className={labelClass}>
            {t('content')}
          </label>
          <textarea
            id="content"
            name="Content"
            maxLength={1600}
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className={textareaClass}
          />
        </div>
        <div className="grid gap-2 sm:max-w-xs">
          <label htmlFor="category" className={labelClass}>
            {t('category')}
          </label>
          <CategorySelect id="category" value={category} onChange={setCategory} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="image" className={labelClass}>
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="text-sm"
            onChange={handleImageChange}
          />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="max-h-40 self-start rounded-md" />
          )}
        </div>
        {message && <p className="text-sm text-success">{message}</p>}
        <button
          type="submit"
          disabled={addPost.isPending}
          className={`${button()} justify-self-start`}
        >
          {t('addpost')}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
