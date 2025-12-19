import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'isAdmin'> & { password: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@bookhaven.com',
    phone: '+1-555-0100',
    shippingAddress: '123 Admin Street, New York, NY',
    isAdmin: true,
    password: 'admin123',
  },
  {
    id: '2',
    username: 'customer',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1-555-0101',
    shippingAddress: '456 Customer Lane, Boston, MA',
    isAdmin: false,
    password: 'customer123',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast.success(`Welcome back, ${foundUser.firstName}!`);
      return true;
    }
    toast.error('Invalid email or password');
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast.info('You have been logged out');
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'isAdmin'> & { password: string }): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const exists = mockUsers.find((u) => u.email === userData.email);
    if (exists) {
      toast.error('An account with this email already exists');
      return false;
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      ...userData,
      isAdmin: false,
    };
    
    mockUsers.push({ ...newUser, password: userData.password });
    setUser(newUser);
    toast.success('Account created successfully!');
    return true;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin ?? false,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
