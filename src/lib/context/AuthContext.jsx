import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase-client.jsx';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const userDataCache = useRef(new Map());

      const extractError = (err) => err?.message ?? "An unexpected error occurred!";
      const profileFallback = (currUser) => ({
            id: currUser.id,
            email: currUser.email,
            name: currUser.user_metadata?.name || currUser.email?.split('@')?.[0] || 'User',
            role: 'user'
      });

      const withTimeout = (promise, timeoutMs = 6000, label = "Operation") => {
            return Promise.race([
                  promise,
                  new Promise((_, reject) =>
                        setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)
                  )
            ]);
      };

      const fetchOrCreateProfile = async (currUser) => {
            if (!currUser?.id) return null;
            if (userDataCache.current.has(currUser.id)) {
                  return userDataCache.current.get(currUser.id);
            }

            const { data, error: readError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', currUser.id)
                  .maybeSingle();

            if (readError) throw readError;
            if (data) {
                  userDataCache.current.set(currUser.id, data);
                  return data;
            }

            const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .upsert({
                        id: currUser.id,
                        email: currUser.email,
                        name: currUser.user_metadata?.name || currUser.email?.split('@')?.[0] || 'User',
                        created_at: new Date().toISOString(),
                        role: 'user'
                  })
                  .select()
                  .single();

            if (createError) throw createError;
            userDataCache.current.set(currUser.id, newProfile);
            return newProfile;
      };

      useEffect(() => {
            let isMounted = true;

            const syncSession = async (session) => {
                  setLoading(true);
                  try {
                        const currUser = session?.user ?? null;
                        if (!isMounted) return;
                        setUser(currUser);
                        let hadProfileIssue = false;

                        if (currUser) {
                              try {
                                    const profileData = await withTimeout(
                                          fetchOrCreateProfile(currUser),
                                          6000,
                                          "Profile synchronization"
                                    );
                                    if (isMounted) setProfile(profileData || profileFallback(currUser));
                              } catch (profileErr) {
                                    if (isMounted) {
                                          // Keep user signed in with safe fallback profile even if profile table fetch is slow/failing.
                                          setProfile(profileFallback(currUser));
                                          setError(`Profile sync issue: ${extractError(profileErr)}`);
                                          hadProfileIssue = true;
                                    }
                              }
                        } else if (isMounted) {
                              setProfile(null);
                        }
                        if (isMounted && currUser && !hadProfileIssue) {
                              // Clear previous auth errors after a successful signed-in session sync.
                              setError(null);
                        }
                  } catch (err) {
                        if (isMounted) setError(extractError(err));
                  } finally {
                        if (isMounted) setLoading(false);
                  }
            };

            supabase.auth.getSession().then(({ data }) => syncSession(data.session));

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                  async (_event, session) => {
                        await syncSession(session);
                  });

            return () => {
                  isMounted = false;
                  subscription.unsubscribe();
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
                                    created_at: new Date().toISOString(),
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
            // setError(null);
            try {
                  const { error } = await supabase.auth.signOut();
                  if (error) {
                        console.log(error);
                        setError(extractError(error));
                        return { error: error };
                  }
                  setError(null);
                  return { error: null };
            } catch (err) {
                  console.log(err.message);
                  setError(extractError(err));
                  return { error: err };
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
