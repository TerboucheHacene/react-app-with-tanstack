# React App with TanStack Query and TanStack Router

A small playground for learning [TanStack Query](https://tanstack.com/query/latest) (React Query v5) and [TanStack Router](https://tanstack.com/router/latest) with React 19, TypeScript and Vite. It uses the free [JSONPlaceholder](https://jsonplaceholder.typicode.com) API as a backend.

- **TanStack Query:** each component in `src/components` demonstrates one core feature.
- **TanStack Router:** file-based routes in `src/routes`, with nested and pathless layouts, dynamic params, route groups and a login-protected area.

## Learning guides

| Guide                                                                  | Content                                                                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [TanStack Router learning path](docs/tanstack-router-learning-path.md) | Concepts from web basics to data loading, explained with this repo's code, with practice checklists                                 |
| [TanStack Query learning path](docs/tanstack-query.md)                 | Queries, caching, mutations, pagination and loading data in routes, explained with the example components, with practice checklists |

## Pages

Every page except `/login` and `/register` requires a logged-in user. The login is a fake one for learning: enter any name, and it's stored in `localStorage`.

| URL                     | Page                                                       |
| ----------------------- | ---------------------------------------------------------- |
| `/login`                | Login form. Redirects back to the page you first asked for |
| `/register`             | Placeholder                                                |
| `/`                     | The TanStack Query examples                                |
| `/posts`                | List of posts                                              |
| `/posts/$postId`        | One post, for example `/posts/1`                           |
| `/about`                | About page                                                 |
| `/profile`, `/settings` | Account pages, sharing a layout with left and right panels |

## TanStack Query examples

| Component           | Feature                      | Key APIs                                                         |
| ------------------- | ---------------------------- | ---------------------------------------------------------------- |
| `QueryExample`      | Fetching data on demand      | `useQuery`, `enabled`, `refetch`                                 |
| `MutationExample`   | Creating a post from a form  | `useMutation`, `mutate`, `isPending`                             |
| `CachingExample`    | Cache reuse and invalidation | `staleTime`, `useQueryClient`, `invalidateQueries`               |
| `PaginationExample` | Page-by-page navigation      | `queryKey: ['posts', page]`, `placeholderData: keepPreviousData` |
| `InfiniteExample`   | "Load more" infinite list    | `useInfiniteQuery`, `getNextPageParam`, `fetchNextPage`          |

A few things worth trying in the browser:

- **Query:** Nothing is fetched until you click **Load Data**, because the query is disabled until then.
- **Caching:** Toggle the post list off and on again. The posts appear instantly from the cache (they stay fresh for 5 minutes) until you click **Invalidate Posts**. `QueryExample` and `CachingExample` share the `['posts']` query key, so they read from the same cache entry.
- **Pagination:** The previous page stays on screen while the next one loads, instead of flashing a loading state.
- **Mutation:** JSONPlaceholder fakes writes, so the new post is returned in the response but isn't actually saved.

## TanStack Router features

| Feature                                                | Where                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| Router setup, type registration and router context     | `src/main.tsx`, `src/routes/__root.tsx`                             |
| Nested layout, index route and dynamic param           | `src/routes/_auth/posts/` (`route.tsx`, `index.tsx`, `$postId.tsx`) |
| Pathless layouts (shared UI without changing the URL)  | `src/routes/_auth.tsx`, `src/routes/_auth/_account.tsx`             |
| Route group (organizes files without changing the URL) | `src/routes/(authentication)/`                                      |
| Protected routes with `beforeLoad` and `redirect`      | `src/routes/_auth.tsx`                                              |
| Validated search params (`?redirect=`)                 | `src/routes/(authentication)/login.tsx`                             |
| Active link styling                                    | `.nav-link[data-status='active']` in `src/App.css`                  |

The login check only controls what the user sees. Real protection needs a backend that checks a token or session on every API request.

## Tech stack

- React 19 and TypeScript
- Vite
- `@tanstack/react-query` v5, with `@tanstack/react-query-devtools`
- `@tanstack/react-router`, with `@tanstack/react-router-devtools` and the `@tanstack/router-plugin` Vite plugin for file-based routing
- Axios for HTTP requests
- ESLint and Prettier

## Getting started

You need Node.js and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173) and log in with any name.

## Scripts

| Command                | Description                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server with hot reload. Also regenerates the route tree when route files change |
| `npm run build`        | Type-check and build for production into `dist/`                                              |
| `npm run preview`      | Serve the production build locally                                                            |
| `npm run lint`         | Run ESLint                                                                                    |
| `npm run format`       | Format all files with Prettier                                                                |
| `npm run format:check` | Check formatting without changing files                                                       |

## Project structure

```
docs/
├── tanstack-router-learning-path.md
└── tanstack-query.md
src/
├── main.tsx                  # Creates the QueryClient and the router, and renders RouterProvider
├── auth.ts                   # Fake auth store (localStorage): getUser, login, logout
├── routeTree.gen.ts          # Generated by the router plugin. Don't edit it by hand
├── App.tsx                   # Renders all the Query examples (shown on /)
├── types.ts                  # Shared types, such as the Post interface
├── components/               # One TanStack Query example per file
│   ├── QueryExample.tsx
│   ├── MutationExample.tsx
│   ├── CachingExample.tsx
│   ├── PaginationExample.tsx
│   └── InfiniteExample.tsx
└── routes/                   # One file per route (file-based routing)
    ├── __root.tsx            # Root layout and router context type
    ├── (authentication)/     # Public pages: login.tsx, register.tsx
    ├── _auth.tsx             # Auth guard and navbar for all protected pages
    └── _auth/                # Protected pages
        ├── index.tsx         # /
        ├── about.tsx         # /about
        ├── posts/            # /posts and /posts/$postId
        ├── _account.tsx      # Account layout with panels
        └── _account/         # /profile and /settings
```
