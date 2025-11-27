import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CurrentUser {
  id: number;
  nickname: string;
}

interface UserContextType {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
