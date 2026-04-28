import Sidebar from "./SideBar";
import Header from "./Header";
import TaskList from "../tasks/TaskList";
import { useAppState } from "../../providers/AppProvider";
import { toast, Toaster } from 'react-hot-toast';
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import AIChatPanel from "../ai/AIChatPanel";
import { useEffect, useRef } from "react";


export default function AppShell() {

      const {
            user,
            currentList,
            currentListTodos,
            addTodo,
            toggleTodo,
            deleteTodo,
            isAIChatOpen,
            setIsAIChatOpen
      } = useAppState();

      const location = useLocation();
      const navigate = useNavigate();
      const toastedRef = useRef(false);   //(Persistent storage)CACHES THE STATE , UNLIKE STATE, IT DOESN'T RE-RENDERS -> which has a property .current() -> PROVIDE THE CACHED CURRENT STATE

      useEffect(() => {
            if (!isAIChatOpen) return;
            const displayName = user?.user_metadata?.name || user?.email || "there";
            toast(
                  <span className="flex items-center gap-2">
                        <i className="bi bi-openai text-white-400"></i>
                        <p>Hey {displayName}. How can I help you?</p>
                  </span>
            );
      }, [isAIChatOpen, user]);
      useEffect(() => {
            if (location?.state?.loggedIn && !toastedRef.current) {
                  toast.success('Logged In successfully.', {
                        icon: '👏'
                  })
                  toastedRef.current = true;   //MARKS AS DONE.
            }
            if (location.state && Object.keys(location.state).length > 0) {
                  navigate(location.pathname, { replace: true, state: {} });
            }
      }, [location.pathname, navigate, location.state])
      return (
            <div className="flex h-screen max-w-screen gap-1 overflow-hidden bg-neutral-950">
                  <Toaster
                        position="top-center"
                        toastOptions={{
                              duration: 2000,
                              style: {
                                    background: '#333',
                                    color: '#fff'
                              }
                        }} />
                  {/** SIDEBAR */}
                  <Sidebar />

                  {/** MAIN PANEL */}
                  <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        <Header />
                        <div className="flex-1 flex flex-col min-h-0 bg-neutral-900 border border-neutral-800 mx-4 mb-4 mr-4 p-5 overflow-hidden rounded-lg">
                              <TaskList
                                    list={currentList}
                                    tasks={currentListTodos}
                                    onAdd={addTodo}
                                    onToggle={toggleTodo}
                                    onDelete={deleteTodo}
                              />
                              <Outlet />
                        </div>
                  </main>

                  {/** AI CHAT PANEL */}
                  <AIChatPanel
                        isOpen={isAIChatOpen}
                        onClose={() => setIsAIChatOpen(false)}
                  />
            </div>

      )
}
