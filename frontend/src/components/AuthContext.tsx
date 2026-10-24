import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, confirmPassword?: string) => Promise<void>;
  logout: () => void;
  // Backwards compatibility aliases:
  signIn: (email: string, password?: string) => Promise<void> | void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session on mount
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('access_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const profile: User = await res.json();
          setUser(profile);
          setToken(storedToken);
        } else {
          // Token is expired or invalid
          localStorage.removeItem('access_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Invalid credentials');
    }

    const data = await res.json();
    localStorage.setItem('access_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  };

  const register = async (email: string, username: string, password: string, confirmPassword?: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        username,
        password,
        confirmPassword: confirmPassword || password,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      const message = Array.isArray(err.message) ? err.message.join(', ') : err.message;
      throw new Error(message || 'Registration failed');
    }

    // Auto-login after successful registration
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        signIn: (email: string, password?: string) => {
          if (password) return login(email, password);
          setUser({ id: 0, email, username: email.split('@')[0] });
        },
        signOut: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
