# Games Implementation - Improvement Plan

## Executive Summary

After reviewing the games implementation (Anime Wordle and Studio Guessr), I've identified several areas for improvement across code quality, performance, user experience, and maintainability. This document outlines a prioritized plan for enhancements.

---

## 🔴 High Priority Improvements

### 1. Code Duplication & Shared Components

**Issue:** Significant duplication between `anime-wordle.tsx` and `anime-studio.tsx`:
- `Countdown` component duplicated
- Similar game over UI patterns
- Similar leaderboard rendering
- Similar game state management

**Solution:**
- Extract `Countdown` to `src/app/_components/games/countdown.tsx`
- Create shared `GameOverBanner` component
- Create shared `Leaderboard` component
- Extract common game logic hooks (`useGameSession`, `useGameState`)

**Files to Create:**
- `src/app/_components/games/countdown.tsx`
- `src/app/_components/games/game-over-banner.tsx`
- `src/app/_components/games/leaderboard.tsx`
- `src/app/_components/games/hooks/use-game-session.ts`
- `src/app/_components/games/hooks/use-game-state.ts`

**Impact:** Reduces code by ~30%, improves maintainability

---

### 2. Type Safety Improvements

**Issue:**
- `guessData: z.record(z.unknown())` is too loose
- Missing proper types for game data structures
- Some `any` types in search components

**Solution:**
- Create strict types for `WordleGuessData` matching `DISPLAY_FIELDS`
- Type the studio game data structure
- Add proper types for search results

**Files to Update:**
- `src/app/_components/games/anime-wordle.tsx`
- `src/app/_components/games/anime-studio.tsx`
- `src/server/api/routers/anime.ts` (input validation)

**Impact:** Prevents runtime errors, improves developer experience

---

### 3. Race Condition & State Management

**Issue:**
- In `studio/page.tsx`, `selectedStudioId` is reset after 100ms, which could cause race conditions
- Multiple state updates in `processGuess` could cause inconsistent state
- No debouncing on rapid selections

**Solution:**
- Remove the `setTimeout` hack in studio page
- Use a ref to track if a guess is being processed
- Add proper loading states during guess processing
- Consider using a reducer for complex game state

**Files to Update:**
- `src/app/games/studio/page.tsx`
- `src/app/_components/games/anime-studio.tsx`
- `src/app/_components/games/anime-wordle.tsx`

**Impact:** Prevents bugs, improves reliability

---

### 4. Error Handling & User Feedback

**Issue:**
- Limited error boundaries
- No feedback when duplicate guesses are attempted
- No retry logic for failed API calls
- Silent failures in some mutations

**Solution:**
- Add error boundaries around game components
- Show toast notifications for duplicate guesses
- Add retry logic for failed mutations
- Better error messages for users

**Files to Update:**
- All game components
- Add `src/app/_components/games/error-boundary.tsx`

**Impact:** Better user experience, easier debugging

---

## 🟡 Medium Priority Improvements

### 5. Performance Optimizations

**Issue:**
- `processGuess` callback has too many dependencies, causing frequent recreations
- Leaderboard query could be optimized
- No memoization of expensive computations
- Search components re-initialize Fuse on every render

**Solution:**
- Split `processGuess` into smaller, focused callbacks
- Memoize expensive computations (hint values, match results)
- Optimize leaderboard query with proper indexes (already have indexes, but could add composite)
- Use `useMemo` more effectively in search components

**Files to Update:**
- `src/app/_components/games/anime-wordle.tsx`
- `src/app/_components/games/anime-studio.tsx`
- `src/app/_components/games/search-component.tsx`
- `src/app/_components/games/studio-search.tsx`

**Impact:** Smoother UI, reduced server load

---

### 6. User Experience Enhancements

**Issue:**
- No share functionality in Studio game (only Wordle has it)
- No keyboard shortcuts
- No loading states during guess processing
- No visual feedback for duplicate guesses
- Countdown only updates every minute (could be more frequent)

**Solution:**
- Add share functionality to Studio game
- Add keyboard shortcuts (Enter to submit, Escape to close modals)
- Add loading spinners during guess processing
- Show visual feedback (shake animation) for duplicate/invalid guesses
- Update countdown every second instead of every minute

**Files to Update:**
- `src/app/_components/games/anime-studio.tsx`
- `src/app/_components/games/anime-wordle.tsx`
- `src/app/_components/games/countdown.tsx` (new)

**Impact:** Better user experience, more engaging games

---

### 7. Accessibility Improvements

**Issue:**
- Missing ARIA labels
- Color-only indicators (should have text labels)
- No keyboard navigation hints
- No focus management

**Solution:**
- Add ARIA labels to all interactive elements
- Add text labels alongside color indicators
- Add keyboard navigation support
- Manage focus for modals and game over states

**Files to Update:**
- All game components
- `src/app/_components/games/field-cell.tsx` (extract from anime-wordle)

**Impact:** Better accessibility, WCAG compliance

---

### 8. Code Organization & Constants

**Issue:**
- Magic numbers scattered throughout (5 guesses, 12 guesses)
- Inconsistent naming (`gameWon` vs `hasWonToday`)
- Game configuration not centralized

**Solution:**
- Create `src/lib/game-config.ts` with all game constants
- Standardize naming conventions
- Extract game rules to configuration

**Files to Create:**
- `src/lib/game-config.ts`

**Files to Update:**
- All game components

**Impact:** Easier to modify game rules, better maintainability

---

## 🟢 Low Priority Improvements

### 9. Search Component Improvements

**Issue:**
- `AnimeSearch` and `StudioSearch` have similar patterns but different implementations
- No error handling for failed JSON loads
- No loading state while fetching data

**Solution:**
- Create a generic `SearchInput` component
- Add error handling and retry logic
- Add loading states

**Files to Create:**
- `src/app/_components/games/search-input.tsx` (generic)

**Files to Update:**
- `src/app/_components/games/search-component.tsx`
- `src/app/_components/games/studio-search.tsx`

**Impact:** Code reuse, better UX

---

### 10. API Efficiency

**Issue:**
- `recordGuess` mutation in studio game is called but result is not used
- Some queries could be combined
- No request deduplication visible

**Solution:**
- Remove unused `recordGuess` call or use its result
- Combine related queries where possible
- Ensure tRPC request deduplication is working

**Files to Update:**
- `src/app/_components/games/anime-studio.tsx`
- `src/server/api/routers/studio.ts`

**Impact:** Reduced API calls, better performance

---

### 11. Testing Infrastructure

**Issue:**
- No visible test files
- Complex game logic not tested

**Solution:**
- Add unit tests for game logic functions
- Add integration tests for game flows
- Test edge cases (duplicate guesses, game over states)

**Files to Create:**
- `src/app/_components/games/__tests__/` directory
- Test files for game logic

**Impact:** Prevents regressions, easier refactoring

---

### 12. Documentation

**Issue:**
- Limited inline documentation
- No JSDoc comments for complex functions
- Game rules not documented

**Solution:**
- Add JSDoc comments to all exported functions
- Document game rules and mechanics
- Add README for games feature

**Files to Update:**
- All game components
- Create `src/app/games/README.md`

**Impact:** Easier onboarding, better maintainability

---

## Implementation Priority

### Phase 1 (Week 1): Critical Fixes
1. Fix race conditions and state management issues
2. Improve error handling
3. Extract shared components (Countdown, Leaderboard)

### Phase 2 (Week 2): Quality Improvements
4. Type safety improvements
5. Performance optimizations
6. Code organization and constants

### Phase 3 (Week 3): UX & Polish
7. User experience enhancements
8. Accessibility improvements
9. Search component refactoring

### Phase 4 (Week 4): Long-term
10. API efficiency improvements
11. Testing infrastructure
12. Documentation

---

## Estimated Impact

- **Code Reduction:** ~30% reduction in duplicated code
- **Performance:** 20-30% improvement in render times
- **User Experience:** Significant improvements in feedback and accessibility
- **Maintainability:** Much easier to add new games or modify existing ones
- **Bug Prevention:** Better type safety and error handling prevent common issues

---

## Notes

- All improvements are backward compatible
- No breaking changes to API contracts
- Improvements can be implemented incrementally
- Each phase can be tested independently

