import { useState, useEffect, useCallback } from 'react';

export interface Word {
  word: string;
  stressed_word: string;
}

export interface GameState {
  words: Word[];
  currentIndex: number;
  currentWord: Word | null;
  selectedVowelIndex: number | null;
  isCorrect: boolean | null;
  totalAttempts: number;
  correctAnswers: number;
  isLoading: boolean;
  error: string | null;
}

const RUSSIAN_VOWELS = 'аеёиоуыэюя';

/**
 * Extracts vowel indices from a word
 * Returns array of { index: number, char: string, isStressed: boolean }
 */
function getVowelPositions(word: string, stressedWord: string) {
  const vowels: Array<{ index: number; char: string; isStressed: boolean }> = [];
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    if (RUSSIAN_VOWELS.includes(char)) {
      const stressedChar = stressedWord[i];
      const isStressed = stressedChar === stressedChar.toUpperCase() && 
                        RUSSIAN_VOWELS.includes(stressedChar.toLowerCase());
      vowels.push({
        index: i,
        char: word[i],
        isStressed
      });
    }
  }
  
  return vowels;
}

export function useStressGame() {
  const [state, setState] = useState<GameState>({
    words: [],
    currentIndex: 0,
    currentWord: null,
    selectedVowelIndex: null,
    isCorrect: null,
    totalAttempts: 0,
    correctAnswers: 0,
    isLoading: true,
    error: null,
  });

  // Load words from JSON file
  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch('/words.json');
        if (!response.ok) throw new Error('Failed to load words');
        
        const words: Word[] = await response.json();
        
        // Shuffle words for variety
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        
        setState(prev => ({
          ...prev,
          words: shuffled,
          currentWord: shuffled[0],
          isLoading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Unknown error',
          isLoading: false,
        }));
      }
    };

    loadWords();
  }, []);

  // Handle vowel selection
  const selectVowel = useCallback((vowelIndex: number) => {
    if (!state.currentWord) return;

    const vowelPositions = getVowelPositions(
      state.currentWord.word,
      state.currentWord.stressed_word
    );

    if (vowelIndex >= vowelPositions.length) return;

    const selectedVowel = vowelPositions[vowelIndex];
    const correct = selectedVowel.isStressed;

    setState(prev => ({
      ...prev,
      selectedVowelIndex: vowelIndex,
      isCorrect: correct,
      totalAttempts: prev.totalAttempts + 1,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
    }));
  }, [state.currentWord]);

  // Move to next word
  const nextWord = useCallback(() => {
    setState(prev => {
      const nextIndex = (prev.currentIndex + 1) % prev.words.length;
      return {
        ...prev,
        currentIndex: nextIndex,
        currentWord: prev.words[nextIndex],
        selectedVowelIndex: null,
        isCorrect: null,
      };
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: 0,
      currentWord: prev.words[0],
      selectedVowelIndex: null,
      isCorrect: null,
      totalAttempts: 0,
      correctAnswers: 0,
    }));
  }, []);

  // Get vowels for current word
  const getVowels = useCallback(() => {
    if (!state.currentWord) return [];
    return getVowelPositions(state.currentWord.word, state.currentWord.stressed_word);
  }, [state.currentWord]);

  // Get accuracy percentage
  const getAccuracy = useCallback(() => {
    if (state.totalAttempts === 0) return 0;
    return Math.round((state.correctAnswers / state.totalAttempts) * 100);
  }, [state.totalAttempts, state.correctAnswers]);

  return {
    ...state,
    selectVowel,
    nextWord,
    resetGame,
    getVowels,
    getAccuracy,
  };
}
