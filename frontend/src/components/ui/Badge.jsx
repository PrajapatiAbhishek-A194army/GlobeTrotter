import { clsx } from 'clsx'

const colorMap = {
  green:  'bg-primary-100 text-primary-700 ring-primary-200',
  gray:   'bg-neutral-100 text-neutral-600 ring-neutral-200',
  orange: 'bg-orange-100 text-orange-700 ring-orange-200',
  blue:   'bg-blue-100 text-blue-700 ring-blue-200',
  purple: 'bg-purple-100 text-purple-700 ring-purple-200',
  red:    'bg-red-100 text-red-700 ring-red-200',
  yellow: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
  teal:   'bg-teal-100 text-teal-700 ring-teal-200',
}

const Badge = ({ children, color = 'green', className, dot = false, ...props }) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset',
      colorMap[color],
      className
    )}
    {...props}
  >
    {dot && (
      <span className={clsx('w-1.5 h-1.5 rounded-full', {
        'bg-primary-500': color === 'green',
        'bg-neutral-500': color === 'gray',
        'bg-orange-500':  color === 'orange',
        'bg-blue-500':    color === 'blue',
        'bg-purple-500':  color === 'purple',
        'bg-red-500':     color === 'red',
      })} />
    )}
    {children}
  </span>
)

export default Badge
