const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4';

const buttonVariants = {
  primary:
    'bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/30 hover:brightness-110',
  outline: 'border border-input bg-surface hover:bg-muted',
  danger: 'bg-destructive text-white hover:brightness-110',
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

export const inputClass =
  'h-11 w-full rounded-lg border border-input bg-surface px-3.5 text-sm transition focus:border-ring';
export const textareaClass =
  'w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm transition focus:border-ring';
export const labelClass = 'text-sm font-medium';
export const tableWrapClass = 'overflow-x-auto rounded-2xl border bg-surface shadow-sm';
export const thClass = 'bg-muted/50 px-4 py-3 text-left font-medium text-muted-foreground';
export const tdClass = 'border-t px-4 py-3';
