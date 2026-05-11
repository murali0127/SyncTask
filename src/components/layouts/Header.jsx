import Button from '../ui/Button';
import { useAppState } from "../../providers/AppProvider";
import { LogOut, CalendarDays, ClipboardCheck, BellRing, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MyCalendar from '../ui/calendar';
import { useNotifications } from '../../hooks/useNotifications';


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
            setViewMode
      } = useAppState();

      //From Use Notification hooks
      const { isEnabled, enable, disable, permission, isSupported, loading, error } = useNotifications();
      const [calendarOpen, setCalendarOpen] = useState(false);

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
            <header className="flex items-center justify-between px-4 h-14 border-b border-neutral-800 flex-shrink-0">
                  <div className="flex items-center gap-3">
                        <span className="text-2xl">{currentList.icon}</span>
                        <div className='felx flex-col'>
                              <h1 className="font-mogra text-base font-semibold text-white">
                                    {currentList.list_title}
                              </h1>
                              <p className="text-xs text-neutral-500">
                                    {done} of {total} done ({percent}%)
                              </p>
                        </div>
                        <button
                              className='self-start mt-2 bg-red-500/40 rounded px-1 font-semibold text-xs text-orange-100 hover:bg-rose-700 hover:text-white-200 '
                              onClick={handleDeleteCurrentList}
                        >DELETE</button>
                  </div>

                  <div className="flex items-center">

                        {!calendarOpen ? <CalendarDays
                              className='text-neutral-500  hover:text-neutral-300 hover:translate-x-0.5 '
                              size="20px"
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
                        {/* <div className='flex items-center ml-3 mt-0.5 p-1 rounded-2xl border border-neutral-600 text-neutral-500 hover:text-neutral-300 hover:translate-x-0.5'>
                              <BellRing size="18px" />
                        </div> */}
                        {isSupported && (
                              <button
                                    title={
                                          permission === 'denied'
                                                ? 'Notifications blocked — change in browser settings'
                                                : isEnabled
                                                      ? 'Notifications on — click to disable'
                                                      : 'Enable task reminders'
                                    }
                                    onClick={handleNotificationToggle}
                                    disabled={loading || permission === 'denied'}
                                    className="text-neutral-500 hover:text-neutral-300 hover:translate-x-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                              >
                                    {loading ? (
                                          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                          </svg>
                                    ) : isEnabled ? (
                                          <BellRing size="20px" className="text-rose-800 ml-4" />
                                    ) : (
                                          <BellOff size="20px" className='text-neutral-500 ml-4' />
                                    )}
                              </button>
                        )}
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
                        <button
                              title="Logout"
                              className="text-neutral-500 border-0 bg-transparent hover:text-neutral-300 hover:translate-x-0.5"
                              size="md"
                              onClick={handleLogout}>
                              <LogOut className='py-1' />
                        </button>
                  </div>
            </header >
      )
}
