# Pagination Implementation Documentation

## Overview

This document describes the server-side pagination implementation for the manga library, replacing the previous client-side approach that fetched all data at once.

## Problem Statement

**Before:** The library page fetched ALL manga items from the database and performed filtering/pagination on the client side. This approach:
- Transferred unnecessary data over the network
- Increased initial page load time
- Scaled poorly as the collection grew
- Wasted database resources fetching unused data

**After:** Implemented server-side pagination with efficient database queries that only fetch the required data based on current filters and page number.

## Architecture

### 1. Backend (tRPC Router)

**File:** `src/server/api/routers/manga.ts`

Added a new `getLibraryPaginated` procedure that:

```typescript
getLibraryPaginated: publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(12),
      page: z.number().min(1).default(1),
      status: z.enum(['all', 'available', 'borrowed']).default('all'),
      genre: z.string().optional(),
      search: z.string().optional(),
    }),
  )
```

**Key Features:**

- **Offset-based pagination**: Uses `skip` and `take` for page number support
- **Server-side filtering**: Builds Prisma `where` clauses based on filters
- **Efficient queries**: Only fetches required fields with `select`
- **Performance**: Single count query + single data query per request
- **Case-insensitive search**: Uses `mode: 'insensitive'` for search

**Prisma Best Practices:**

1. **Selective field fetching**: Uses `select` to only fetch needed fields
2. **Relation optimization**: Only selects `id` and `name` from genres
3. **Proper filtering**: Builds type-safe `where` clauses using `Prisma.MangaWhereInput`
4. **Indexed ordering**: Orders by `id` (primary key) for consistent pagination
5. **Efficient counting**: Separate `count()` query with same `where` clause

### 2. Frontend (Next.js App Router)

**File:** `src/app/library/page.tsx`

**Next.js Best Practices:**

1. **Server Components**: Main page is an async Server Component
2. **Suspense boundaries**: Wrapped content in `<Suspense>` with loading fallback
3. **URL Search Params**: Uses Next.js `searchParams` for filter state
   - Better SEO (crawlable filter states)
   - Shareable URLs
   - Browser back/forward support
   - No client-side state management complexity

4. **Separation of concerns**: 
   - `LibraryPage` - Route handler
   - `LibraryContent` - Data fetching component
   - `LibrarySearch` - Client component for interactivity

**Data Flow:**

```
1. User visits /library?page=2&status=available&genre=Action
2. Next.js immediately shows skeleton while loading
3. Next.js parses searchParams
4. LibraryContent fetches data server-side via tRPC
5. Only 12 items returned (not all items)
6. Client component hydrates with minimal data
7. Skeleton replaced with actual content
```

### 3. Client Component

**File:** `src/app/library/_components/library-search.tsx`

**Key Changes:**

1. **URL-based state**: Uses `router.push()` to update search params
2. **Optimistic UI**: Uses `useTransition()` for pending states
3. **No client-side filtering**: Displays server-provided data directly
4. **Scroll behavior**: Smooth scrolls to results on page change

**Pattern:**

```typescript
const updateSearchParams = (newFilters: FilterState, newPage = 1) => {
  const params = new URLSearchParams();
  
  // Build query string from filters
  if (newPage > 1) params.set('page', newPage.toString());
  if (newFilters.status !== 'all') params.set('status', newFilters.status);
  // ... etc
  
  // Navigate with new params
  startTransition(() => {
    router.push(`/library?${params.toString()}`, { scroll: false });
  });
};
```

## Performance Improvements

### Database Queries

**Before:**
```sql
SELECT * FROM manga 
ORDER BY id ASC;
-- Returns 1000+ rows
```

**After:**
```sql
-- Count query
SELECT COUNT(*) FROM manga 
WHERE borrowed_by IS NULL 
  AND genres.name = 'Action' 
  AND title ILIKE '%naruto%';

-- Data query
SELECT id, title, author, volume, borrowed_by, source 
FROM manga 
WHERE borrowed_by IS NULL 
  AND genres.name = 'Action' 
  AND title ILIKE '%naruto%'
ORDER BY id ASC 
LIMIT 12 OFFSET 0;
-- Returns exactly 12 rows
```

### Network Transfer

- **Before**: ~500KB for 1000 manga items
- **After**: ~15KB for 12 manga items per page
- **Improvement**: ~97% reduction in data transfer

### Initial Page Load

- **Before**: Wait for all data before rendering
- **After**: Instant skeleton render with Suspense streaming
- **User Experience**: Faster perceived performance with proper loading states

## Filter Implementation

### Status Filter
- `all`: No filter applied
- `available`: `borrowed_by IS NULL OR borrowed_by = 'NULL'`
- `borrowed`: `borrowed_by IS NOT NULL AND borrowed_by != 'NULL'`

### Genre Filter
- Uses Prisma relation filtering
- `genres: { some: { name: genre } }`

### Search Filter
- Case-insensitive partial match
- Searches both `title` and `author` fields
- Uses `OR` clause: `title ILIKE '%search%' OR author ILIKE '%search%'`

## URL Structure

```
/library                                  # Default: page 1, all filters
/library?page=2                           # Page 2
/library?status=available                 # Available only
/library?genre=Action                     # Action genre
/library?search=naruto                    # Search
/library?page=3&status=available&genre=Action&search=naruto  # Combined
```

## Migration Guide

### Old Approach (Don't Use)
```typescript
// ❌ Fetches everything
const allManga = await api.manga.getLibraryData();

// ❌ Client-side filtering
const filtered = allManga.filter(manga => ...);

// ❌ Client-side pagination
const paginated = filtered.slice(start, end);
```

### New Approach (Use This)
```typescript
// ✅ Server-side everything
const result = await api.manga.getLibraryPaginated({
  limit: 12,
  page: currentPage,
  status: 'available',
  genre: 'Action',
  search: 'naruto'
});

// ✅ Already filtered and paginated
const { items, totalCount, totalPages } = result;
```

## Testing Checklist

- [ ] Navigate between pages
- [ ] Apply status filter
- [ ] Apply genre filter
- [ ] Search by title
- [ ] Search by author
- [ ] Combine multiple filters
- [ ] Share URL with filters
- [ ] Use browser back/forward buttons
- [ ] Check loading states
- [ ] Verify correct result counts
- [ ] Test with empty results
- [ ] Test with single page results

## Future Enhancements

1. **Cursor-based pagination**: For infinite scroll (if needed)
2. **Caching**: Add React Query or SWR for client-side cache
3. **Prefetching**: Prefetch next page on hover
4. **Sort options**: Add sorting by title, author, volume
5. **Advanced search**: Multiple genres, date ranges
6. **Analytics**: Track popular filters and searches

## Loading States

The implementation includes a proper skeleton loader for better UX:

**File:** `src/app/library/_components/library-skeleton.tsx`

The skeleton:
- Mimics the actual layout (sidebar + main content)
- Shows placeholder cards matching the real manga cards
- Includes animated pulse effects
- Displays during server-side data fetching
- Integrated via Next.js `<Suspense>` boundary

```typescript
<Suspense fallback={<LibrarySkeleton />}>
  <LibraryContent searchParams={searchParams} />
</Suspense>
```

This provides instant visual feedback while data loads, preventing layout shifts and improving perceived performance.

## Code Locations

- Router: `src/server/api/routers/manga.ts` (line ~135)
- Page: `src/app/library/page.tsx`
- Client Component: `src/app/library/_components/library-search.tsx`
- Filters: `src/app/library/_components/library-filters.tsx`
- Card: `src/app/library/_components/manga-card.tsx`
- Skeleton: `src/app/library/_components/library-skeleton.tsx`

## Dependencies

- Prisma (ORM)
- tRPC (API layer)
- Next.js 14+ (App Router)
- Zod (Validation)

No additional packages required!