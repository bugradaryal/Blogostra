import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '@/constants/site';

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  type?: 'website' | 'article';
  noindex?: boolean;
}

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '');

const Seo = ({ title, description, path, image, type = 'website', noindex }: SeoProps) => {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const canonical = path !== undefined ? `${SITE_URL}${path}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
};

export default Seo;
