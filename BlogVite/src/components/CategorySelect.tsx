import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '@/constants/categories';
import { inputClass } from '@/lib/classes';

interface CategorySelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect = ({ id, value, onChange }: CategorySelectProps) => {
  const { t } = useTranslation('admintable');

  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="" disabled>
        {t('category')}
      </option>
      {CATEGORIES.map((name) => (
        <option key={name} value={name}>
          {t(name)}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
