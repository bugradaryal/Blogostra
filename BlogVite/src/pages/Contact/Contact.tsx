import { useTranslation } from 'react-i18next';
import { Camera, MapPin, Phone, AtSign } from 'lucide-react';
import { SITE_NAME } from '@/constants/site';
import Seo from '@/components/Seo';

const Contact = () => {
  const { t } = useTranslation('contacttable');

  const links = [
    { icon: AtSign, label: 'Twitter', href: 'https://x.com/' },
    { icon: Camera, label: 'Instagram', href: 'https://www.instagram.com/' },
  ];

  return (
    <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-[1fr_16rem]">
      <Seo title={t('contact')} description={t('contacttext').slice(0, 160)} path="/ContactUs" />
      <div>
        <h1 className="text-4xl font-bold">{t('contact')}</h1>
        <h2 className="mt-8 text-xl font-semibold">{SITE_NAME}</h2>
        <p className="mt-3 font-serif text-lg leading-8">{t('contacttext')}</p>
      </div>
      <ul className="flex flex-col gap-4 text-sm md:pt-16">
        {links.map(({ icon: Icon, label, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 hover:underline"
            >
              <Icon className="size-4" />
              {label}
            </a>
          </li>
        ))}
        <li className="inline-flex items-center gap-3">
          <Phone className="size-4" />
          (+90) 555 555 55 55
        </li>
        <li className="inline-flex items-center gap-3">
          <MapPin className="size-4" />
          Türkiye, Tekirdağ, Çorlu
        </li>
      </ul>
    </div>
  );
};

export default Contact;
