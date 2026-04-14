import clsx from 'clsx';

export default function Button({
      children,
      variant = 'default',
      size = 'sm',
      className = '',
      ...props
}) {
      return (
            <button
                  className={clsx(
                        'inline-flex items-center justify-center font-medium rounded-lg',
                        'transition-all duration-150 cursor-pointer select-none',
                        'disabled:opacity-40 disabled:cursor-not-allowed',
                        size === 'sm' && 'px-3 py-1.5 text-xs gap-1.5',
                        size === 'smd' && 'px-3 py-2 text-sm gap-2',
                        size === 'md' && 'px-4 py-2.5 text-sm gap-2 min-w-fit',
                        variant === 'primary' && [
                              'text-white bg-neutral-200',
                              'hover:bg-white active:scale-95',
                        ],
                        variant === 'default' && [
                              'text-neutral-300',
                              'hover:bg-rounded-xl hover:bg-neutral-700 hover:text-white',
                              'active:scale-95',
                        ],
                        variant === 'ghost' && [
                              'text-neutral-500 border-0 bg-transparent',
                              ' hover:text-neutral-300 hover:translate-x-0.5 ',
                        ],
                        variant === 'danger' && [
                              'text-red-400 border border-neutral-700 bg-neutral-800',
                              'hover:bg-red-500/20 hover:text-red-300',
                              'active:scale-95',
                        ],
                        className
                  )}
                  {...props}
            >
                  {children}
            </button>
      )
}