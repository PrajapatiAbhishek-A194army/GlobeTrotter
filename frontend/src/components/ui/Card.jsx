import { clsx } from 'clsx'

export const Card = ({ children, className, hover = false, ...props }) => (
  <div
    className={clsx(
      'bg-white rounded-2xl border border-neutral-100 shadow-card',
      hover && 'transition-all duration-200 hover:shadow-card-md hover:-translate-y-0.5 hover:border-primary-100 cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx('p-6 pb-0', className)} {...props}>{children}</div>
)

export const CardBody = ({ children, className, ...props }) => (
  <div className={clsx('p-6', className)} {...props}>{children}</div>
)

export const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-4 border-t border-neutral-100', className)} {...props}>{children}</div>
)

export default Card
