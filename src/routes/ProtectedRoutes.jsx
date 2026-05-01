import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/context/AuthContext';
import { useEffect, useState } from 'react';
import { EnhancedAuthBackground } from '../components/ui/FloatingUIElements';
import '../styles/auth-floating-ui.css';

const ProtectedRoutes = ({ children }) => {
      const { user, loading, error } = useAuth();
      const location = useLocation();

      const [timedOut, setTimedOut] = useState(false);

      useEffect(() => {
            // Reset timeout state for every new loading cycle.
            const resetTimer = setTimeout(() => setTimedOut(false), 0);
            if (!loading) {
                  return () => clearTimeout(resetTimer);
            }

            const timer = setTimeout(() => setTimedOut(true), 3000);

            return () => {
                  clearTimeout(resetTimer);
                  clearTimeout(timer);
            };
      }, [loading])

      //SPINNER
      if (loading && !timedOut) {
            return (
                  <EnhancedAuthBackground>

                        <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '100vh',
                              gap: '12px',
                              color: '#f8fafc'
                        }}>
                              <svg
                                    width="32" height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#fb7185"
                                    strokeWidth="2.5"
                                    style={{ animation: 'spin 1s linear infinite' }}
                              >
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#94a3b8' }}>
                                    Authenticating...
                              </p>
                              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                  </EnhancedAuthBackground>
            );
      }
      // Loading timed out — something went wrong in AuthContext
      if (timedOut && loading) {
            console.error('Auth loading timed out — check AuthContext/Supabase connection');
            return (
                  <EnhancedAuthBackground>
                        <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '100vh',
                              gap: '16px',
                              color: '#EEEEEE'
                        }}>
                              <p style={{ fontFamily: 'DM Mono, monospace', color: '#fb7185' }}>
                                    ⚠ Auth timed out
                              </p>
                              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#64748b' }}>
                                    {error || 'Could not verify your session. Check your connection.'}
                              </p>
                              <button
                                    onClick={() => window.location.href = '/login'}
                                    style={{
                                          padding: '8px 20px',
                                          background: 'rgba(251,113,133,0.15)',
                                          border: '1px solid rgba(251,113,133,0.3)',
                                          borderRadius: '8px',
                                          color: '#fb7185',
                                          fontFamily: 'DM Mono, monospace',
                                          fontSize: '12px',
                                          cursor: 'pointer'
                                    }}
                              >
                                    Go to Login
                              </button>
                        </div>
                  </EnhancedAuthBackground>
            );
      }
      // Auth resolved with explicit error from AuthContext.
      if (error && !loading) {
            return (
                  <EnhancedAuthBackground>
                        <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '100vh',
                              gap: '16px',
                              color: '#f8fafc',
                              textAlign: 'center',
                              padding: '0 24px'
                        }}>
                              <p style={{ fontFamily: 'DM Mono, monospace', color: '#fb7185' }}>
                                    ⚠ Authentication Error
                              </p>
                              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#94a3b8', maxWidth: '560px' }}>
                                    {error}
                              </p>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                          onClick={() => window.location.reload()}
                                          style={{
                                                padding: '8px 20px',
                                                background: 'rgba(148,163,184,0.15)',
                                                border: '1px solid rgba(148,163,184,0.3)',
                                                borderRadius: '8px',
                                                color: '#cbd5e1',
                                                fontFamily: 'DM Mono, monospace',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                          }}
                                    >
                                          Retry
                                    </button>
                                    {!user && (
                                          <button
                                                onClick={() => window.location.href = '/login'}
                                                style={{
                                                      padding: '8px 20px',
                                                      background: 'rgba(251,113,133,0.15)',
                                                      border: '1px solid rgba(251,113,133,0.3)',
                                                      borderRadius: '8px',
                                                      color: '#fb7185',
                                                      fontFamily: 'DM Mono, monospace',
                                                      fontSize: '12px',
                                                      cursor: 'pointer'
                                                }}
                                          >
                                                Go to Login
                                          </button>
                                    )}
                              </div>
                        </div>
                  </EnhancedAuthBackground>
            );
      }
      //Auth resolved But No User
      if (!user) {
            return <Navigate to="/login"
                  state={{ from: location, reason: 'unauthorized' }}
                  replace />
      }

      // console.log(user);

      //AUTHORIZED
      return children;
}

export default ProtectedRoutes;
