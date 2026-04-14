import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import NavBarAvatar from './ui/NavBarAvatar';
import clsx from 'clsx';
import { Link, NavLink } from 'react-router-dom';

const navigation = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Team', href: '#' },
      { name: 'Projects', href: '#' },
      { name: 'Calendar', href: '#' },
]


export default function NavBar({ homePage = true }) {
      return (
            <Disclosure
                  as="nav"
                  className="relative bg-neutral-900 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
            >
                  <div className="max-w-auto mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="relative flex h-16 items-center justify-between">
                              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                                          <span className="absolute -inset-0.5" />
                                          <span className="sr-only">Open main menu</span>
                                          <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                          <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                                    </DisclosureButton>
                              </div>
                              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex shrink-0 items-center">
                                          <Link to="/" className='text-bold text-2xl px-5 text-rose-400 hover:text-rose-300 transition-colors'>
                                                SyncTask
                                          </Link>
                                    </div>
                                    <div className="flex flex-1 hidden sm:flex justify-center">
                                          <div className="flex space-x-4 gap-4">
                                                {navigation.map((item) => (
                                                      <NavLink
                                                            key={item.name}
                                                            to={item.href}
                                                            className={({ isActive }) => clsx(
                                                                  isActive ? 'text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                                                  'rounded-md px-3 py-2 text-md font-medium transition-colors',
                                                            )}
                                                      >
                                                            {item.name}
                                                      </NavLink>
                                                ))}
                                          </div>
                                    </div>
                              </div>
                              {homePage ?
                                    < div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                          <a
                                                href='/login'
                                                type="button"
                                                className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-red-500"
                                          >Login
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">View notifications</span>
                                          </a>
                                    </div>
                                    :

                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                          <button
                                                type="button"
                                                className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                                          >
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon aria-hidden="true" className="size-6" />
                                          </button>

                                          {/* Profile dropdown */}
                                          <Menu as="div" className="relative ml-3">
                                                <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                                      <span className="absolute -inset-1.5" />
                                                      <span className="sr-only">Open user menu</span>
                                                      <NavBarAvatar />
                                                </MenuButton>

                                                <MenuItems
                                                      transition
                                                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                >
                                                      <MenuItem>
                                                            <Link
                                                                  to="#"
                                                                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                                                            >
                                                                  Your profile
                                                            </Link>
                                                      </MenuItem>
                                                      <MenuItem>
                                                            <Link
                                                                  to="#"
                                                                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                                                            >
                                                                  Settings
                                                            </Link>
                                                      </MenuItem>
                                                      <MenuItem>
                                                            <Link
                                                                  to="#"
                                                                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                                                            >
                                                                  Sign out
                                                            </Link>
                                                      </MenuItem>
                                                </MenuItems>
                                          </Menu>
                                    </div>
                              }
                        </div>
                  </div>

                  <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-6 sm:px-8 pt-2 pb-4">
                              {navigation.map((item) => (
                                    <NavLink
                                          key={item.name}
                                          to={item.href}
                                          className={({ isActive }) => clsx(
                                                isActive ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                                'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                                          )}
                                    >
                                          {item.name}
                                    </NavLink>
                              ))}
                        </div>
                  </DisclosurePanel>
            </Disclosure>
      )
}