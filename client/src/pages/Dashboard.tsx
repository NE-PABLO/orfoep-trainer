import { useUser } from '@/contexts/UserContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, LogOut } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useEffect, useState } from 'react';

interface ModuleStats {
  moduleId: string;
  totalAttempts: number;
  correctAnswers: number;
}

const EXAM_MODULES = [
  {
    id: 'orfoepiya',
    title: 'Орфоэпия',
    description: 'Правильное ударение в русских словах',
    icon: '🔊',
    color: 'from-blue-600 to-blue-800',
  },
];

export default function Dashboard() {
  const { currentUser, logout } = useUser();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<Record<string, ModuleStats>>({});
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const getAllStatsQuery = trpc.stats.getAllStats.useQuery(
    { userId: currentUser?.id || 0 },
    { enabled: !!currentUser?.id }
  );

  useEffect(() => {
    if (getAllStatsQuery.data) {
      const statsMap: Record<string, ModuleStats> = {};
      getAllStatsQuery.data.forEach((stat) => {
        statsMap[stat.moduleId] = {
          moduleId: stat.moduleId,
          totalAttempts: stat.totalAttempts,
          correctAnswers: stat.correctAnswers,
        };
      });
      setStats(statsMap);
      setIsLoadingStats(false);
    }
  }, [getAllStatsQuery.data]);

  if (!currentUser) {
    setLocation('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const handleModuleClick = (moduleId: string) => {
    setLocation(`/exam/${moduleId}`);
  };

  const getAccuracy = (moduleId: string) => {
    const stat = stats[moduleId];
    if (!stat || stat.totalAttempts === 0) return 0;
    return Math.round((stat.correctAnswers / stat.totalAttempts) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Орфоэпический Тренажер</h1>
            <p className="text-slate-400 text-sm">Добро пожаловать, <span className="text-blue-400 font-semibold">{currentUser.nickname}</span></p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut size={18} />
            Выход
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Модули экзаменов</h2>
          <p className="text-slate-400">Выберите модуль для начала подготовки</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAM_MODULES.map((module) => {
            const accuracy = getAccuracy(module.id);
            const stat = stats[module.id];

            return (
              <Card
                key={module.id}
                className={`bg-gradient-to-br ${module.color} border-0 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
                onClick={() => handleModuleClick(module.id)}
              >
                <div className="p-6 text-white h-full flex flex-col">
                  <div className="text-4xl mb-4">{module.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                  <p className="text-blue-100 text-sm mb-6 flex-grow">{module.description}</p>

                  {stat ? (
                    <div className="space-y-2 border-t border-blue-400 border-opacity-30 pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Попыток:</span>
                        <span className="font-semibold">{stat.totalAttempts}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Правильно:</span>
                        <span className="font-semibold">{stat.correctAnswers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Точность:</span>
                        <span className="font-semibold">{accuracy}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-blue-400 border-opacity-30 pt-4">
                      <p className="text-sm text-blue-100">Нет статистики</p>
                    </div>
                  )}

                  <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                    <BookOpen size={18} className="mr-2" />
                    Начать
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {EXAM_MODULES.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Модули еще не добавлены</p>
          </div>
        )}
      </main>
    </div>
  );
}
