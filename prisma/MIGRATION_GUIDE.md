# Prisma Schema Migration Guide

This document outlines the completed database model consolidation.

## Migration Status: ✅ FULLY COMPLETED

The database model consolidation has been fully completed. All data has been migrated and legacy tables have been removed.

### What Was Done

1. ✅ **9 legacy models consolidated into 3 models**
2. ✅ **Data migrated using `createMany` for efficiency**
3. ✅ **All 265 guesses, 66 sessions, and 19 schedules preserved**
4. ✅ **Legacy tables dropped from database**
5. ✅ **Routers updated to use consolidated models**
6. ✅ **Build verified - all TypeScript compilation passes**

---

## Consolidation Summary

### Models Consolidated (9 → 3)

| Old Models | New Model | Purpose |
|------------|-----------|---------|
| `DailyAnime`, `DailyBannerGame`, `DailyStudio` | `DailySchedule` | Unified daily game scheduling |
| `WordleGameSession`, `BannerGameSession`, `StudioGameSession` | `GameSession` | Unified game session tracking |
| `WordleGuess`, `BannerGuess`, `StudioGuess` | `GameGuess` | Unified guess storage |

### Benefits

1. **Reduced Schema Complexity**: 9 models → 3 models (67% reduction)
2. **Easier Extensibility**: Adding new game types requires no schema changes
3. **Consistent API**: All games use the same session/guess patterns
4. **Simplified Queries**: No need for game-type-specific table names

---

## New Model Structures

### DailySchedule

```prisma
model DailySchedule {
  id       Int      @id @default(autoincrement())
  date     DateTime
  gameType String   // 'wordle', 'banner', 'studio'
  animeId  Int?     // For wordle/banner games
  studioId Int?     // For studio game
  anime    Anime?   @relation(fields: [animeId], references: [id])
  studio   Studio?  @relation(fields: [studioId], references: [id])

  @@unique([date, gameType])
}
```

### GameSession

```prisma
model GameSession {
  id        String      @id @default(cuid())
  userId    String
  gameType  String      // 'wordle', 'banner', 'studio'
  date      DateTime    @default(now())
  targetId  String      // animeId (as string) for wordle/banner, studioName for studio
  won       Boolean     @default(false)
  failed    Boolean     @default(false)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  guesses   GameGuess[]

  @@unique([userId, date, gameType])
}
```

### GameGuess

```prisma
model GameGuess {
  id        String      @id @default(cuid())
  sessionId String
  guessData Json        // Flexible storage for any guess type
  createdAt DateTime    @default(now())
  session   GameSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
}
```

---

## Guess Data Formats

The `guessData` Json field stores different data depending on game type:

### Wordle Game
```json
{
  "id": 12345,
  "title": "Attack on Titan",
  "releasedYear": 2013,
  "releasedSeason": "Spring",
  "genres": "Action, Drama",
  "studios": "Wit Studio"
}
```

### Banner Game
```json
{
  "animeId": 12345
}
```

### Studio Game
```json
{
  "studioName": "Studio Ghibli"
}
```

---

## Migration Record

The following migration was completed on 2024-12-24:

### Data Migrated

| Source Tables | Target Table | Records |
|---------------|--------------|---------|
| `DailyAnime`, `DailyBannerGame`, `DailyStudio` | `DailySchedule` | 19 |
| `WordleGameSession`, `BannerGameSession`, `StudioGameSession` | `GameSession` | 66 |
| `WordleGuess`, `BannerGuess`, `StudioGuess` | `GameGuess` | 265 |

### Legacy Tables Removed

The following tables have been permanently dropped:
- `WordleGuess`, `BannerGuess`, `StudioGuess`
- `WordleGameSession`, `BannerGameSession`, `StudioGameSession`
- `DailyAnime`, `DailyBannerGame`, `DailyStudio`

---

## API Query Patterns

### Session Queries

```typescript
// Single query pattern with gameType filter
await ctx.db.gameSession.findUnique({
  where: {
    userId_date_gameType: {
      userId,
      date,
      gameType: 'wordle' // or 'banner' or 'studio'
    }
  }
});
```

### Schedule Queries

```typescript
await ctx.db.dailySchedule.findUnique({
  where: {
    date_gameType: {
      date,
      gameType: 'wordle' // or 'banner' or 'studio'
    }
  }
});
```

---

## TypeScript Types

Updated types are available in `src/lib/game-types.ts`:

```typescript
// Consolidated types
export interface GameSession { ... }
export interface GameGuess { ... }
export interface DailySchedule { ... }

// Guess data payload types
export interface WordleGuessDataPayload { ... }
export interface BannerGuessDataPayload { animeId: number }
export interface StudioGuessDataPayload { studioName: string }

// Type guards for guess data
export function isWordleGuessData(data): data is WordleGuessDataPayload;
export function isBannerGuessData(data): data is BannerGuessDataPayload;
export function isStudioGuessData(data): data is StudioGuessDataPayload;
```

---

## Adding New Game Types

With the consolidated model, adding a new game type is simple:

1. **No schema changes required!**

2. Add the new game type constant:
```typescript
export const GAME_TYPES = {
  WORDLE: 'wordle',
  STUDIO: 'studio',
  BANNER: 'banner',
  CHARACTER: 'character',  // New game type
} as const;
```

3. Create router endpoints using the same patterns
4. Define the guess data payload type

---

## Troubleshooting

### "Property does not exist" TypeScript Errors

After pulling schema changes, regenerate the Prisma client:

```bash
pnpm prisma generate
```

Then restart your TypeScript server in your IDE.

### Migration Script Fails

1. Ensure both old and new tables exist (run `pnpm prisma db push` first)
2. Check database connectivity
3. Review the error message for specific table issues

### Data Integrity Issues

Run the verification script to check for problems:

```bash
pnpm tsx scripts/verify-migration.ts
```

---

## Files Modified

### Schema
- `prisma/schema.prisma` - Consolidated model definitions

### Migration Scripts
- `scripts/migrate-consolidate-game-models.ts` - Data migration using `createMany`
- `scripts/verify-migration.ts` - Verification script

### Routers
- `src/server/api/routers/anime.ts` - Updated for consolidated models
- `src/server/api/routers/studio.ts` - Updated for consolidated models

### Types
- `src/lib/game-types.ts` - Updated TypeScript interfaces

---

## Verification Commands

```bash
# Regenerate Prisma client
pnpm prisma generate

# Validate schema
pnpm prisma validate

# Type check
pnpm tsc --noEmit

# Build project
pnpm build
```

---

## Contact

If you encounter issues:
1. Regenerate Prisma client: `pnpm prisma generate`
2. Clear Next.js cache: `rm -rf .next`
3. Restart TypeScript server
4. Run verification: `pnpm tsx scripts/verify-migration.ts`
