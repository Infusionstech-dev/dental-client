import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('session', null);
  const [, setToken] = useLocalStorage('token', null);

  const value = useMemo(() => {
    const start = ({ user: u, token }) => {
      setUser(u);
      setToken(token);
      return u;
    };
    return {
      user,
      isAuthenticated: !!user,
      login: async (creds) => start(await authService.login(creds)),
      // Returns { pending: true } for doctor sign-ups (no session until admin approval).
      register: async (data) => {
        const res = await authService.register(data);
        return res.pending ? res : { user: start(res) };
      },
      logout: () => {
        setUser(null);
        setToken(null);
      },
      updateProfile: async (patch) => {
        const { user: u } = await authService.updateProfile(user.id, patch);
        setUser((prev) => ({ ...prev, ...u }));
      },
    };
  }, [user, setUser, setToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
