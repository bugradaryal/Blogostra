const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium disabled:opacity-50 [&_svg]:size-4';

const buttonVariants = {
  primary: 'bg-primary text-primary-foreground',
  outline: 'border border-input hover:bg-muted',
  danger: 'bg-destructive text-white',
  ghost: 'hover:bg-muted',
};

const buttonSizes = {
  md: 'h-10 px-4 text-sm',
  sm: 'h-8 px-3 text-sm',
  icon: 'size-10',
};

export const button = (
  variant: keyof typeof buttonVariants = 'primary',
  size: keyof typeof buttonSizes = 'md',
) => `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}`;

export const inputClass = 'h-10 w-full rounded-md border border-input bg-surface px-3 text-sm';
export const textareaClass = 'w-full rounded-md border border-input bg-surface px-3 py-2 text-sm';
export const labelClass = 'text-sm font-medium';
export const tableWrapClass = 'overflow-x-auto rounded-lg border bg-surface';
export const thClass = 'px-4 py-3 text-left font-medium text-muted-foreground';
export const tdClass = 'border-t px-4 py-3';
