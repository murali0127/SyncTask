import Sidebar from "./SideBar";
import Header from "./Header";
import TaskList from "../tasks/TaskList";
import { useAppState } from "../../providers/AppProvider";
import { toast, Toaster } from 'react-hot-toast';
import { Outlet } from "react-router-dom";

import AIChatPanel from "../ai/AIChatPanel";
import { useEffect } from "react";
const userName = 'Murali';

export default function AppShell() {
      const { currListTasks, addTasks, toggleTask, deleteTask, isAIChatOpen, setIsAIChatOpen } = useAppState();

      useEffect(() => {
            if (isAIChatOpen) {

                  toast(
                        < span className="flex items-center gap-2" >
                              <i className="bi bi-openai text-white-400"></i>
                              <p>
                                    Hey {userName}. How can i help you.
                              </p>
                        </span >
                  )
            }

      })
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
                                    tasks={currListTasks}
                                    onAdd={addTasks}
                                    onToggle={toggleTask}
                                    onDelete={deleteTask}
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
