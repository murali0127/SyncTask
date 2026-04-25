import Button from '../ui/Button';
import { useAppState } from "../../providers/AppProvider";
import { useAuth } from '../../lib/context/AuthContext'
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function Header() {
      const { currList, currListTasks, setTask, isAIChatOpen, setIsAIChatOpen, deleteCurrList } = useAppState();
      const done = currListTasks.filter(task => task.done).length;
      const total = currListTasks.length;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;

      // const signout = useAuth();

      // async function logoutUser() {
      //       const { data, error } = await signout
      // }
      const { signout } = useAuth();
      const navigate = useNavigate();
      const handleLogout = async () => {
            const { data, error } = await signout();
            if (!data) {
                  console.log(error);
            } else {
                  console.log(data);
            }

            setTimeout(() => navigate('/', { state: { loggedOut: true } }), 2000);
      }
      const PRIORITY_WEIGHT = {
            high: 3,
            medium: 2,
            low: 1
      };

      const DUE_DATE_WEIGHT = {
            'Today': 1,
            'Tomorrow': 2,
            'Day 2': 3,
            'Friday': 4,
            'Sunday': 5,
            'This week': 6,
            'Next week': 7,
            'This month': 7,
            'Next month': 8,
            'Done': 9
      };

      function handleSort() {
            setTask((prevTasks) => {
                  const currentListTasks = prevTasks.filter(t => t.listId === currList.id);
                  const otherTasks = prevTasks.filter(t => t.listId !== currList.id);

                  const sortedCurrentTasks = [...currentListTasks].sort((a, b) => {
                        if (a.done != b.done) {
                              return a.done ? 1 : -1;
                        }

                        if (a.priority != b.priority) {
                              return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
                        }

                        const dateA = DUE_DATE_WEIGHT[a.due] || 99;
                        const dateB = DUE_DATE_WEIGHT[b.due] || 99;
                        return dateA - dateB;
                  });

                  return [...prevTasks, ...sortedCurrentTasks];
            });
      }

      // function handleDelete() {

      // }

      if (!currList) return null;

      return (
            <header className="flex items-center justify-between px-4 h-14 border-b border-neutral-800 flex-shrink-0">
                  <div className="flex items-center gap-3">
                        <span className="text-2xl">{currList.icon}</span>
                        <div className='felx flex-col'>
                              <h1 className="font-mogra text-base font-semibold text-white">
                                    {currList.name.toUpperCase()}
                              </h1>
                              <p className="text-xs text-neutral-500">
                                    {done} of {total} done ({percent}%)
                              </p>
                        </div>
                        <button
                              className='self-start mt-2 bg-red-500/40 rounded px-1 font-semibold text-xs text-orange-100 hover:bg-rose-700 hover:text-white-200 '
                              onClick={evt => { deleteCurrList(currList.id) }}
                        >DELETE</button>
                  </div>

                  <div className="flex items-center gap-2">
                        <Button variant="ghost" size="md" onClick={handleSort}>
                              <i className="bi bi-arrow-down-up"></i> Sort
                        </Button>
                        <Button
                              variant={isAIChatOpen ? 'default' : 'ghost'}
                              size="md"
                              onClick={() => setIsAIChatOpen(!isAIChatOpen)}
                        >
                              <i class="bi bi-openai"></i>Ask AI
                        </Button>
                        <button
                              title="Logout"
                              className="text-neutral-500 border-0 bg-transparent hover:text-neutral-300 hover:translate-x-0.5 "
                              size="md"
                              onClick={handleLogout}>
                              <LogOut className='py-1' />
                        </button>
                  </div>
            </header >
      )
}
