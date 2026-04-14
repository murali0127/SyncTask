import clsx from 'clsx';

export default function NavBarAvatar({ size = 'md' }) {
      return (
            <img
                  src="https://placehold.net/avatar.svg"
                  alt="Profile"
                  className={clsx(
                        'rounded-full bg-neutral-800 outline outline-1 outline-neutral-700 mr-3',
                        size === 'sm' && 'size-7',
                        size === 'md' && 'size-8',
                        size === 'lg' && 'size-10'
                  )}
            />
      )
}