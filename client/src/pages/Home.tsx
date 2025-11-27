import { useUser } from '@/contexts/UserContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import StressGame from '@/components/StressGame';
import Dashboard from './Dashboard';

export default function Home() {
  const { currentUser } = useUser();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      setLocation('/login');
    }
  }, [currentUser, setLocation]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Check if we're on an exam module route
  const isExamRoute = location.startsWith('/exam/');

  if (isExamRoute) {
    // Show the stress game for the orfoepiya module
    return <StressGame />;
  }

  // Show dashboard for root path
  return <Dashboard />;
}
