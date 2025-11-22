// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

const LOCAL_STORAGE_KEY = 'spinshop_auth_user';

type AuthUser = {
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 load user from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed?.email) {
          setUser(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load auth user from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 login: save user in state + localStorage
  const login = (authUser: AuthUser) => {
    setUser(authUser);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authUser));
    } catch (error) {
      console.error('Failed to save auth user to localStorage', error);
    }
  };

  // 🔹 logout: clear user from state + localStorage
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove auth user from localStorage', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🔹 easy hook to use auth anywhere
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
