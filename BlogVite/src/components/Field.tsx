import type { InputHTMLAttributes } from 'react';
import { inputClass, labelClass } from '@/lib/classes';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const Field = ({ id, label, className = '', ...props }: FieldProps) => (
  <div className={`grid gap-2 ${className}`}>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <input id={id} className={inputClass} {...props} />
  </div>
);

export default Field;
