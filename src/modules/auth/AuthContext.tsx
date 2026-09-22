import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { loginRequest, logoutRequest } from './auth.api';
import type { AuthUser } from './auth.types';

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAccess = localStorage.getItem('simrs_access_token');
    const savedUser = localStorage.getItem('simrs_user');
    if (savedAccess && savedUser) {
      setAccessToken(savedAccess);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  async function login(identifier: string, password: string) {
    const data = await loginRequest(identifier, password);
    setAccessToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('simrs_access_token', data.access_token);
    localStorage.setItem('simrs_refresh_token', data.refresh_token);
    localStorage.setItem('simrs_user', JSON.stringify(data.user));
  }

  function logout() {
    const refreshToken = localStorage.getItem('simrs_refresh_token');
    if (refreshToken) {
      logoutRequest(refreshToken);
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('simrs_access_token');
    localStorage.removeItem('simrs_refresh_token');
    localStorage.removeItem('simrs_user');
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  }
  return ctx;
}