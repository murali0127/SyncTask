import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { useTodo } from '../lib/context/TodoContext';
import { useAuth } from '../lib/context/AuthContext';
import { userListContext } from '../lib/context/ListContext';
const AppContext = createContext(null)

/**COMPLETE NEW APP PROVIDER 
 * -------------------------*
 *          SupaBase
 *              | 
 *              |
 *      Contexts[AuthContext, ListContext, TodoContext]  
 *              |
 *              |
 *         AppProvider    
 *              |
 *              |
 *         Components
 * 
 * -------------------------*
**/


export default function AppProvider({ children }) {
      const { todo,
            loading: todoLoading,
            error: todoError,
            addTodo,
            updateTodo,
            deleteTodo,
            toggleTodo,
            refreshTodos: fetchTodo } = useTodo();
      const { user, profile, loading: authLoading, error: authError, signup, login, signout } = useAuth();
      const { lists, loading: listLoading, error: listError, createList, updateList, deleteList, refetch: refetchLists } = userListContext();

      // Which list is currently selected for filtering
      const [selectedListId, setSelectedListId] = useState(null);

      // UI sorting preference (NOT persisted to DB)
      const [sortBy, setSortBy] = useState('created_at-desc');
      // Options: 'created_at-desc', 'priority-desc', 'completed', 'alphabetical'

      // AI chat panel visibility
      const [isAIChatOpen, setIsAIChatOpen] = useState(false);
      const [addingTodo, setAddingTodo] = useState(false);

      // Search/filter text
      const [searchText, setSearchText] = useState('');

      // View mode (list view vs kanban board vs calendar)
      const [viewMode, setViewMode] = useState('list');

      // Options: 'list', 'kanban', 'calendar'

      const currentList = useMemo(() => {
            return lists?.find(l => l.id === selectedListId) || null;
      }, [lists, selectedListId]);

      useEffect(() => {
            if (!selectedListId && lists?.length) {
                  setSelectedListId(lists[0].id);
            }
      }, [lists, selectedListId]);


      const currentListTodos = useMemo(() => {
            let filtered = (todo || []).filter(t => {
                  // Match selected list
                  const matchedList = !selectedListId || t.list_id === selectedListId;

                  // Match search text if provided
                  const matchedSearch = !searchText ||
                        t.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                        t.description?.toLowerCase().includes(searchText.toLowerCase());

                  return matchedList && matchedSearch;
            });

            return filtered;
      }, [todo, selectedListId, searchText]);


      const sortedTodos = useMemo(() => {
            const todosCopy = [...currentListTodos];

            switch (sortBy) {
                  case 'created_at-desc':
                        return todosCopy.sort((a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                        );

                  case 'created_at-asc':
                        return todosCopy.sort((a, b) =>
                              new Date(a.created_at) - new Date(b.created_at)
                        );

                  case 'priority-desc': {
                        const priorityMap = { high: 1, medium: 2, low: 3 };
                        return todosCopy.sort((a, b) =>
                              (priorityMap[a.priority] || 999) - (priorityMap[b.priority] || 999)
                        );
                  }

                  case 'completed':
                        return todosCopy.sort((a, b) =>
                              a.completed === b.completed ? 0 : a.completed ? 1 : -1
                        );

                  case 'alphabetical':
                        return todosCopy.sort((a, b) =>
                              (a.title || '').localeCompare(b.title || '')
                        );

                  default:
                        return todosCopy;
            }
      }, [currentListTodos, sortBy]);

      const taskStats = useMemo(() => {
            const total = currentListTodos.length;
            const completed = currentListTodos.filter(t => t.completed).length;
            const incomplete = total - completed;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            // Count by priority
            const byPriority = {
                  high: currentListTodos.filter(t => t.priority === 'high').length,
                  medium: currentListTodos.filter(t => t.priority === 'medium').length,
                  low: currentListTodos.filter(t => t.priority === 'low').length
            };

            // Count overdue (due_date < today)
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const overdue = currentListTodos.filter(t => {
                  if (!t.due_date) return false;
                  const dueDate = new Date(t.due_date);
                  return dueDate < now && !t.completed;
            }).length;

            return {
                  total,
                  completed,
                  incomplete,
                  percentage,
                  byPriority,
                  overdue
            };
      }, [currentListTodos]);

      const listStats = useMemo(() => {
            return (lists || []).map(list => ({
                  ...list,
                  todoCount: (todo || []).filter(t => t.list_id === list.id).length,
                  completedCount: (todo || [])
                        .filter(t => t.list_id === list.id && t.completed).length
            }));
      }, [lists, todo]);

      const userStats = useMemo(() => {
            if (!todo || !user) return null;

            const userTodos = todo.filter(t => t.user_id === user.id);
            const completedToday = userTodos.filter(t => {
                  const created = new Date(t.created_at);
                  const today = new Date();
                  return created.toDateString() === today.toDateString() && t.completed;
            }).length;
            const currentList = lists.length;

            return {
                  totalTodos: userTodos.length,
                  completedTodos: userTodos.filter(t => t.completed).length,
                  completedToday,
                  averagePriority: userTodos.length > 0
                        ? (userTodos.filter(t => t.priority === 'high').length / userTodos.length * 100).toFixed(1)
                        : 0,
                  currentList
            };
      }, [todo, user]);

      const addTodoWithValidation = useCallback(async (title, options = {}) => {
            // Validation 1: Check if user is authenticated
            if (!user?.id) {
                  return { success: false, error: 'Please log in first' };
            }

            // Validation 2: Check if title is provided and not empty
            if (!title || !title.trim()) {
                  return { success: false, error: 'Title cannot be empty' };
            }

            // Validation 3: Check if list is selected
            if (!selectedListId) {
                  return { success: false, error: 'Please select a list' };
            }

            try {
                  setAddingTodo(true);
                  // Call actual TodoContext function
                  const result = await addTodo(title.trim(), {
                        priority: options.priority || 'medium',
                        description: options.description || null,
                        due_date: options.due_date || null,
                        list_id: selectedListId
                  });

                  if (result?.error) {
                        return { success: false, error: result.error };
                  }

                  return { success: true };

            } catch (err) {
                  console.error('Error adding todo:', err);
                  return { success: false, error: err.message };
            } finally {
                  setAddingTodo(false);
            }
      }, [addTodo, user, selectedListId]);

      const updateTodoWithValidation = useCallback(async (todoId, updates) => {
            if (!todoId) {
                  return { success: false, error: 'Invalid todo ID' };
            }

            try {
                  const result = await updateTodo(todoId, updates);
                  if (result?.error) {
                        return { success: false, error: result.error };
                  }
                  return { success: true };
            } catch (err) {
                  return { success: false, error: err.message };
            }
      }, [updateTodo]);


      const deleteTodoWithValidation = useCallback(async (todoId) => {
            if (!todoId) {
                  return { success: false, error: 'Invalid todo ID' };
            }

            try {
                  const result = await deleteTodo(todoId);
                  if (result?.error) {
                        return { success: false, error: result.error };
                  }
                  return { success: true };
            } catch (err) {
                  return { success: false, error: err.message };
            }
      }, [deleteTodo]);


      const createListWithValidation = useCallback(async (name, icon, color) => {
            if (!name || !name.trim()) {
                  return { success: false, error: 'List name cannot be empty' };
            }

            try {
                  const result = await createList({
                        title: name.trim(),
                        icon,
                        color,
                        user_id: user?.id
                  });

                  if (result?.error) {
                        return { success: false, error: result.error };
                  }

                  // Auto-select the newly created list
                  if (result?.id) {
                        setSelectedListId(result.id);
                  }

                  return { success: true };
            } catch (err) {
                  return { success: false, error: err.message };
            }
      }, [createList, user]);


      /** ============================
       * COMBINED STATE INDICATORS
       * =========================== */
      const isLoading = useMemo(() => {
            return authLoading || listLoading || todoLoading || addingTodo;
      }, [authLoading, listLoading, todoLoading, addingTodo]);

      // What error to show? (Prioritize by importance)
      const combinedError = useMemo(() => {
            return authError || listError || todoError || null;
      }, [authError, listError, todoError]);

      // Is user authenticated AND loaded?
      const isAuthenticated = useMemo(() => {
            return !!user && !authLoading;
      }, [user, authLoading]);

      // Is app fully initialized? (all contexts loaded)
      const isAppReady = useMemo(() => {
            return isAuthenticated && !listLoading && !todoLoading;
      }, [isAuthenticated, listLoading, todoLoading]);


      const value = useMemo(() => ({
            /**
             * ─────────────────────────────────────────────────────
             * USER & AUTHENTICATION SECTION
             * ─────────────────────────────────────────────────────
             */
            user,
            profile,
            isAuthenticated,
            userStats,

            /**
             * ─────────────────────────────────────────────────────
             * LISTS SECTION
             * ─────────────────────────────────────────────────────
             */
            lists,
            listStats,
            currentList,
            selectedListId,
            setSelectedListId,

            /**
             * ─────────────────────────────────────────────────────
             * TODOS SECTION
             * ─────────────────────────────────────────────────────
             */
            todos: todo,              // Expose as 'todos' for clarity
            currentListTodos,
            sortedTodos,
            taskStats,

            /**
             * ─────────────────────────────────────────────────────
             * UI STATE SECTION
             * ─────────────────────────────────────────────────────
             */
            sortBy,
            setSortBy,
            searchText,
            setSearchText,
            viewMode,
            setViewMode,
            isAIChatOpen,
            setIsAIChatOpen,

            /**
             * ─────────────────────────────────────────────────────
             * OPERATIONS SECTION
             * ─────────────────────────────────────────────────────
             */
            // Todo operations
            addTodo: addTodoWithValidation,
            updateTodo: updateTodoWithValidation,
            toggleTodo,
            deleteTodo: deleteTodoWithValidation,
            refreshTodos: fetchTodo,

            // List operations
            createList: createListWithValidation,
            updateList,
            deleteList,
            refetchLists,

            // Auth operations
            signup,
            login,
            signout,

            /**
             * ─────────────────────────────────────────────────────
             * STATUS INDICATORS SECTION
             * ─────────────────────────────────────────────────────
             */
            isLoading,
            isAppReady,
            addingTodo,
            authLoading,
            listLoading,
            todoLoading,

            /**
             * ─────────────────────────────────────────────────────
             * ERROR SECTION
             * ─────────────────────────────────────────────────────
             */
            combinedError,
            authError,
            listError,
            todoError

      }), [
            // Dependencies list - include everything in value
            user, profile, isAuthenticated, userStats,
            lists, listStats, currentList, selectedListId,
            todo, currentListTodos, sortedTodos, taskStats,
            sortBy, searchText, viewMode, setViewMode, isAIChatOpen,
            addTodoWithValidation, updateTodoWithValidation, toggleTodo, deleteTodoWithValidation, fetchTodo,
            createListWithValidation, updateList, deleteList, refetchLists,
            signup, login, signout,
            isLoading, isAppReady, addingTodo, authLoading, listLoading, todoLoading,
            combinedError, authError, listError, todoError
      ]);


      return (
            <AppContext.Provider value={value}>
                  {children}
            </AppContext.Provider>
      )
}

export function useAppState() {
      const ctx = useContext(AppContext);
      if (!ctx) throw new Error('UseAppState must be used inside AppProvider.');
      return ctx;
}
// const MOCK_LISTS = [
//       { id: '1', name: 'Work', icon: '💼', color: '#8b5cf6' },
//       { id: '2', name: 'Personal', icon: '🏠', color: '#3b82f6' },
//       { id: '3', name: 'Learning', icon: '📚', color: '#ec4899' },
//       { id: '4', name: 'Health', icon: '💪', color: '#22c55e' },
// ]

// const MOCK_TASKS = [
//       { id: '1', listId: '1', title: 'Review Q4 product roadmap', priority: 'high', done: false, aiSuggested: false, due: 'Today' },
//       { id: '2', listId: '1', title: 'Finalize API documentation', priority: 'high', done: false, aiSuggested: false, due: 'Tomorrow' },
//       { id: '3', listId: '1', title: 'Stand-up meeting prep', priority: 'medium', done: true, aiSuggested: false, due: 'Today' },
//       { id: '4', listId: '1', title: 'Update onboarding flow', priority: 'medium', done: false, aiSuggested: true, due: 'Friday' },
//       { id: '5', listId: '1', title: 'Code review — auth module', priority: 'high', done: false, aiSuggested: false, due: 'Today' },
//       { id: '6', listId: '1', title: 'Reply to design team', priority: 'low', done: true, aiSuggested: false, due: 'Done' },
//       { id: '7', listId: '2', title: 'Grocery shopping', priority: 'medium', done: false, aiSuggested: false, due: 'Today' },
//       { id: '8', listId: '2', title: 'Book dentist appointment', priority: 'high', done: false, aiSuggested: false, due: 'This week' },
//       { id: '9', listId: '3', title: 'Complete React fundamentals', priority: 'high', done: false, aiSuggested: false, due: 'Today' },
//       { id: '10', listId: '3', title: 'Build Supabase project', priority: 'high', done: false, aiSuggested: true, due: 'Day 2' },
//       { id: '11', listId: '4', title: 'Morning run 5km', priority: 'medium', done: true, aiSuggested: false, due: 'Done' },
//       { id: '12', listId: '4', title: 'Prep meals for the week', priority: 'low', done: false, aiSuggested: false, due: 'Sunday' },
// ]
// const SAMPLE_USER = {
//       id: 'Murali',
//       displayName: 'Murali_01',
//       email: 'sample@example.com',
//       bio: 'Web developer and tech enthusiast',
//       avatarUrl: null,
//       preferences: {
//             theme: 'dark',
//             notifications: true
//       }
// };


// export function AppProvider({ children }) {
//       const { todo,
//             loading: todoLoading,
//             error: todoError,
//             addTodo,
//             updateTodo,
//             deleteTodo,
//             toggleTodo, fetchTodo } = useTodo();
//       const { user, profile, loading: authLoading, error: authError, signup, login, signout } = useAuth();
//       const { } = useList();

//       const [lists, setList] = useState(MOCK_LISTS);
//       const [tasks, setTask] = useState(MOCK_TASKS);
//       // const [user, setUser] = useState(SAMPLE_USER);
//       const [selectedListId, setSelectedListId] = useState('1');
//       const [isAIChatOpen, setIsAIChatOpen] = useState(false);
//       const [sortBy, setSortBy] = useState('date-desc')


//       // function addTasks(title, priority) {
//       //       const newTask = {
//       //             id: crypto.randomUUID(),
//       //             listId: selectedListId,
//       //             title,
//       //             priority,
//       //             done: false,
//       //             aiSuggested: false,
//       //             due: 'Today'
//       //       }
//       //       setTask(oldTasks => [newTask, ...oldTasks])
//       // }
//       // //SET COMPLETED
//       // function toggleTask(id) {
//       //       setTask((oldTask) => {
//       //             return oldTask.map(task => task.id == id ? { ...task, done: !task.done } : task)
//       //       })
//       // }

//       // //DELETING THE TASK
//       // function deleteTask(id) {
//       //       setTask((oldTask) => {
//       //             return oldTask.filter(task => task.id !== id)
//       //       })
//       // }

//       // //FUNCTION TO ADD LIST
//       // function addList(name, icon, color) {
//       //       const newList = {
//       //             id: crypto.randomUUID(),
//       //             name,
//       //             icon,
//       //             color
//       //       };
//       //       setList(previous =>
//       //             [...previous, newList] //Copy Previous and Update it
//       //       )
//       // }
//       // function deleteCurrList(list_id) {
//       //       setTask((prevTask) => {
//       //             return prevTask.filter(task => task.listId !== list_id);
//       //       })
//       //       setList((prevList) => {
//       //             return prevList.filter(list => list.id !== list_id);
//       //       })
//       // }

//       // //FUNCTION TO UPDATE USER
//       // function updateUserProfile(updates) {
//       //       setUser(prev => ({
//       //             ...prev, //COPY OLD USER OBJECt
//       //             ...updates,
//       //             updatedAt: new Date().toISOString()
//       //       }));
//       // }

//       // const currListTasks = tasks.filter(task => task.listId === selectedListId);
//       // const currList = lists.find(list => list.id === selectedListId);

//       // const value = useMemo(() => ({
//       //       lists, tasks,
//       //       selectedListId, setSelectedListId,
//       //       currList, currListTasks,
//       //       addTasks, toggleTask, deleteTask, addList,
//       //       user, updateUserProfile, deleteCurrList,
//       //       isAIChatOpen, setIsAIChatOpen
//       // }), [user, lists, tasks, selectedListId, setTask, setList, isAIChatOpen])

//       //PROVIDE VALUE TO THE CHILDRENS
//       return <AppContext.Provider value={value}>{children}</AppContext.Provider>
// }

// export function useAppState() {
//       const ctx = useContext(AppContext);
//       if (!ctx) throw new Error('UseAppState must be used inside AppProvider.');
//       return ctx
// }




