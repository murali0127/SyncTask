import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import NavBarAvatar from './ui/NavBarAvatar';
import clsx from 'clsx';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/context/AuthContext';
const navigation = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Team', href: '#' },
      { name: 'Workspace', href: '#' },
      { name: 'Calendar', href: '#' },
]


export default function NavBar({ homePage = true }) {
      const { user, signout } = useAuth();
      const location = useLocation();
      const isProfileRoute = location.pathname.toLowerCase().includes('/profile');
      const navigate = useNavigate();
      async function handleLogout() {
            const { error } = await signout();
            if (error) {
                  console.log(error);
                  return;
            } else {
                  setTimeout(() => navigate('/', { state: { loggedOut: true } }), 200);
            }
      }
      return (
            <Disclosure
                  as="nav"
                  className={clsx(
                        "fixed top-0 left-0 right-0  z-50 relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10",
                        isProfileRoute ? 'bg-neutral-900' : 'bg-transparent'
                  )}
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
                              <div className="flex flex-1 gap-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className={clsx(
                                          "flex w-8 h-8 rounded-md mx-auto bg-gradient-to-br from-rose-500 via-transparent to-purple-500 flex items-center justify-center text-white text-sm font-bold",
                                    )}>
                                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                          </svg>
                                    </div>
                                    <Link to="/Dashboard" className='text-bold font-mono text-2xl px-1 text-rose-400 text-shadow-rose-300  hover:text-rose-300 transition-colors'>
                                          SyncTask
                                    </Link>
                                    <div className="flex flex-1 hidden sm:flex justify-center">
                                          <div className="flex space-x-4 gap-4">
                                                {navigation.map((item) => (
                                                      <NavLink
                                                            key={item.name}
                                                            to={item.href}
                                                            className={({ isActive }) => clsx(
                                                                  isActive ? 'text-white' : 'text-gray-300',
                                                                  'rounded-md px-3 py-2 text-md font-medium transition-colors hover:text-white',
                                                            )}
                                                      >
                                                            {item.name}
                                                      </NavLink>
                                                ))}
                                          </div>
                                    </div>
                              </div>
                              {(homePage && user) &&
                                    < div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                          <button
                                                onClick={handleLogout}
                                                type="logout"
                                                className="relative rounded-full p-1 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:text-red-500 hover:translate-y-0.5"
                                          >Logout
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">View notifications</span>
                                          </button>
                                    </div>
                              }
                              {(!homePage && user) &&


                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                          <button
                                                type="button"
                                                className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-rose-500/30"
                                          >
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon aria-hidden="true" className="size-6" />
                                          </button>

                                          {/* Profile dropdown */}
                                          <Menu as="div" className="relative ml-3">

                                                <button
                                                      title='Singout'
                                                      // onClick={handleSignOut}
                                                      className="block rounded-xl px-4 py-2 text-md font-semibold text-gray-300 data-focus:outline-hidden hover:text-white hover:translate-x-0.5 transition-all"
                                                >
                                                      Sign out
                                                </button>
                                          </Menu>

                                    </div>
                              }
                              {(homePage && !user) &&
                                    < div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                          <a
                                                href='/login'
                                                type="button"
                                                className="relative rounded-full p-1 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:text-red-500 hover:translate-y-0.5"
                                          >Login
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">View notifications</span>
                                          </a>
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
            </Disclosure >
      )
}