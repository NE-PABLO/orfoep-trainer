import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

export default function Login() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { setCurrentUser } = useUser();
  
  const loginMutation = trpc.users.loginByNickname.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      toast.error('Пожалуйста, введите ник');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginMutation.mutateAsync({ nickname: nickname.trim() });
      
      if (result.success && result.user && result.user.id && result.user.nickname) {
        // Set user in context
        setCurrentUser({
          id: result.user.id,
          nickname: result.user.nickname,
        });
        toast.success(`Добро пожаловать, ${nickname}!`);
        setLocation('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4">
      <Card className="w-full max-w-md p-8 bg-slate-800 border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Орфоэпический Тренажер</h1>
          <p className="text-slate-300">Платформа для подготовки к экзаменам</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-slate-300 mb-2">
              Введите ваш ник
            </label>
            <Input
              id="nickname"
              type="text"
              placeholder="Ваш ник"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !nickname.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </Button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Если аккаунта нет, он будет создан автоматически
        </p>
      </Card>
    </div>
  );
}
