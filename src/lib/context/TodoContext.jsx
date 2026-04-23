import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../supabase-client';
import { useAuth } from './AuthContext';

const TodoContext = createContext({});

export const useTodo = () => useContext(TodoContext);

export default function TodoProvider({ children }) {
      const { user } = useAuth();
      const [todo, setTodo] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      useEffect(() => {
            if (!user) {
                  setTodo([]);
                  return;
            }

            fetchTodo();

            const channel = supabase
                  .channel('todos-chanegs')
                  .on(
                        'postgres_changes',
                        {
                              event: '*',
                              schema: 'public',
                              table: 'todos',
                              filter: `user_id=eq.${user.id}`
                        },
                        (payload) => {
                              if (payload.eventType == 'INSERT') {
                                    setTodo(prev => [...prev, payload.new])
                              } else if (payload.eventType == 'UPDATE') {
                                    setTodo(prev => prev.map(td => td.id === payload.old.id ? payload.new : td));
                              } else {
                                    setTodo(prev => prev.filter(td => td.id !== payload.old.id))
                              }
                        }
                  )
                  .subscribe();

            return () => supabase.removeChannel(channel)
      }, [user]);



      const fetchTodo = async () => {
            try {

                  if (!user) return;

                  setLoading(true);
                  setError(null);

                  const { data, error } = await supabase
                        .from('todos')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false }) //NEW FIRST
                  if (error) {
                        console.log(error.message);
                        return;
                  }
                  setTodo(data);
            } catch (err) {
                  console.log(err.message);
                  setError(err);
                  return;
            } finally {
                  setLoading(false);
            }
      }
      const addTodo = async (title, options = {}) => {
            try {

                  const { data, error } = await supabase
                        .from('todos')
                        .insert({
                              user_id: user.id,
                              title: title,
                              description: options.description || null,
                              priority: options.priority,
                              due_date: options.due_date || null
                        })
                        .select()
                        .single()

                  if (error) {
                        console.log(error);
                        return;
                  }
                  console.log('Data added to todo successfully.')
                  return { data, error: null }
            } catch (err) {
                  console.log(err.message);
                  return;
            }
      }

      const updateTodo = async (id, updates) => {
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
                        return
                  }
                  console.log('Todo List Updated Successfully.');
                  return { data, error: null };
            } catch (err) {
                  console.log(err.message);
                  return;
            }
      }

      const toggleTodo = async (id, completed) => {
            return updateTodo(id, { completed });
      }

      const deleteTodo = async (id) => {
            try {

                  const { data, error } = await supabase
                        .from('todos')
                        .delete()
                        .eq('id', id)
                        .eq('user_id', user.id)
                        .select()

                  if (error) {
                        console.log(error.message);
                        return;
                  }
                  console.log('Todo has been Deleted from the Table....')
                  return { data, error: null }
            } catch (err) {
                  console.log(err.message);
                  return;
            }

      };

      const value = {
            todo,
            loading,
            error,
            addTodo,
            updateTodo,
            deleteTodo,
            refreshTodos: fetchTodo

      }

      return (
            <TodoContext.Provider value={value}>
                  {children}
            </TodoContext.Provider >
      );
}
