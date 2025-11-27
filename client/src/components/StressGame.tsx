import { useStressGame } from '@/hooks/useStressGame';
import { useUser } from '@/contexts/UserContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, BarChart3 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function StressGame() {
  const {
    currentWord,
    selectedVowelIndex,
    isCorrect,
    totalAttempts,
    correctAnswers,
    isLoading,
    error,
    words,
    currentIndex,
    selectVowel,
    nextWord,
    resetGame,
    getVowels,
    getAccuracy,
  } = useStressGame();

  const { currentUser } = useUser();
  const [, setLocation] = useLocation();
  const [showStats, setShowStats] = useState(false);
  const MODULE_ID = 'orfoepiya';

  const updateStatsMutation = trpc.stats.updateStats.useMutation();

  // Save stats to database when they change
  useEffect(() => {
    if (currentUser && totalAttempts > 0) {
      const saveStats = async () => {
        try {
          await updateStatsMutation.mutateAsync({
            userId: currentUser.id,
            moduleId: MODULE_ID,
            totalAttempts,
            correctAnswers,
          });
        } catch (error) {
          console.error('Failed to save stats:', error);
        }
      };

      // Save stats every time they update
      const timer = setTimeout(saveStats, 500);
      return () => clearTimeout(timer);
    }
  }, [totalAttempts, correctAnswers, currentUser, updateStatsMutation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка слов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <p className="text-red-500 font-semibold mb-4">Ошибка: {error}</p>
          <Button onClick={resetGame} className="w-full">Попробовать снова</Button>
        </Card>
      </div>
    );
  }

  if (!currentWord) {
    return null;
  }

  const vowels = getVowels();
  const accuracy = getAccuracy();

  const handleBack = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex flex-col">
      {/* Header with stats */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">Орфоэпический Тренажер</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowStats(!showStats)}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Статистика
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetGame}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Сброс
            </Button>
          </div>
        </div>

        {/* Progress and stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Слово</p>
            <p className="text-lg font-semibold">{currentIndex + 1}/{words.length}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Точность</p>
            <p className="text-lg font-semibold">{accuracy}%</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Правильно</p>
            <p className="text-lg font-semibold">{correctAnswers}/{totalAttempts}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Попыток</p>
            <p className="text-lg font-semibold">{totalAttempts}</p>
          </div>
        </div>

        {/* Statistics Modal */}
        {showStats && (
          <div className="mt-4 bg-slate-700 rounded-lg p-4 border border-slate-600">
            <h3 className="text-lg font-semibold mb-3">Подробная статистика</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-1">Всего попыток</p>
                <p className="text-xl font-bold text-blue-400">{totalAttempts}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Правильных ответов</p>
                <p className="text-xl font-bold text-green-400">{correctAnswers}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Неправильных ответов</p>
                <p className="text-xl font-bold text-red-400">{totalAttempts - correctAnswers}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Точность</p>
                <p className="text-xl font-bold text-yellow-400">{accuracy}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col justify-center items-center mb-8">
        <Card className="w-full max-w-md bg-slate-700 border-slate-600 p-8 text-center">
          <p className="text-slate-400 text-sm mb-4">Выберите ударный слог:</p>
          
          {/* Word display with vowel buttons */}
          <div className="mb-8">
            <div className="text-4xl font-bold mb-8 break-words">
              {currentWord.word.split('').map((char, idx) => {
                const vowelIndex = vowels.findIndex(v => v.index === idx);
                const isVowel = vowelIndex !== -1;
                
                return (
                  <span key={idx} className={isVowel ? 'text-blue-400' : ''}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Vowel buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              {vowels.map((vowel, vowelIdx) => {
                const isSelected = selectedVowelIndex === vowelIdx;
                const isCorrectAnswer = vowel.isStressed;

                let buttonClass = 'bg-slate-600 hover:bg-slate-500 border-slate-500';
                
                if (isSelected) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-600 hover:bg-green-600 border-green-500';
                  } else {
                    buttonClass = 'bg-red-600 hover:bg-red-600 border-red-500';
                  }
                } else if (isCorrect === false && isCorrectAnswer) {
                  // Show the correct answer when user is wrong
                  buttonClass = 'bg-green-600 hover:bg-green-600 border-green-500';
                }

                return (
                  <Button
                    key={vowelIdx}
                    onClick={() => selectVowel(vowelIdx)}
                    disabled={isCorrect !== null}
                    className={`w-12 h-12 text-lg font-bold p-0 border-2 ${buttonClass}`}
                    variant="outline"
                  >
                    {vowel.char.toUpperCase()}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          {isCorrect !== null && (
            <div className={`mb-6 p-4 rounded-lg flex items-center justify-center gap-2 ${
              isCorrect 
                ? 'bg-green-900/30 border border-green-600' 
                : 'bg-red-900/30 border border-red-600'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Правильно!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Неправильно</span>
                </>
              )}
            </div>
          )}

          {/* Correct answer hint */}
          {isCorrect === false && (
            <div className="mb-6 p-3 rounded-lg bg-blue-900/30 border border-blue-600">
              <p className="text-blue-400 text-sm">
                <span className="font-semibold">Правильный ответ:</span> {currentWord.stressed_word}
              </p>
            </div>
          )}

          {/* Next button */}
          {isCorrect !== null && (
            <Button
              onClick={nextWord}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            >
              Следующее слово →
            </Button>
          )}
        </Card>
      </div>

      {/* Reference section */}
      <div className="text-xs text-slate-400 text-center">
        <p>Нажимайте на гласные буквы, чтобы выбрать ударный слог</p>
      </div>
    </div>
  );
}
