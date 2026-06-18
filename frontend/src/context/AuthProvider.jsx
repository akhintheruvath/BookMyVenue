import { useEffect, useState } from 'react';
import { api, getToken, setToken, setUnauthorizedHandler } from '../api/client';
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

  // When any API call hits a 401, the client has already dropped the token;
  // clear the user here so route guards re-render and redirect to login,
  // wherever the user currently is.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
  }, []);

  // Exchange a Google ID token for our app JWT + user. Google sign-in is for
  // customers only; venue owners use the email/password flow.
  async function loginWithGoogle(idToken) {
    const res = await api.post('/auth/googleLogin', { idToken });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    setSigninOpen(false);
    return user;
  }

  // Adopt a session when the backend returns both the token and the user
  // (e.g. email/password sign-in). Skips the extra /auth/me round-trip since
  // we already have the user. Overwrites any existing session.
  function loginWithSession(token, user) {
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
      value={{ user, loading, loginWithGoogle, loginWithSession, logout, signinOpen, openSignin, closeSignin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
