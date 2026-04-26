import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase-client.jsx';


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const extractError = (err) => err?.message ?? "An unexpected error occured!";

      const fetchOrCreateProfile = async (currUser) => {
            try {
                  const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', currUser.id)
                        .maybeSingle()


                  if (error) {
                        console.log(error);
                        throw error;
                  }
                  if (data) {
                        return data;
                  }

                  //CREATE ONE

                  const { data: newProfile, error: createError } = await supabase
                        .from('profiles')
                        .upsert({
                              id: currUser.id,
                              email: currUser.email,
                              name: currUser.name,
                              created_at: currUser,
                              role: currUser.role
                        })
                        .select()
                        .single()
                  if (createError) {
                        console.log(createError);
                        throw createError;
                  }
                  return newProfile;
            }
            catch (err) {
                  console.log('Profile error : ', err.message);
                  setError(extractError(err));
                  return null;
            }
      };

      useEffect(() => {
            let isMounted = true; //Flag -> THAT PREVENT STATE UPDATE

            // onAuthStateChange fires immediately with INITIAL_SESSION event, giving the current session — no need for a separate getSession() call.
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                  async (event, session) => {

                        if (!isMounted) return;

                        setLoading(true);
                        try {


                              const currUser = session?.user ?? null;
                              setUser(currUser);

                              if (currUser) {
                                    const profileData = await fetchOrCreateProfile(currUser);
                                    if (!isMounted) setProfile(profileData);
                              } else {
                                    if (!isMounted) {
                                          setUser(null);
                                          setProfile(null);
                                          setError(null);
                                    }
                              }
                        } catch (error) {
                              console.error('Auth state change error : ', error.message);
                              if (!isMounted) setError(extractError(error));
                        } finally {
                              if (isMounted) setLoading(false);
                        }
                  });


            const safetyTimeout = setTimeout(() => {
                  if (!isMounted) {
                        console.warn('Auth timeout....');
                        setLoading(false);
                  }
            }, 3000)

            return () => {
                  isMounted = false;
                  subscription.unsubscribe();
                  clearTimeout(safetyTimeout);

            };
      }, []);



      //                         // Auto-create profile for new users
      //                         console.log('Creating new profile for user:', currUser.id);
      //                         const { data: newProfile, error: createError } = await supabase
      //                               .from('profiles')
      //                               .upsert({
      //                                     id: currUser.id,
      //                                     email: currUser.email,
      //                                     name: currUser.user_metadata?.name || currUser.email.split('@')[0],
      //                                     created_at: new Date().toISOString(),
      //                                     role: 'user'
      //                               })
      //                               .select()
      //                               .single();

      //                         if (createError) {
      //                               console.error('Profile creation error:', createError);
      //                               setError(extractError(createError));
      //                         } else {
      //                               setProfile(newProfile);
      //                               setError(null);
      //                         }
      //                   } else {
      //                         console.log('Profile found:', data);
      //                         setProfile(data);
      //                         setError(null);
      //                   }
      //             } else {
      //             setProfile(null);
      //                         setError(null);
      //       }

      //                   setLoading(false);
      // }
      // );

      //       return () => subscription.unsubscribe();
      // }, [])


      async function signup(email, password, name) {
            setError(null);
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
                  if (data?.user) {
                        const { error: profileError } = await supabase
                              .from('profiles')
                              .insert({
                                    id: data.user.id,
                                    email: email,
                                    name: name,
                                    created_at: new Date(),
                                    role: 'user'
                              });
                        if (profileError && profileError.code !== 'PGRST204') {
                              console.error('Profile creation failed : ', profileError);
                        }
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
                  return { data, error: null }
            } catch (err) {
                  console.log(err);
                  setError(extractError(err));
                  return { data: null, error: err.message };
            }
      }

      async function signout() {
            setError(null);
            try {
                  const { data, error } = await supabase.auth.signOut();
                  if (error) {
                        console.log(error);
                        setError(extractError(error));
                        return { data: null, error: error };
                  }
                  setError(null);
                  return { data: 'Log out successfull.', error: null };
            } catch (err) {
                  console.log(err.message);
                  setError(extractError(err));
                  return { data: null, error: err };
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
