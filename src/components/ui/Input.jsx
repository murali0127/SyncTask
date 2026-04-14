import clsx from 'clsx';

export default function Input({
      className = '',
      ...props
}) {
      return (
            <input type="text"
                  className={clsx(
                        'w-full bg-neutral-900 border border-neutral-700 rounded-lg',
                        'px-4 py-2.5 text-sm text-white placeholder-neutral-500',
                        'outline-none transition-all duration-150',
                        'focus:bg-neutral-800 focus:border-neutral-600',
                        'focus:ring-1 focus:ring-neutral-600',
                        className
                  )}
                  {...props}
            />
      )
}