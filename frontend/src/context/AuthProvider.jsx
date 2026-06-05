import { useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api/client';
import { AuthContext } from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `loading` is true while we check an existing token on first load.
  const [loading, setLoading] = useState(true);
  // Controls the global sign-in popup. Any component can open it via
  // `openSignin()` (e.g. a "Book now" button on a protected action).
  const [signinOpen, setSigninOpen] = useState(false);

  const openSignin = () => setSigninOpen(true);
  const closeSignin = () => setSigninOpen(false);

  // On mount: if a token exists, ask the backend who we are.
  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch {
        // Token invalid/expired — clear it.
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Exchange a Google ID token for our app JWT + user.
  // `role` is the role of the tab the user signed in from
  // ("customer" or "venueOwner").
  async function loginWithGoogle(idToken, role) {
    const res = await api.post('/auth/googleLogin', { idToken, role });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    setSigninOpen(false);
    return user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, logout, signinOpen, openSignin, closeSignin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
