import { forwardRef } from 'react'
import { clsx } from 'clsx'

/**
 * Input — premium form input with label, prefix icon, suffix icon, error state
 */
const Input = forwardRef(({
  label,
  error,
  hint,
  id,
  className,
  wrapperClassName,
  leftIcon,
  rightElement,
  size = 'md',
  required = false,
  ...props
}, ref) => {

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3.5 text-base',
  }

  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-xl border bg-white text-neutral-900 placeholder-neutral-400',
            'focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150',
            'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
            sizes[size],
            leftIcon   && 'pl-10',
            rightElement && 'pr-10',
            error
              ? 'border-red-300 focus:ring-red-400 bg-red-50/30'
              : 'border-neutral-200 focus:ring-primary-400 shadow-inner-sm hover:border-neutral-300',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />

        {/* Right element (e.g. show/hide password button) */}
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 flex items-center gap-1" role="alert">
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}

      {/* Hint */}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-neutral-400">{hint}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
