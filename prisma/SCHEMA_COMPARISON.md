# Schema Comparison: Before vs After

## Visual Overview

### BEFORE: Flat Structure (Anti-Pattern)

```
┌─────────────────────────────────────────────────────────────┐
│                         USER TABLE                          │
├─────────────────────────────────────────────────────────────┤
│ id                                                          │
│ name                                                        │
│ email                                                       │
│ emailVerified                                               │
│ image                                                       │
│ role                                                        │
│                                                             │
│ ┌─────────────── WORDLE STATS ────────────────┐           │
│ │ wordleWins              Int                  │           │
│ │ wordleLastWonAt         DateTime?            │           │
│ │ wordleTotalTries        Int                  │           │
│ │ wordleDailyGuesses      Int                  │           │
│ │ wordleLastGuessAt       DateTime?            │           │
│ └──────────────────────────────────────────────┘           │
│                                                             │
│ ┌─────────────── STUDIO STATS ────────────────┐           │
│ │ studioWins              Int                  │           │
│ │ studioLastWonAt         DateTime?            │           │
│ │ studioTotalTries        Int                  │           │
│ │ studioDailyGuesses      Int                  │           │
│ │ studioLastGuessAt       DateTime?            │           │
│ └──────────────────────────────────────────────┘           │
│                                                             │
│ ┌─────────────── BANNER STATS ────────────────┐           │
│ │ bannerWins              Int                  │           │
│ │ bannerLastWonAt         DateTime?            │           │
│ │ bannerTotalTries        Int                  │           │
│ │ bannerDailyGuesses      Int                  │           │
│ │ bannerLastGuessAt       DateTime?            │           │
│ └──────────────────────────────────────────────┘           │
│                                                             │
│ TOTAL: 21 columns (6 auth + 15 game stats)                │
└─────────────────────────────────────────────────────────────┘
```

**Problems:**
- ❌ 15 duplicated fields (same pattern × 3)
- ❌ Adding Game #4 requires schema migration + 5 new columns
- ❌ Poor separation of concerns
- ❌ Difficult to query "all games"
- ❌ NULL values for users who haven't played certain games

---

### AFTER: Normalized Structure (Best Practice)

```
┌──────────────────────────────┐
│        USER TABLE            │
├──────────────────────────────┤
│ id                           │
│ name                         │
│ email                        │
│ emailVerified                │
│ image                        │
│ role                         │
│                              │
│ TOTAL: 6 columns             │
└──────────────┬───────────────┘
               │
               │ ONE-TO-MANY
               │
               ▼
┌──────────────────────────────────────────────────┐
│              GAMESTATS TABLE                     │
├──────────────────────────────────────────────────┤
│ id                  String (PK)                  │
│ userId              String (FK → User.id)        │
│ gameType            String ("wordle"|"studio"|..)│
│ wins                Int                          │
│ lastWonAt           DateTime?                    │
│ totalTries          Int                          │
│ dailyGuesses        Int                          │
│ lastGuessAt         DateTime?                    │
│ createdAt           DateTime                     │
│ updatedAt           DateTime                     │
│                                                  │
│ UNIQUE(userId, gameType)                        │
│ INDEX(userId), INDEX(gameType), INDEX(wins)     │
└──────────────────────────────────────────────────┘

Example Data:
┌────────┬────────┬──────────┬──────┬──────────┬────────────┐
│ userId │ gameTyp│ wins     │ last │ totalTr  │ dailyGues  │
├────────┼────────┼──────────┼──────┼──────────┼────────────┤
│ user1  │ wordle │ 15       │ 2024 │ 45       │ 3          │
│ user1  │ studio │ 8        │ 2024 │ 24       │ 2          │
│ user1  │ banner │ 12       │ 2024 │ 36       │ 3          │
│ user2  │ wordle │ 22       │ 2024 │ 55       │ 2          │
│ user2  │ studio │ 3        │ 2024 │ 15       │ 5          │
└────────┴────────┴──────────┴──────┴──────────┴────────────┘
```

**Benefits:**
- ✅ Normalized (3NF)
- ✅ Add Game #4: Just insert new rows (no schema change!)
- ✅ Clean separation of concerns
- ✅ Easy to query across all games
- ✅ No NULL columns
- ✅ Better indexing strategy

---

## Data Example Comparison

### Example: User "Alice" with game stats

#### BEFORE (Wide Table)
```sql
SELECT * FROM User WHERE name = 'Alice';

┌────────┬───────┬─────────────┬────────────┬─────────────┬────────────┬─────────────┬────────────┬─────────────┬────────────┬─────────────┬────────────┬─────────────┬────────────┬─────────────┬────────────┐
│   id   │ name  │wordleWins   │wordleLast  │wordleTotal  │studioWins  │studioLast   │studioTotal │bannerWins   │bannerLast  │bannerTotal  │wordleDaily │studioDaily │bannerDaily │wordleLast   │studioLast  │
│        │       │             │WonAt       │Tries        │            │WonAt        │Tries       │             │WonAt       │Tries        │Guesses     │Guesses     │Guesses     │GuessAt      │GuessAt     │
├────────┼───────┼─────────────┼────────────┼─────────────┼────────────┼─────────────┼────────────┼─────────────┼────────────┼─────────────┼────────────┼─────────────┼────────────┼─────────────┼────────────┤
│ usr_1  │ Alice │ 15          │ 2024-01-15 │ 45          │ 8          │ 2024-01-14  │ 24         │ 12          │ 2024-01-15 │ 36          │ 3          │ 2          │ 3          │ 2024-01-15  │ 2024-01-14 │
└────────┴───────┴─────────────┴────────────┴─────────────┴────────────┴─────────────┴────────────┴─────────────┴────────────┴─────────────┴────────────┴─────────────┴────────────┴─────────────┴────────────┘
```
*One row with 21+ columns*

#### AFTER (Normalized)
```sql
-- User Table
SELECT * FROM User WHERE name = 'Alice';

┌────────┬───────┬──────────────┬───────────────┬───────┬──────┐
│   id   │ name  │    email     │ emailVerified │ image │ role │
├────────┼───────┼──────────────┼───────────────┼───────┼──────┤
│ usr_1  │ Alice │ alice@...    │ 2024-01-01    │ ...   │ user │
└────────┴───────┴──────────────┴───────────────┴───────┴──────┘

-- GameStats Table
SELECT * FROM GameStats WHERE userId = 'usr_1';

┌──────────┬────────┬──────────┬──────┬──────────────┬────────────┬──────────────┬──────────────┐
│    id    │ userId │ gameType │ wins │  lastWonAt   │ totalTries │ dailyGuesses │ lastGuessAt  │
├──────────┼────────┼──────────┼──────┼──────────────┼────────────┼──────────────┼──────────────┤
│ gs_123   │ usr_1  │ wordle   │  15  │ 2024-01-15   │     45     │      3       │ 2024-01-15   │
│ gs_124   │ usr_1  │ studio   │   8  │ 2024-01-14   │     24     │      2       │ 2024-01-14   │
│ gs_125   │ usr_1  │ banner   │  12  │ 2024-01-15   │     36     │      3       │ 2024-01-15   │
└──────────┴────────┴──────────┴──────┴──────────────┴────────────┴──────────────┴──────────────┘
```
*User: 1 row with 6 columns, GameStats: 3 rows with 10 columns each*

---

## Query Comparison

### Query 1: Get Wordle Leaderboard

#### BEFORE
```typescript
const leaderboard = await db.user.findMany({
  where: { wordleWins: { gt: 0 } },
  orderBy: [
    { wordleWins: 'desc' },
    { wordleTotalTries: 'asc' }
  ],
  take: 10,
  select: {
    id: true,
    name: true,
    wordleWins: true,
    wordleTotalTries: true,
  },
});
```

#### AFTER
```typescript
const leaderboard = await getLeaderboard(db, 'wordle', 10);
// OR manually:
const leaderboard = await db.gameStats.findMany({
  where: { 
    gameType: 'wordle',
    wins: { gt: 0 }
  },
  orderBy: [
    { wins: 'desc' },
    { totalTries: 'asc' }
  ],
  take: 10,
  include: {
    user: {
      select: { id: true, name: true, image: true }
    }
  },
});
```

---

### Query 2: Get All Stats for a User

#### BEFORE
```typescript
const user = await db.user.findUnique({
  where: { id: userId },
  select: {
    // Wordle
    wordleWins: true,
    wordleTotalTries: true,
    wordleLastWonAt: true,
    // Studio
    studioWins: true,
    studioTotalTries: true,
    studioLastWonAt: true,
    // Banner
    bannerWins: true,
    bannerTotalTries: true,
    bannerLastWonAt: true,
  },
});

const stats = {
  wordle: {
    wins: user.wordleWins,
    tries: user.wordleTotalTries,
    lastWon: user.wordleLastWonAt,
  },
  studio: {
    wins: user.studioWins,
    tries: user.studioTotalTries,
    lastWon: user.studioLastWonAt,
  },
  banner: {
    wins: user.bannerWins,
    tries: user.bannerTotalTries,
    lastWon: user.bannerLastWonAt,
  },
};
```

#### AFTER
```typescript
const gameStats = await db.gameStats.findMany({
  where: { userId },
});

// Already in perfect format!
const stats = gameStats.reduce((acc, stat) => {
  acc[stat.gameType] = {
    wins: stat.wins,
    tries: stat.totalTries,
    lastWon: stat.lastWonAt,
  };
  return acc;
}, {});
```

---

### Query 3: Record a Win

#### BEFORE
```typescript
await db.user.update({
  where: { id: userId },
  data: {
    wordleWins: { increment: 1 },
    wordleTotalTries: { increment: tries },
    wordleLastWonAt: new Date(),
    wordleDailyGuesses: tries,
    wordleLastGuessAt: new Date(),
  },
});
```

#### AFTER
```typescript
await incrementWin(db, userId, 'wordle', tries);
// OR manually:
await db.gameStats.upsert({
  where: {
    userId_gameType: { userId, gameType: 'wordle' }
  },
  create: {
    userId,
    gameType: 'wordle',
    wins: 1,
    totalTries: tries,
    lastWonAt: new Date(),
    dailyGuesses: tries,
    lastGuessAt: new Date(),
  },
  update: {
    wins: { increment: 1 },
    totalTries: { increment: tries },
    lastWonAt: new Date(),
    dailyGuesses: tries,
    lastGuessAt: new Date(),
  },
});
```

---

## Extensibility Comparison

### Adding a New Game: "Character Quiz"

#### BEFORE (Schema Migration Required)
```prisma
model User {
  // ... existing fields ...
  
  // NEW: Requires schema change + migration
  characterWins         Int       @default(0)
  characterLastWonAt    DateTime?
  characterTotalTries   Int       @default(0)
  characterDailyGuesses Int       @default(0)
  characterLastGuessAt  DateTime?
}
```

```bash
# Requires:
1. Edit schema.prisma
2. npx prisma migrate dev --name add_character_game
3. Update all TypeScript types
4. Update all queries
5. Handle NULL values for existing users
```

#### AFTER (No Schema Change!)
```typescript
// Just add to the enum
export const GAME_TYPES = {
  WORDLE: 'wordle',
  STUDIO: 'studio',
  BANNER: 'banner',
  CHARACTER: 'character', // NEW!
} as const;

// All existing queries/mutations work immediately!
await incrementWin(db, userId, 'character', tries);
const leaderboard = await getLeaderboard(db, 'character', 10);
```

```bash
# Requires:
1. Add to GAME_TYPES enum
2. That's it! ✨
```

---

## Storage Efficiency

### User with All Game Stats

#### BEFORE
```
User Table Row Size (approximate):
- Auth fields: 200 bytes
- Wordle stats: 5 fields × ~12 bytes = 60 bytes
- Studio stats: 5 fields × ~12 bytes = 60 bytes
- Banner stats: 5 fields × ~12 bytes = 60 bytes
Total: ~380 bytes per user (even if they never play!)
```

#### AFTER
```
User Table Row Size:
- Auth fields: 200 bytes
Total: ~200 bytes per user

GameStats Table (per game type):
- Stats: 8 fields × ~12 bytes = ~96 bytes per game
Total: ~96 bytes × games played (only what's used!)
```

**For 1,000 users who play 2 games on average:**
- BEFORE: 1,000 × 380 = 380 KB (with empty columns)
- AFTER: (1,000 × 200) + (2,000 × 96) = 200 KB + 192 KB = 392 KB

**The real win is maintainability, not storage!**

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| User columns | 21 | 6 |
| Game stat fields | 15 on User | 8 in GameStats |
| Add new game | Schema migration | Insert rows |
| Query complexity | Manual field selection | Relation-based |
| Type safety | Manual typing | Prisma-generated |
| Null handling | Many nullable fields | Only actual data |
| Normalization | 1NF (flat) | 3NF (normalized) |
| Maintainability | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Scalability | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

**Conclusion:** The normalized structure follows database best practices, improves code maintainability, and makes the system much easier to extend. The migration is straightforward and well worth the investment.