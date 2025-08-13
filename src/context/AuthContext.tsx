import { createContext, useContext, useMemo, useState } from 'react';

type AuthCtx = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const KEY = 'auth.token.v1';
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(KEY));
  function login(t: string) { localStorage.setItem(KEY, t); setToken(t); }
  function logout() { localStorage.removeItem(KEY); setToken(null); }
  const value = useMemo(() => ({ isAuthenticated: !!token, login, logout }), [token]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('AuthProvider missing');
  return ctx;
}
