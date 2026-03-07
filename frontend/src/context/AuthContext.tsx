import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../data/dummyData';
import { getUserByEmail, addUser } from '../data/dummyData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('helplist_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string): boolean => {
    const foundUser = getUserByEmail(email);
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      localStorage.setItem('helplist_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return false;
    }
    const newUser = addUser({
      name,
      email,
      password,
      role: 'volunteer',
      profilePhoto: '',
    });
    setUser(newUser);
    localStorage.setItem('helplist_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('helplist_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('helplist_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getProfilePhotoUrl(photo: string | undefined): string {
  if (!photo || photo === '') {
    return 'https://png.pngtree.com/png-clipart/20200224/original/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_5247852.jpg';
  }
  return photo;
}
