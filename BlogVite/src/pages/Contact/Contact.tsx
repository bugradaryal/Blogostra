import { useTranslation } from 'react-i18next';
import { AtSign, Camera, ExternalLink, MapPin, Phone } from 'lucide-react';
import { SITE_ADDRESS, SITE_NAME, SITE_PHONE } from '@/constants/site';
import Seo from '@/components/Seo';

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_QUERY = import.meta.env.VITE_MAP_QUERY || SITE_ADDRESS;

const itemClass =
  'flex items-center gap-3 rounded-xl border bg-surface px-4 py-3 text-sm transition hover:border-primary/50 hover:shadow-sm [&_svg]:size-4 [&_svg]:text-primary';

const Contact = () => {
  const { t } = useTranslation('contacttable');

  const links = [
    { icon: AtSign, label: 'Twitter', href: 'https://x.com/' },
    { icon: Camera, label: 'Instagram', href: 'https://www.instagram.com/' },
  ];

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      <Seo title={t('contact')} description={t('contacttext').slice(0, 160)} path="/ContactUs" />
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t('contact')}</h1>
        <h2 className="mt-8 text-xl font-bold">{SITE_NAME}</h2>
        <p className="mt-3 max-w-prose font-serif text-lg leading-8">{t('contacttext')}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {links.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer" className={itemClass}>
                <Icon />
                {label}
              </a>
            </li>
          ))}
          <li className={itemClass}>
            <Phone />
            {SITE_PHONE}
          </li>
          <li className={itemClass}>
            <MapPin />
            {SITE_ADDRESS}
          </li>
        </ul>
      </div>

      <div className="min-h-80 overflow-hidden rounded-3xl border bg-surface shadow-sm lg:min-h-[28rem]">
        {MAPS_KEY ? (
          <iframe
            title={SITE_ADDRESS}
            src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(MAP_QUERY)}&zoom=13`}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full min-h-80 border-0 lg:min-h-[28rem]"
          />
        ) : (
          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
            className="flex size-full min-h-80 flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground transition hover:text-primary lg:min-h-[28rem]"
          >
            <MapPin className="size-10" />
            <span className="font-medium">{t('openmap')}</span>
            <ExternalLink className="size-4" />
            {import.meta.env.DEV && (
              <span className="text-xs">VITE_GOOGLE_MAPS_API_KEY .env içinde tanımlı değil</span>
            )}
          </a>
        )}
      </div>
    </div>
  );
};

export default Contact;
