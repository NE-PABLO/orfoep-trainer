import { describe, it, expect, beforeEach, vi } from 'vitest';

// Test the vowel detection logic separately without needing DOM
describe('Stress Game Logic', () => {
  const RUSSIAN_VOWELS = 'аеёиоуыэюя';

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

  describe('Vowel Detection', () => {
    it('should correctly identify vowels in a word', () => {
      const vowels = getVowelPositions('заняла', 'занялА');
      
      expect(vowels.length).toBe(3);
      expect(vowels[0].char.toLowerCase()).toBe('а');
      expect(vowels[1].char.toLowerCase()).toBe('я');
      expect(vowels[2].char.toLowerCase()).toBe('а');
    });

    it('should correctly identify stressed vowels', () => {
      const vowels = getVowelPositions('заняла', 'занялА');
      
      expect(vowels[0].isStressed).toBe(false);
      expect(vowels[1].isStressed).toBe(false);
      expect(vowels[2].isStressed).toBe(true);
    });

    it('should handle words with multiple vowels', () => {
      const vowels = getVowelPositions('агент', 'агЕнт');
      
      expect(vowels.length).toBe(2);
      expect(vowels[0].char.toLowerCase()).toBe('а');
      expect(vowels[1].char.toLowerCase()).toBe('е');
      expect(vowels[0].isStressed).toBe(false);
      expect(vowels[1].isStressed).toBe(true);
    });

    it('should handle words with yo (ё) stress mark', () => {
      const vowels = getVowelPositions('свекла', 'свЁкла');
      
      expect(vowels.length).toBe(2);
      expect(vowels[0].char.toLowerCase()).toBe('е');
      expect(vowels[0].isStressed).toBe(true);
      expect(vowels[1].char.toLowerCase()).toBe('а');
      expect(vowels[1].isStressed).toBe(false);
    });

    it('should correctly identify stressed position in complex words', () => {
      const vowels = getVowelPositions('баловать', 'баловАть');
      
      expect(vowels.length).toBe(3);
      expect(vowels[0].char.toLowerCase()).toBe('а');
      expect(vowels[0].isStressed).toBe(false);
      expect(vowels[1].char.toLowerCase()).toBe('о');
      expect(vowels[1].isStressed).toBe(false);
      expect(vowels[2].char.toLowerCase()).toBe('а');
      expect(vowels[2].isStressed).toBe(true);
    });
  });

  describe('Accuracy Calculation', () => {
    it('should calculate 0% accuracy with no attempts', () => {
      const totalAttempts = 0;
      const correctAnswers = 0;
      const accuracy = totalAttempts === 0 ? 0 : Math.round((correctAnswers / totalAttempts) * 100);
      
      expect(accuracy).toBe(0);
    });

    it('should calculate 100% accuracy with all correct', () => {
      const totalAttempts = 5;
      const correctAnswers = 5;
      const accuracy = Math.round((correctAnswers / totalAttempts) * 100);
      
      expect(accuracy).toBe(100);
    });

    it('should calculate 50% accuracy with half correct', () => {
      const totalAttempts = 4;
      const correctAnswers = 2;
      const accuracy = Math.round((correctAnswers / totalAttempts) * 100);
      
      expect(accuracy).toBe(50);
    });

    it('should calculate 75% accuracy correctly', () => {
      const totalAttempts = 8;
      const correctAnswers = 6;
      const accuracy = Math.round((correctAnswers / totalAttempts) * 100);
      
      expect(accuracy).toBe(75);
    });
  });

  describe('Word Shuffling', () => {
    it('should shuffle array of words', () => {
      const words = [
        { word: 'заняла', stressed_word: 'занялА' },
        { word: 'агент', stressed_word: 'агЕнт' },
        { word: 'алфавит', stressed_word: 'алфавИт' },
      ];

      const shuffled = [...words].sort(() => Math.random() - 0.5);

      expect(shuffled.length).toBe(words.length);
      expect(shuffled.map(w => w.word).sort()).toEqual(words.map(w => w.word).sort());
    });

    it('should preserve word data during shuffle', () => {
      const words = [
        { word: 'заняла', stressed_word: 'занялА' },
        { word: 'агент', stressed_word: 'агЕнт' },
      ];

      const shuffled = [...words].sort(() => Math.random() - 0.5);

      const zanyala = shuffled.find(w => w.word === 'заняла');
      expect(zanyala?.stressed_word).toBe('занялА');
    });
  });

  describe('Word Cycling', () => {
    it('should cycle to next word index', () => {
      const words = [
        { word: 'заняла', stressed_word: 'занялА' },
        { word: 'агент', stressed_word: 'агЕнт' },
        { word: 'алфавит', stressed_word: 'алфавИт' },
      ];

      let currentIndex = 0;
      currentIndex = (currentIndex + 1) % words.length;
      expect(currentIndex).toBe(1);

      currentIndex = (currentIndex + 1) % words.length;
      expect(currentIndex).toBe(2);

      currentIndex = (currentIndex + 1) % words.length;
      expect(currentIndex).toBe(0);
    });
  });
});
