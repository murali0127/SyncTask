import { createContext, useContext, useState, useMemo } from 'react'

const AppContext = createContext(null)

const MOCK_LISTS = [
      { id: '1', name: 'Work', icon: '💼', color: '#8b5cf6' },
      { id: '2', name: 'Personal', icon: '🏠', color: '#3b82f6' },
      { id: '3', name: 'Learning', icon: '📚', color: '#ec4899' },
      { id: '4', name: 'Health', icon: '💪', color: '#22c55e' },
]

const MOCK_TASKS = [
      { id: '1', listId: '1', title: 'Review Q4 product roadmap', priority: 'high', done: false, aiSuggested: false, due: 'Today' },
      { id: '2', listId: '1', title: 'Finalize API documentation', priority: 'high', done: false, aiSuggested: false, due: 'Tomorrow' },
      { id: '3', listId: '1', title: 'Stand-up meeting prep', priority: 'medium', done: true, aiSuggested: false, due: 'Today' },
      { id: '4', listId: '1', title: 'Update onboarding flow', priority: 'medium', done: false, aiSuggested: true, due: 'Friday' },
      { id: '5', listId: '1', title: 'Code review — auth module', priority: 'high', done: false, aiSuggested: false, due: 'Today' },
      { id: '6', listId: '1', title: 'Reply to design team', priority: 'low', done: true, aiSuggested: false, due: 'Done' },
      { id: '7', listId: '2', title: 'Grocery shopping', priority: 'medium', done: false, aiSuggested: false, due: 'Today' },
      { id: '8', listId: '2', title: 'Book dentist appointment', priority: 'high', done: false, aiSuggested: false, due: 'This week' },
      { id: '9', listId: '3', title: 'Complete React fundamentals', priority: 'high', done: false, aiSuggested: false, due: 'Today' },
      { id: '10', listId: '3', title: 'Build Supabase project', priority: 'high', done: false, aiSuggested: true, due: 'Day 2' },
      { id: '11', listId: '4', title: 'Morning run 5km', priority: 'medium', done: true, aiSuggested: false, due: 'Done' },
      { id: '12', listId: '4', title: 'Prep meals for the week', priority: 'low', done: false, aiSuggested: false, due: 'Sunday' },
]
const SAMPLE_USER = {
      id: 'Murali',
      displayName: 'Murali_01',
      email: 'sample@example.com',
      bio: 'Web developer and tech enthusiast',
      avatarUrl: null,
      preferences: {
            theme: 'dark',
            notifications: true
      }
};


export function AppProvider({ children }) {
      const [lists, setList] = useState(MOCK_LISTS);
      const [tasks, setTask] = useState(MOCK_TASKS);
      const [user, setUser] = useState(SAMPLE_USER);
      const [selectedListId, setSelectedListId] = useState('1');

      const [isAIChatOpen, setIsAIChatOpen] = useState(false);

      function addTasks(title, priority) {
            const newTask = {
                  id: crypto.randomUUID(),
                  listId: selectedListId,
                  title,
                  priority,
                  done: false,
                  aiSuggested: false,
                  due: 'Today'
            }
            setTask(oldTasks => [newTask, ...oldTasks])
      }
      //SET COMPLETED
      function toggleTask(id) {
            setTask((oldTask) => {
                  return oldTask.map(task => task.id == id ? { ...task, done: !task.done } : task)
            })
      }

      //DELETING THE TASK
      function deleteTask(id) {
            setTask((oldTask) => {
                  return oldTask.filter(task => task.id !== id)
            })
      }

      //FUNCTION TO ADD LIST
      function addList(name, icon, color) {
            const newList = {
                  id: crypto.randomUUID(),
                  name,
                  icon,
                  color
            };
            setList(previous =>
                  [...previous, newList] //Copy Previous and Update it
            )
      }
      function deleteCurrList(list_id) {
            setTask((prevTask) => {
                  return prevTask.filter(task => task.listId !== list_id);
            })
            setList((prevList) => {
                  return prevList.filter(list => list.id !== list_id);
            })
      }

      //FUNCTION TO UPDATE USER
      function updateUserProfile(updates) {
            setUser(prev => ({
                  ...prev, //COPY OLD USER OBJECt
                  ...updates,
                  updatedAt: new Date().toISOString()
            }));
      }

      const currListTasks = tasks.filter(task => task.listId === selectedListId);
      const currList = lists.find(list => list.id === selectedListId);

      const value = useMemo(() => ({
            lists, tasks,
            selectedListId, setSelectedListId,
            currList, currListTasks,
            addTasks, toggleTask, deleteTask, addList,
            user, updateUserProfile, deleteCurrList,
            isAIChatOpen, setIsAIChatOpen
      }), [user, lists, tasks, selectedListId, setTask, setList, isAIChatOpen])

      //PROVIDE VALUE TO THE CHILDRENS
      return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
      const ctx = useContext(AppContext);
      if (!ctx) console.log('UseAppState must be used inside AppProvider.');
      return ctx
}
