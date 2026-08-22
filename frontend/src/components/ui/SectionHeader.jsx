import { clsx } from 'clsx'

/**
 * SectionHeader — consistent section titles used throughout the landing page
 * and dashboard pages.
 */
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className,
  titleClassName,
  subtitleClassName,
}) => (
  <div className={clsx(centered && 'text-center', 'mb-12', className)}>
    {eyebrow && (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
        <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
          {eyebrow}
        </span>
      </div>
    )}
    <h2
      className={clsx(
        'font-display font-bold text-neutral-900 text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight',
        titleClassName
      )}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={clsx(
          'mt-4 text-lg text-neutral-500 max-w-2xl leading-relaxed',
          centered && 'mx-auto',
          subtitleClassName
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
)

export default SectionHeader
