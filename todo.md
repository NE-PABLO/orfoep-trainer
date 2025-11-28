# Орфоэпический Тренажер - TODO

## Features
- [x] Load word list from JSON file (267 Russian words with stress marks)
- [x] Display random word with vowels as clickable buttons
- [x] Highlight selected vowel when user clicks it
- [x] Check answer against correct stress position
- [x] Show feedback (correct/incorrect) with visual indication
- [x] Track user statistics (total words, correct answers, accuracy percentage)
- [x] Progress indicator showing current position in word list
- [x] "Next word" button to move to the next word
- [x] Mobile-responsive design optimized for phones
- [x] Dark theme for comfortable reading
- [ ] Keyboard support (optional: arrow keys to navigate vowels)
- [x] Reset statistics button
- [ ] Display all words with their correct stresses (reference list)

## UI/UX Design
- [x] Design interaction model for stress marking (tap on vowel approach)
- [x] Create visual feedback for correct/incorrect answers
- [x] Design mobile-first layout
- [x] Choose color scheme and typography (dark theme with blue accents)
- [x] Design statistics dashboard

## Development
- [x] Copy words.json to public folder
- [x] Create main game component (StressGame.tsx)
- [x] Implement word selection logic (useStressGame hook)
- [x] Implement stress checking logic
- [x] Create statistics tracking system
- [x] Add animations and transitions
- [ ] Test on mobile devices

## User Authentication & Database
- [x] Upgrade project to web-db-user (add backend and database)
- [x] Create User model in database (userAccounts and userStats tables)
- [x] Implement user login/registration with nickname
- [x] Create UserSession context for managing logged-in user
- [x] Implement persistent user statistics storage

## Dashboard & Exam Modules
- [x] Create main dashboard with exam modules panel
- [x] Create ExamCard component for each exam module
- [x] Implement module selection and navigation
- [x] Create layout with sidebar/navigation

## Stress Trainer Enhancements
- [x] Add statistics summary modal/panel
- [x] Display correct answer when user answers wrong
- [x] Implement statistics persistence to database
- [x] Add "View Statistics" button
- [ ] Add "Reset Statistics" functionality
- [x] Auto-advance to next word on correct answer (1.5 second delay)
- [x] Save users to database instead of localStorage

## Deployment
- [ ] Create GitHub repository
- [ ] Configure GitHub Pages deployment
- [ ] Push code to GitHub
- [ ] Verify deployment works

## Testing
- [x] Unit tests for vowel detection logic
- [x] Unit tests for accuracy calculation
- [x] Unit tests for word shuffling
- [x] Unit tests for word cycling
- [x] All 12 tests passing
- [x] Test user authentication flow (9 tests passing)
- [x] Test statistics persistence (5 tests for stats endpoints)
- [ ] Test dashboard navigation

## Notes
- Application loads 267 Russian words with stress marks
- Dark theme applied with blue accents for vowel buttons
- Mobile-responsive design ready for deployment
- Full-stack with database for user management and statistics
- Users are now persisted in database (userAccounts table)
- Auto-advance on correct answer with 1.5 second delay
- All 9 unit tests passing
- Ready for production deployment
