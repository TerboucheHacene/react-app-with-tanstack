# React App with TanStack Query

A small playground for learning [TanStack Query](https://tanstack.com/query/latest) (React Query v5) with React 19, TypeScript, and Vite. Each component in `src/components` demonstrates one core feature, using the free [JSONPlaceholder](https://jsonplaceholder.typicode.com) API as a backend.

## Examples

| Component | Feature | Key APIs |
| --- | --- | --- |
| `QueryExample` | Fetching data on demand | `useQuery`, `enabled`, `refetch` |
| `MutationExample` | Creating a post from a form | `useMutation`, `mutate`, `isPending` |
| `CachingExample` | Cache reuse and invalidation | `staleTime`, `useQueryClient`, `invalidateQueries` |
| `PaginationExample` | Page-by-page navigation | `queryKey: ['posts', page]`, `placeholderData: keepPreviousData` |
| `InfiniteExample` | "Load more" infinite list | `useInfiniteQuery`, `getNextPageParam`, `fetchNextPage` |

A few things worth trying in the browser:

- **Query:** Nothing is fetched until you click **Load Data**, because the query is disabled until then.
- **Caching:** Toggle the post list off and on again. The posts appear instantly from the cache (they stay fresh for 5 minutes) until you click **Invalidate Posts**. `QueryExample` and `CachingExample` share the `['posts']` query key, so they read from the same cache entry.
- **Pagination:** The previous page stays on screen while the next one loads, instead of flashing a loading state.
- **Mutation:** JSONPlaceholder fakes writes, so the new post is returned in the response but isn't actually saved.

## Tech stack

- React 19 and TypeScript
- Vite
- `@tanstack/react-query` v5, with `@tanstack/react-query-devtools` installed
- Axios for HTTP requests
- ESLint

## Getting started

You need Node.js and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── main.tsx          # Creates the QueryClient and wraps the app in QueryClientProvider
├── App.tsx           # Renders all the examples on one page
├── types.ts          # Shared types, such as the Post interface
└── components/
    ├── QueryExample.tsx
    ├── MutationExample.tsx
    ├── CachingExample.tsx
    ├── PaginationExample.tsx
    └── InfiniteExample.tsx
```
