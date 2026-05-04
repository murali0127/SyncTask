import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../supabase-client.jsx';
import { useAuth } from './AuthContext';
import { validateTodo } from "../db/models/Todo";

const TodoContext = createContext(null);

export const useTodo = () => {
      const ctx = useContext(TodoContext);
      if (!ctx) {
            throw new Error("Use Todo Must be used inside a TodoProvider.")
      }
      return ctx;
}


export default function TodoProvider({ children }) {
      const { user } = useAuth();
      const [todo, setTodo] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      useEffect(() => {

            let channel;
            if (!user) {
                  setTodo([]);
                  return;
            }

            const init = async () => {
                  await fetchTodo(user);
                  //CONNECTING THE REALTIME DATABASE TO HANDLE CHANGE OF EVENTS USING SUPABASE CHANNEL
                  const userId = user?.id;
                  channel = supabase
                        .channel(`todos-${userId}`)
                        .on(
                              'postgres_changes',
                              {
                                    event: '*',
                                    schema: 'public',
                                    table: 'todos',
                                    filter: `user_id=eq.${user?.id}`
                              },
                              (payload) => {
                                    if (payload.eventType == 'INSERT') {
                                          setTodo(prev => {
                                                if (prev.some(td => td.id === payload.new.id)) return prev;
                                                return [payload.new, ...prev];
                                          })
                                    } else if (payload.eventType == 'UPDATE') {
                                          setTodo(prev => prev.map(td => td.id === payload.old.id ? payload.new : td));
                                    } else {
                                          setTodo(prev => prev.filter(td => td.id !== payload.old.id))
                                    }
                              }
                        )
                        .subscribe();  //subscribe to start listening.

                  return channel;
            }
            const channelPromise = init();

            //REMOVING PREV CHANNEL CONNECTION -> TO OVERCOME TOO MANY OPEN CHANNELS
            return () => {
                  channelPromise.then(channel => {
                        if (channel) supabase.removeChannel(channel);
                  })

            };
      }, [user]);


      const extractError = (err) => {
            if (typeof err === 'string') return err;

            return err?.message ?? "An unexpected error occurs!";
      }  //NORMALIZE THE ERROR OBJECT.

      const fetchTodo = async (currUser) => {
            setError(null);
            try {

                  if (!currUser) return;

                  setLoading(true);
                  setError(null);
                  // console.log('User_id: ', currUser.id, typeof currUser.id)
                  const { data, error } = await supabase
                        .from('todos')
                        .select('*')
                        .eq('user_id', currUser.id)
                        .order('created_at', { ascending: false }) //NEW FIRST
                  if (error) {
                        console.log(error.message);
                        setError(extractError(error));
                        return;
                  }
                  console.log(data);
                  console.error(error);
                  setTodo(data);
            } catch (err) {
                  console.log(err.message);
                  setError(extractError(err));
                  return;
            } finally {
                  setLoading(false);
            }
      }
      const addTodo = async (title, options = {}) => {
            setError(null)

            console.log(options)

            const todoData = {
                  user_id: user.id,
                  title,
                  ...options
            };
            //VALIDATE TODO DATA
            const validation = validateTodo(todoData);
            if (!validation.isValid) {
                  setError(extractError(validation.errors.join(',')));
                  return;
            }


            try {

                  const { data, error } = await supabase  //data -> Has been Automatically Handled by Supabase.
                        .from('todos')
                        .insert({
                              user_id: user.id,
                              title: title,
                              description: options.description || null,
                              priority: options.priority,
                              due_date: options.due_date || null,
                              list_id: options.list_id || null
                        })
                        .select()
                        .single()

                  if (error) {
                        console.log(error);
                        setError(extractError(error));
                        return { error: extractError(error) };
                  }
                  // Optimistic local update so UI reflects instantly even if realtime is delayed.
                  setTodo(prev => [data, ...prev]);
                  console.log('Data added to todo successfully.')
                  return { data, error: null }
            } catch (err) {
                  console.log(err.message);
                  setError(extractError(err));
                  return { error: extractError(err) };
            }
      }

      const updateTodo = async (id, updates) => {
            setError(null);
            try {

                  const { data, error } = await supabase
                        .from('todos')
                        .update(updates)
                        .eq('id', id)
                        .eq('user_id', user.id)
                        .select()
                        .single()
                  if (error) {
                        console.log(error.message);
                        setError(extractError(error));
                        return { error: extractError(error) };
                  }
                  setTodo(prev => prev.map(td => td.id === id ? data : td));
                  console.log('Todo List Updated Successfully.');
                  return { data, error: null };
            } catch (err) {
                  console.log(err.message);
                  return { error: extractError(err) };
            }
      }

      const toggleTodo = async (id, completed) => {
            return updateTodo(id, { completed });
      }

      const deleteTodo = async (id) => {
            setError(null);
            try {

                  const { error } = await supabase
                        .from('todos')
                        .delete()
                        .eq('id', id)
                        .eq('user_id', user.id)
                        .select()

                  if (error) {
                        console.log(error.message);
                        setError(extractError(error));
                        return { error: extractError(error) };
                  }
                  setTodo(prev => prev.filter(td => td.id !== id));
                  console.log('Todo has been Deleted from the Table....')
                  return { error: null }
            } catch (err) {
                  console.log(err.message);
                  setError(extractError(err));
                  return { error: extractError(err) };
            }

      };

      const generalTodos = todo.filter(t => t.list_id === null);

      const value = {
            todo,
            loading,
            error,
            generalTodos,
            addTodo,
            updateTodo,
            deleteTodo,
            toggleTodo,
            refreshTodos: fetchTodo

      }

      return (
            <TodoContext.Provider value={value}>
                  {children}
            </TodoContext.Provider >
      );
}
