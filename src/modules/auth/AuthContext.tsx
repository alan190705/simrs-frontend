import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  fetchMeAccess,
  loginRequest,
  logoutRequest,
} from './auth.api';
import type { AuthUser, UserAccessSummary } from './auth.types';

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  access: UserAccessSummary | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccess: () => Promise<void>;
  hasModule: (moduleCode: string) => boolean;
  hasPermission: (moduleCode: string, permissionCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [access, setAccess] = useState<UserAccessSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pulihkan sesi + ambil access
  useEffect(() => {
    const savedAccess = localStorage.getItem('simrs_access_token');
    const savedUser = localStorage.getItem('simrs_user');

    if (savedAccess && savedUser) {
      setAccessToken(savedAccess);
      setUser(JSON.parse(savedUser));

      // Fetch access
      fetchMeAccess()
        .then((data) => setAccess(data))
        .catch(() => {
          // Token mungkin expired — biar interceptor handle
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  async function login(identifier: string, password: string) {
    const data = await loginRequest(identifier, password);
    setAccessToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('simrs_access_token', data.access_token);
    localStorage.setItem('simrs_refresh_token', data.refresh_token);
    localStorage.setItem('simrs_user', JSON.stringify(data.user));

    // Fetch access setelah login
    try {
      const accessData = await fetchMeAccess();
      setAccess(accessData);
    } catch {
      setAccess(null);
    }
  }

  function logout() {
    const refreshToken = localStorage.getItem('simrs_refresh_token');
    if (refreshToken) {
      logoutRequest(refreshToken);
    }
    setAccessToken(null);
    setUser(null);
    setAccess(null);
    localStorage.removeItem('simrs_access_token');
    localStorage.removeItem('simrs_refresh_token');
    localStorage.removeItem('simrs_user');
  }

  const refreshAccess = useCallback(async () => {
    try {
      const data = await fetchMeAccess();
      setAccess(data);
    } catch {
      setAccess(null);
    }
  }, []);

  function hasModule(moduleCode: string): boolean {
    if (!access) return false;
    if (access.isSuperAdmin) return true;
    return access.modules.some((m) => m.moduleCode === moduleCode);
  }

  function hasPermission(moduleCode: string, permissionCode: string): boolean {
    if (!access) return false;
    if (access.isSuperAdmin) return true;
    const mod = access.modules.find((m) => m.moduleCode === moduleCode);
    return mod?.permissions.includes(permissionCode) ?? false;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        access,
        isLoading,
        login,
        logout,
        refreshAccess,
        hasModule,
        hasPermission,
      }}
    >
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