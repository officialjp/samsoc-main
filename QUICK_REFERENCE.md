# Quick Reference - Library Pagination

## 🚀 Quick Start

### Fetching Paginated Data

```typescript
// In a Server Component
const result = await api.manga.getLibraryPaginated({
  limit: 12,                    // Items per page (1-100)
  page: 1,                      // Page number (1-based)
  status: 'available',          // 'all' | 'available' | 'borrowed'
  genre: 'Action',              // Genre name or undefined
  search: 'naruto'              // Search query or undefined
});

// Returns:
// {
//   items: MangaItem[],         // Array of manga (length ≤ limit)
//   totalCount: number,         // Total matching items
//   totalPages: number,         // Total pages available
//   currentPage: number,        // Current page number
//   hasMore: boolean            // Whether more pages exist
// }
```

### URL Structure

```
/library?page=2&status=available&genre=Action&search=naruto
         └─┬─┘ └────────┬───────┘ └────┬────┘ └─────┬─────┘
           │            │               │             │
        Page #      Filter by     Filter by      Search
                    status         genre          query
```

### Filter Values

```typescript
// Status Filter
'all'       // Show all manga
'available' // Show available manga only
'borrowed'  // Show borrowed manga only

// Genre Filter
'all'       // No genre filter
'Action'    // Specific genre name
'Romance'   // Another genre
// ... any genre from ALL_GENRES constant

// Search
''          // No search
'naruto'    // Search in title/author (case-insensitive)
```

## 📝 Common Patterns

### Pattern 1: Basic Pagination

```typescript
// Server Component
async function MangaList({ page }: { page: number }) {
  const data = await api.manga.getLibraryPaginated({
    limit: 12,
    page,
  });
  
  return (
    <div>
      {data.items.map(manga => <MangaCard key={manga.id} manga={manga} />)}
      <Pagination currentPage={page} totalPages={data.totalPages} />
    </div>
  );
}
```

### Pattern 2: With Filters

```typescript
async function FilteredMangaList({ 
  page, 
  status, 
  genre 
}: SearchParams) {
  const data = await api.manga.getLibraryPaginated({
    limit: 12,
    page: page || 1,
    status: status || 'all',
    genre: genre !== 'all' ? genre : undefined,
  });
  
  return <MangaGrid data={data} />;
}
```

### Pattern 3: Client-Side Navigation

```typescript
'use client';

function FilterButton({ genre }: { genre: string }) {
  const router = useRouter();
  
  const handleClick = () => {
    const params = new URLSearchParams();
    params.set('genre', genre);
    router.push(`/library?${params.toString()}`);
  };
  
  return <button onClick={handleClick}>{genre}</button>;
}
```

### Pattern 4: With Suspense

```typescript
export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <MangaList searchParams={searchParams} />
    </Suspense>
  );
}
```

## 🔍 Prisma Query Examples

### Basic Query
```typescript
await ctx.db.manga.findMany({
  take: 12,
  skip: 0,
  orderBy: { id: 'asc' }
});
```

### With Status Filter
```typescript
// Available only
where: {
  OR: [
    { borrowed_by: null },
    { borrowed_by: 'NULL' }
  ]
}

// Borrowed only
where: {
  AND: [
    { borrowed_by: { not: null } },
    { borrowed_by: { not: 'NULL' } }
  ]
}
```

### With Genre Filter
```typescript
where: {
  genres: {
    some: {
      name: 'Action'
    }
  }
}
```

### With Search
```typescript
where: {
  OR: [
    { title: { contains: 'naruto', mode: 'insensitive' } },
    { author: { contains: 'naruto', mode: 'insensitive' } }
  ]
}
```

### Combined Filters
```typescript
where: {
  AND: [
    { borrowed_by: null },
    { genres: { some: { name: 'Action' } } },
    {
      OR: [
        { title: { contains: 'naruto', mode: 'insensitive' } },
        { author: { contains: 'naruto', mode: 'insensitive' } }
      ]
    }
  ]
}
```

## 🎨 Component Usage

### MangaCard
```typescript
<MangaCard 
  manga={{
    id: 1,
    title: "Naruto",
    author: "Masashi Kishimoto",
    volume: 1,
    borrowed_by: null,
    source: "https://...",
    genres: ["Action", "Adventure"]
  }}
/>
```

### Pagination
```typescript
<Pagination 
  currentPage={2}
  totalPages={10}
  onPageChange={(page) => router.push(`/library?page=${page}`)}
/>
```

### LibrarySkeleton
```typescript
<Suspense fallback={<LibrarySkeleton />}>
  <Content />
</Suspense>
```

## 🐛 Debugging

### Check URL Params
```typescript
console.log('searchParams:', searchParams);
// { page: '2', status: 'available', genre: 'Action' }
```

### Check API Response
```typescript
const result = await api.manga.getLibraryPaginated({ ... });
console.log('Total items:', result.totalCount);
console.log('Total pages:', result.totalPages);
console.log('Items returned:', result.items.length);
```

### Check Prisma Query
```typescript
// Add to router
console.log('WHERE clause:', where);
console.log('SKIP:', skip, 'TAKE:', limit);
```

## ⚠️ Common Mistakes

### ❌ Don't Do This
```typescript
// Fetching all data client-side
const allManga = await getAllManga();
const filtered = allManga.filter(...);
const paginated = filtered.slice(...);
```

### ✅ Do This Instead
```typescript
// Let server filter and paginate
const result = await api.manga.getLibraryPaginated({
  limit: 12,
  page: 1,
  status: 'available'
});
```

### ❌ Don't Do This
```typescript
// Using client state for filters
const [genre, setGenre] = useState('all');
```

### ✅ Do This Instead
```typescript
// Use URL params
const genre = searchParams.genre ?? 'all';
router.push(`/library?genre=${newGenre}`);
```

### ❌ Don't Do This
```typescript
// Showing old data while loading
{isLoading ? <Spinner /> : <OldData />}
```

### ✅ Do This Instead
```typescript
// Use Suspense with skeleton
<Suspense fallback={<Skeleton />}>
  <NewData />
</Suspense>
```

## 📊 Performance Tips

1. **Always use LIMIT**: Never fetch unbounded results
2. **Index fields**: Ensure `title` and `author` are indexed
3. **Select only needed fields**: Use `select` in Prisma
4. **Cache count queries**: Consider caching total count
5. **Use cursor pagination**: For large datasets (future enhancement)

## 🔗 Related Files

- **Router**: `src/server/api/routers/manga.ts`
- **Page**: `src/app/library/page.tsx`
- **Client**: `src/app/library/_components/library-search.tsx`
- **Skeleton**: `src/app/library/_components/library-skeleton.tsx`
- **Card**: `src/app/library/_components/manga-card.tsx`
- **Filters**: `src/app/library/_components/library-filters.tsx`

## 📚 Full Documentation

For detailed information, see:
- `PAGINATION_IMPLEMENTATION.md` - Complete technical docs
- `BEFORE_AFTER_COMPARISON.md` - Visual comparison
- `LOADING_STATES.md` - Loading state details
- `SUMMARY_OF_CHANGES.md` - Change summary