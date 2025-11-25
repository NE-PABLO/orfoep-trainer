# Орфоэпический Тренажер (Russian Stress Placement Trainer)

A mobile-friendly web application for practicing correct stress placement in Russian words. The application contains 267 words from the Russian orthopedic minimum (орфоэпический минимум) and provides instant feedback on your answers.

## Features

- **267 Russian Words**: Complete list of words with correct stress marks
- **Interactive Learning**: Click on vowels to select the stressed syllable
- **Real-time Feedback**: Immediate visual feedback for correct and incorrect answers
- **Statistics Tracking**: Monitor your accuracy and progress
- **Mobile Optimized**: Fully responsive design for phones and tablets
- **Dark Theme**: Easy on the eyes with a professional dark interface
- **Shuffle System**: Words are randomized for variety in each session

## How to Use

1. Open the application in your web browser
2. Read the Russian word displayed on the screen
3. Click on the vowel (highlighted in blue) that you believe is stressed
4. The application will show you if your answer is correct or incorrect
5. Click "Следующее слово" (Next word) to continue to the next word
6. Track your accuracy percentage and total attempts in the statistics panel

## Technology Stack

- **React 19**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components
- **Vite**: Fast build tool and development server

## Project Structure

```
client/
  src/
    components/
      StressGame.tsx          # Main game component
    hooks/
      useStressGame.ts        # Game logic and state management
      useStressGame.test.ts   # Unit tests
    pages/
      Home.tsx                # Home page
    App.tsx                   # Main app component
  public/
    words.json                # 267 Russian words with stress marks
```

## Installation and Development

### Prerequisites
- Node.js 22+
- pnpm 10+

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm vitest run

# Build for production
pnpm build
```

## Deployment

This project is configured for deployment to GitHub Pages. The build process generates a static site that can be deployed to any static hosting service.

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist/public` directory.

### GitHub Pages Deployment

To deploy to GitHub Pages:

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Build and deployment", select:
   - Source: "GitHub Actions"
4. Create a GitHub Actions workflow file (`.github/workflows/deploy.yml`) to automate deployment

## Word Data Format

The `words.json` file contains 267 Russian words with their correct stress positions marked by uppercase vowels:

```json
[
  {
    "word": "заняла",
    "stressed_word": "занялА"
  },
  {
    "word": "агент",
    "stressed_word": "агЕнт"
  }
]
```

## Testing

The project includes comprehensive unit tests for the core game logic:

- Vowel detection and stress identification
- Accuracy calculation
- Word shuffling
- Word cycling

Run tests with:
```bash
pnpm vitest run
```

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Author

Created as a learning tool for Russian language students to master correct stress placement.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the application.

## Future Enhancements

- Keyboard navigation support
- Word categories and difficulty levels
- Audio pronunciation guide
- Progress tracking and statistics history
- Multiple language support
- Offline mode with service workers

---

**Орфоэпический Тренажер** - Learn Russian stress placement with confidence!
