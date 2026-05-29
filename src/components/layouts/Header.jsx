import Button from '../ui/Button';
import { useAppState } from "../../providers/AppProvider";
import { LogOut, CalendarDays, ClipboardCheck, BellRing, BellOff, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MyCalendar from '../ui/calendar';
import { useNotifications } from '../../hooks/useNotifications';
import './header.css';
import DeleteListModel from './DeleteModel';
import Notifications from './Notifications'


export default function Header() {
      const {
            currentList,
            currentListTodos,
            sortBy,
            setSortBy,
            isAIChatOpen,
            setIsAIChatOpen,
            deleteList,
            setSelectedListId,
            signout,
            setViewMode,
            isNotificationOpen,
            setIsNotificationOpen
      } = useAppState();

      //From Use Notification hooks
      const { isEnabled, enable, disable, permission, isSupported, loading, error } = useNotifications();
      const [calendarOpen, setCalendarOpen] = useState(false);

      const [isModelOpen, setIsModelOpen] = useState(false);

      const done = currentListTodos.filter(task => task.completed).length;
      const total = currentListTodos.length;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;

      const navigate = useNavigate();

      const handleLogout = async () => {

            const { error } = await signout();
            if (error) return;
            setTimeout(() => navigate('/', { state: { loggedOut: true } }), 200);
      }

      async function handleDeleteCurrentList() {
            if (!currentList) return;
            await deleteList(currentList.id);
            setSelectedListId(null);
      }


      const handleNotificationToggle = async () => {
            if (isEnabled) {
                  await disable();
            } else {
                  await enable();
            }
      };

      if (!currentList) return null;



      return (
            <header className="list-header flex items-center justify-between px-4 h-14 border-b border-neutral-800 flex-shrink-0">
                  <div className=" flex items-center gap-3">
                        <span className="text-2xl">{currentList.icon}</span>
                        <div className='  flex flex-col'>
                              <h1 id="list-heading" className="font-mogra text-base font-semibold text-white">
                                    {currentList.list_title}
                              </h1>
                              <p className="text-xs text-neutral-500">
                                    {done} of {total} done ({percent}%)
                              </p>
                        </div>
                        <button
                              className='text-sm font-syne font-semibold px-2 py-1 text-neutral-500 hover:text-red-700 transition-all duration-1s ease-in'
                              onClick={() => setIsModelOpen(true)}
                        ><Trash2 size={'20px'} /></button>
                  </div>

                  <div className="flex items-center">

                        {!calendarOpen ? <CalendarDays
                              className='mb-1 text-neutral-500  hover:text-neutral-300 hover:translate-x-0.5 '
                              size="19px"
                              onClick={() => {
                                    setViewMode('calendar');
                                    setCalendarOpen(!calendarOpen);
                              }}
                        />
                              : <ClipboardCheck
                                    className='text-neutral-500 hover:text-neutral-300 hover:translate-x-0.5 '
                                    size="20px"
                                    onClick={() => {
                                          setViewMode('list');
                                          setCalendarOpen(!calendarOpen);
                                    }}
                              />
                        }

                        <Button
                              variant="ghost"
                              size="md"
                              onClick={() => setSortBy(sortBy === "priority-desc" ? "created_at-desc" : "priority-desc")}
                        >
                              <i className="bi bi-arrow-down-up"></i> Sort
                        </Button>
                        <Button
                              variant={isAIChatOpen ? 'default' : 'ghost'}
                              size="md"
                              onClick={() => setIsAIChatOpen(!isAIChatOpen)}
                        >
                              <i className="bi bi-openai"></i>Ask AI
                        </Button>
                        <div className="notification-wrapper">

                              <button
                                    className='notification-trigger'
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                              >
                                    <i className="bi bi-bell"></i>
                              </button>

                              {isNotificationOpen && (
                                    <Notifications />
                              )}

                        </div>
                        <button
                              title="Logout"
                              className="text-neutral-500 border-0 bg-transparent hover:text-neutral-300 hover:translate-x-0.5"
                              size="md"
                              onClick={handleLogout}>
                              <LogOut className='py-1' />
                        </button>
                  </div>
                  <DeleteListModel isOpen={isModelOpen} onClose={() => setIsModelOpen(!isModelOpen)} onDelete={handleDeleteCurrentList} />
            </header >
      )
}
