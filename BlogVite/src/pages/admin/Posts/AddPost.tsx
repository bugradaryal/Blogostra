import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePlus } from 'lucide-react';
import CategorySelect from '@/components/CategorySelect';
import Field from '@/components/Field';
import Seo from '@/components/Seo';
import { useAddPost } from '@/hooks/useAdmin';
import { button, labelClass, textareaClass } from '@/lib/classes';
import { getErrorDetail } from '@/utils/error';
import { fileToJpegDataUrl } from '@/utils/image';

const AddPost = () => {
  const { t } = useTranslation('admintable');
  const addPost = useAddPost();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [message, setMessage] = useState('');
  const [fileKey, setFileKey] = useState(0);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(false);
    try {
      const dataUrl = await fileToJpegDataUrl(file);
      setPreviewImage(dataUrl);
      setImage(dataUrl.split(',')[1]);
    } catch (error) {
      console.error(getErrorDetail(error));
      setImage(null);
      setPreviewImage(null);
      setImageError(true);
    }
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    addPost.mutate(
      { title, content, category, image },
      {
        onSuccess: () => {
          setMessage(t('postadded'));
          setTitle('');
          setContent('');
          setCategory('');
          setImage(null);
          setPreviewImage(null);
          setFileKey((key) => key + 1);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Seo title={t('addpost')} noindex />
      <h1 className="text-3xl font-extrabold tracking-tight">{t('addpost')}</h1>
      <form onSubmit={handleAdd} className="mt-6 grid gap-5 rounded-2xl border bg-surface p-6 shadow-sm">
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
          <span className={labelClass}>{t('image')}</span>
          <label
            htmlFor="image"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-input p-4 text-sm text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="max-h-56 rounded-lg" />
            ) : (
              <>
                <ImagePlus className="size-8" />
                {t('chooseimage')}
              </>
            )}
          </label>
          <input
            key={fileKey}
            id="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
          />
          {imageError && <p className="text-sm text-destructive">{t('imageerror')}</p>}
        </div>
        {message && <p className="text-sm text-success">{message}</p>}
        {addPost.isError && <p className="text-sm text-destructive">{t('addfailed')}</p>}
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
