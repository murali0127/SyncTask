import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase-client';


const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);


      useEffect(() => {
            const getSession = async () => {
                  try {

                        const { data: { session }, error } = await supabase.auth.getSession();
                        setUser(session?.user ?? null)
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false)
                  }
            };

            getSession();

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                  async (event, session) => {
                        setUser(session?.user ?? null);
                        setLoading(false)
                  }
            );

            return () => subscription.unsubscribe();
      }, [])


      async function signup(email, password, name) {
            try {

                  const { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                              data: { name }
                        }
                  });

                  if (error) {
                        console.error(error)
                        return { data: null, error };
                  }
                  return { data, error: null };
            } catch (err) {
                  console.error(err);
                  return { data: null, error: err.message };
            }
      }

      async function login(email, password) {
            try {

                  const { data, error } = await supabase.auth.signInWithPassword({
                        email, password
                  })
                  if (error) {
                        console.log(error.message);
                        setError(error);
                        return { data: null, error };
                  }
                  setError(null);
                  return { data, error: null }
            } catch (err) {
                  console.log(err);
                  setError(err);
                  return { data: null, error: err.message };
            }
      }
      async function signout() {
            try {

                  const { data, error } = await supabase.auth.signOut();
                  if (error) {
                        console.log(error);
                        setError(error);
                        return { data: null, error: error.message };
                  }
                  setError(null);
                  return { data: 'Log out successfull.', error: null };
            } catch (err) {
                  console.log(err.message);
                  setError(err);
                  return { data: null, error: err.message };
            }
      }

      const value = {
            user, loading, error, signup, login, signout
      }

      return (
            <AuthContext.Provider value={value}>
                  {children}
            </AuthContext.Provider>
      )

}