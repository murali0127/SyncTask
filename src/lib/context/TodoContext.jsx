import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../supabase-client';
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
            if (!user) {
                  setTodo([]);
                  return;
            }

            fetchTodo();
            //CONNECTING THE REALTIME DATABASE TO HANDLE CHANGE OF EVENTS USING SUPABASE CHANNEL
            const userId = user?.id;
            const channel = supabase
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
                                    setTodo(prev => [...prev, payload.new])
                              } else if (payload.eventType == 'UPDATE') {
                                    setTodo(prev => prev.map(td => td.id === payload.old.id ? payload.new : td));
                              } else {
                                    setTodo(prev => prev.filter(td => td.id !== payload.old.id))
                              }
                        }
                  )
            channel.subscribe();  //subscribe to start listening.

            //REMOVING PREV CHANNEL CONNECTION -> TO OVERCOME TOO MANY OPEN CHANNELS
            return () => supabase.removeChannel(channel);

      }, [user?.id]);


      const extractError = (err) => err?.message ?? "An unexpected error occurs!";  //NORMALIZE THE ERROR OBJECT.

      const fetchTodo = async () => {
            setError(null);
            try {

                  if (!user) return;

                  setLoading(true);

                  const { data, error } = await supabase
                        .from('todos')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false }) //NEW FIRST
                  if (error) {
                        console.log(error.message);
                        setError(extractError(error));
                        return;
                  }
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

                  const { error } = await supabase  //data -> Has been Automatically Handled by Supabase.
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
                        setError(extractError(error));
                        return;
                  }
                  console.log('Data added to todo successfully.')
                  return { error: null }
            } catch (err) {
                  console.log(err.message);
                  setError(extractError(err));
                  return;
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
                        return;
                  }
                  console.log('Todo has been Deleted from the Table....')
                  return { error: null }
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
            toggleTodo,
            refreshTodos: fetchTodo

      }

      return (
            <TodoContext.Provider value={value}>
                  {children}
            </TodoContext.Provider >
      );
}
