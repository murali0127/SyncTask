import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase-client';


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const extractError = (err) => err?.message ?? "An unexpected error occured!"; //IMPLICIT RETURN -> If {} not used.

      useEffect(() => {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                  async (event, session) => {
                        const currUser = session?.user ?? null;
                        setUser(currUser);

                        if (currUser) {
                              const { data, error } = await supabase
                                    .from('profiles')
                                    .select('*')
                                    .eq('id', currUser.id)
                                    .maybeSingle();   //Friendlier Version of ".single() --> states that expecting for only one Row, it is very Strict. So the friendlier version .maybeSingle() is used"
                              //SET NEW USER
                              if (!error) {
                                    setProfile(data);
                              }
                              else {
                                    setError(extractError(error.message));
                              }
                        } else {
                              setProfile(null);   //NOE CURRENT USER
                        }
                        if (event === 'INITIAL_SESSION') {
                              setLoading(false)
                        }
                  }
            );

            return () => subscription.unsubscribe();
      }, [])


      async function signup(email, password, name) {


            setError(null);            // SignUp --> User Created --> E-mail Confirmation --> User Clicks confirmation link --> Session created --> THEN sigged In (NEW User created).
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
            setError(null);
            try {

                  const { data, error } = await supabase.auth.signInWithPassword({
                        email, password
                  })
                  if (error) {
                        console.log(error.message);
                        setError(extractError(error));
                        return { data: null, error: error };
                  }
                  setError(null);
                  return { data, error: null }
            } catch (err) {
                  console.log(err);
                  setError(extractError(err));
                  return { data: null, error: err.message };
            }
      }
      async function signout() {
            try {

                  const { data, error } = await supabase.auth.signOut();
                  if (error) {
                        console.log(error);
                        setError(extractError(error));
                        return { data: null, error: error.message };
                  }
                  setError(null);
                  return { data: 'Log out successfull.', error: null };
            } catch (err) {
                  console.log(err.message);
                  setError(extractError(err));
                  return { data: null, error: err.message };
            }
      }

      const value = {
            user, profile, loading, error, signup, login, signout
      }

      return (
            <AuthContext.Provider value={value}>
                  {children}
            </AuthContext.Provider>
      )

}