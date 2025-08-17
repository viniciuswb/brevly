/** biome-ignore-all lint/a11y/noLabelWithoutControl: ignore noLabelWithoutControl */
import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, ...props }, ref) => {
    const inputClasses = [
      'w-full text-sm text-[#1F2025] bg-white border rounded-lg transition-all',
      'placeholder:text-[#74798B] focus:outline-none focus:ring-3',
      error 
        ? 'border-[#B12C4D] focus:border-[#B12C4D] focus:ring-red-100' 
        : 'border-[#CDCFD5] focus:border-[#2C46B1] focus:ring-blue-100',
      prefix ? 'pl-[63px]' : 'px-4',
      'py-3',
      className
    ].filter(Boolean).join(' ');

    if (prefix) {
      return (
        <div className="flex flex-col gap-2 w-full">
          {label && (
            <label className="text-xs font-normal text-[#4D505C] uppercase leading-[14px]">
              {label}
            </label>
          )}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-[#74798B] pointer-events-none">
              {prefix}
            </span>
            <input
              className={inputClasses}
              ref={ref}
              {...props}
            />
          </div>
          {error && (
            <p className="text-sm text-[#B12C4D] mt-1">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-xs font-normal text-[#4D505C] uppercase leading-[14px]">
            {label}
          </label>
        )}
        <input
          className={inputClasses}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-[#B12C4D] mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };