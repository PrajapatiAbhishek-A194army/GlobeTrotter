import { clsx } from 'clsx'

export const STATUS_CONFIG = {
  PLANNING:  { label: 'Planning',  dot: 'bg-neutral-400', bg: 'bg-neutral-100', text: 'text-neutral-600', ring: 'ring-neutral-200' },
  UPCOMING:  { label: 'Upcoming',  dot: 'bg-blue-500',    bg: 'bg-blue-50',     text: 'text-blue-700',   ring: 'ring-blue-200' },
  ONGOING:   { label: 'Ongoing',   dot: 'bg-primary-500', bg: 'bg-primary-50',  text: 'text-primary-700',ring: 'ring-primary-200' },
  COMPLETED: { label: 'Completed', dot: 'bg-emerald-500', bg: 'bg-emerald-50',  text: 'text-emerald-700',ring: 'ring-emerald-200' },
  CANCELLED: { label: 'Cancelled', dot: 'bg-red-400',     bg: 'bg-red-50',      text: 'text-red-600',    ring: 'ring-red-200' },
}

/**
 * TripStatusBadge
 * @param {string} status — TripStatus enum value
 * @param {string} size   — 'sm' | 'md'
 * @param {boolean} dot   — show animated dot for ONGOING
 */
export default function TripStatusBadge({ status, size = 'md', dot = true }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PLANNING
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-full ring-1',
        cfg.bg, cfg.text, cfg.ring,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full shrink-0',
            cfg.dot,
            status === 'ONGOING' && 'animate-pulse'
          )}
        />
      )}
      {cfg.label}
    </span>
  )
}
