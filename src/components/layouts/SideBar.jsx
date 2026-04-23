import clsx from 'clsx';
import { useAppState } from '../../providers/AppProvider';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import NavBarAvatar from '../ui/NavBarAvatar';
import { useState } from 'react';
import { PanelLeft, ListPlus } from 'lucide-react';
import AddNewList from '../tasks/AddNewList'

export default function Sidebar() {
      const { lists, tasks, selectedListId, setSelectedListId, addList } = useAppState();

      //EXPLANDABLE SIDEBAR
      const [isCollapsed, setIsCollapsed] = useState(false);
      const [isHovered, setIsHovered] = useState(false);

      const isExpanded = !isCollapsed || isHovered;

      const countForList = id => tasks.filter(task => task.listId == id && !task.done).length;

      return (
            <aside className={clsx(
                  'bg-neutral-950 border-r border-neutral-800 flex flex-col h-full flex-shrink-0 gap-3 text-md transition-all duration-300 ease-in-out',
                  isExpanded ? 'w-64' : 'w-16'
            )}
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
            >
                  {/** Branding */}
                  < div size="md" className="flex items-center justify-between px-3 h-14 border-b border-neutral-800" >
                        <div className="flex items-center gap-3">
                              <button className='py-2 rounded-md hover:bg-neutral-700 transition-colors'
                                    onClick={() => setIsCollapsed(prev => !prev)}
                              >
                                    <PanelLeft size={18} className='text-neutral-500' />
                              </button>
                              <div className={clsx(
                                    "w-8 h-8 rounded-md mx-auto bg-gradient-to-br from-rose-500 via-transparent to-purple-500 flex items-center justify-center text-white text-sm font-bold",
                                    isExpanded ? 'opacity-100 ml-0' : 'opacity-0 ml-4'
                              )}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                              </div>
                              <span className={clsx(
                                    "text-base text-lg transition-all duration-200 font-semibold text-white",
                                    isExpanded ? 'opacity-100 ml-0' : 'opacity-0 ml-4'
                              )}
                              >FlowTask</span>
                        </div>

                        {/** User Menu */}
                        {isExpanded &&
                              <div className='ml-2'>
                                    <Menu as="div" className="relative items-center">
                                          <MenuButton className="flex-1 items-center rounded-md p-1 transition-colors">
                                                <NavBarAvatar size="md" />
                                          </MenuButton>
                                          <MenuItems
                                                className="absolute right-0 z-50 mt-1 w-40 h-fit origin-top-right rounded-2xl bg-neutral-900 border border-neutral-800 py-1 shadow-xl"
                                          >
                                                <MenuItem>
                                                      <a href="/profile" className="block px-3 py-2 text-md text-left text-neutral-300 hover:bg-neutral-800">
                                                            Your profile
                                                      </a>
                                                </MenuItem>
                                                <div className=" border-t border-neutral-800" />
                                                <MenuItem>
                                                      <a href="#" className="block px-3 py-2 text-md text-neutral-300 hover:bg-neutral-800">
                                                            Settings
                                                      </a>
                                                </MenuItem>
                                                <div className="border-t border-neutral-800" />
                                                <MenuItem>
                                                      <a href="/user/logout" className="block px-3 py-2 text-md text-red-400 hover:bg-neutral-800">
                                                            Sign out
                                                      </a>
                                                </MenuItem>
                                          </MenuItems>
                                    </Menu>
                              </div>
                        }
                  </div >

                  {/** Section label */}
                  {!isExpanded &&
                        <div className='px-1' >
                              <Menu as="div" className="relative items-center">
                                    <MenuButton className="flex-1 items-center rounded-md p-1 transition-colors">
                                          <NavBarAvatar size="md" />
                                    </MenuButton>
                              </Menu>
                        </div>
                  }
                  <p className={clsx(
                        'text-xs font-semibold font-medium text-neutral-500 tracking-wide uppercase transition-all duration-300 whitespace-nowrap',
                        isExpanded ? 'opacity-100 ml-0' : 'opacity-0 ml-4'

                  )} >

                        <span className='flex items-center gap-2 text-md'>


                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                              </svg>
                              My Lists
                        </span>

                  </p >

                  {/** List items */}
                  < div className="flex flex-col gap-1 flex-1 overflow-y-auto px-2" >
                        {
                              lists.map(list => (
                                    <button
                                          key={list.id}
                                          onClick={() => setSelectedListId(list.id)}
                                          className={clsx(
                                                "flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left text-md",
                                                "transition-all duration-150",
                                                selectedListId == list.id
                                                      ? 'bg-neutral-800 text-white shadow-inner'
                                                      : 'text-neutral-400 hover:bg-neutral-800/90 hover:text-neutral-200'
                                          )}>
                                          <span
                                                className='w-2.5 h-2.5 rounded-full flex-shrink-0'
                                                style={{ background: list.color }}
                                          />
                                          <span className={clsx(
                                                "flex-1 truncate transition-all duration-200 whitespace-nowrap",
                                                isExpanded ? "opacity-100 ml-0" : "opacity-0 -ml-4"
                                          )}>{list.name}</span>
                                          {countForList(list.id) > 0 && (
                                                <span className={clsx(
                                                      'rounded-full px-2 py-0.5 text-xs font-medium  text-neutral-300',
                                                      selectedListId === list.id
                                                            ? 'text-neutral-300'
                                                            : 'text-neutral-500'
                                                )}>
                                                      {countForList(list.id)}
                                                </span>
                                          )}
                                    </button>
                              ))
                        }
                  </div >
                  {isExpanded ?
                        <AddNewList newList={addList} />
                        : <button className='mx-auto mb-2' onClick={() => setIsCollapsed(!isCollapsed)}>  <ListPlus />
                        </button>
                  }
            </aside >
      )
}