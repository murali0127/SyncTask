import Button from '../ui/Button';
import { useAppState } from "../../providers/AppProvider";
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


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
            signout
      } = useAppState();
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

                  <div className="flex items-center gap-2">
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
