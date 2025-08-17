import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'default' | 'sm';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-[#2C46B1] text-white hover:bg-[#2C4091] disabled:opacity-50 disabled:hover:bg-[#2C46B1]',
      secondary: 'bg-transparent text-[#2C46B1] border border-[#2C46B1] hover:bg-[#F0F4FF] disabled:text-[#7C7C8A] disabled:border-[#7C7C8A] disabled:hover:bg-transparent',
      icon: 'bg-[#E4E6EC] text-[#4D505C] border border-transparent hover:border-[#2C46B1] hover:bg-[#E4E6EC] hover:text-[#4D505C] p-2'
    };
    
    const sizeClasses = {
      default: variant === 'icon' ? 'w-8 h-8' : 'px-5 py-3 text-sm h-12',
      sm: variant === 'icon' ? 'w-6 h-6' : 'px-2 py-1 text-xs h-8'
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };