# TanStack Query: Beginner Learning Path

The core concepts of [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) (React Query v5), explained with the example components in this repo. Each level ends with a practice checklist.

All the examples render on `/` (log in with any name first) and fetch from [JSONPlaceholder](https://jsonplaceholder.typicode.com), a free fake API.

| Level | Topic                                          | Example in this repo                           |
| ----- | ---------------------------------------------- | ---------------------------------------------- |
| 1     | Setup: `QueryClient` and `QueryClientProvider` | `src/main.tsx`                                 |
| 2     | Queries: `useQuery`, keys and status flags     | `QueryExample.tsx`                             |
| 3     | Caching: `staleTime`, `gcTime`, invalidation   | `CachingExample.tsx`                           |
| 4     | Mutations: `useMutation`                       | `MutationExample.tsx`                          |
| 5     | Pagination and infinite lists                  | `PaginationExample.tsx`, `InfiniteExample.tsx` |
| 6     | Query + Router: loading data in routes         | `routes/_auth/posts/`                          |

## What TanStack Query is for

React state (`useState`) is good for **client state**: data your app owns, like an open menu or a form field. Data that comes from a server is different. It's **server state**: someone else owns it, it can change without you knowing, and several components often need the same piece.

Fetching it by hand with `useEffect` + `useState` means writing loading flags, error handling, caching, refetching and deduplication yourself in every component. TanStack Query does all of that for you:

| You write                                                                        | TanStack Query handles                                                                                                                        |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| A **query key** (a name for the data) and a **query function** (how to fetch it) | Loading and error states, caching, deduplicating identical requests, refetching stale data, retrying failures, garbage-collecting unused data |

It doesn't fetch anything itself. The query function can use `fetch`, Axios (as in this repo) or any other client.

## Level 1: Setup

```tsx
// src/main.tsx
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
```

| Piece                     | What it is                                                                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **`QueryClient`**         | Holds the **cache**: every query's data, status and timestamps. Create one per app, outside components, so it isn't recreated on every render |
| **`QueryClientProvider`** | Makes the client available to every component, so `useQuery` and `useQueryClient` work anywhere below it                                      |
| **Devtools**              | `@tanstack/react-query-devtools` shows every query in the cache, its key, status and data                                                     |

**Practice:**

- [x] Create the `QueryClient` and wrap the app in `QueryClientProvider`.
- [ ] Render `<ReactQueryDevtools />` (from `@tanstack/react-query-devtools`) next to the Router devtools in `__root.tsx`. The package is installed but not rendered yet. Then watch the cache change as you use the examples.

## Level 2: Queries (`QueryExample`)

```tsx
const {
  data: posts,
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: ['posts'],
  queryFn: () =>
    fetchPosts('https://jsonplaceholder.typicode.com/posts?_limit=5'),
  enabled: loadData,
})
```

### Query key and query function

- **`queryKey`** is the data's identity in the cache. It's an array, such as `['posts']`, `['post', postId]` or `['posts', page]`. Two components with the same key share the same cache entry and the same request.
- **`queryFn`** is the function that fetches the data. It must return the data or throw an error. Axios throws on HTTP errors by itself.

**The golden rule of query keys:** the key must include **everything the query function depends on**. If the function uses `page`, `postId` or a filter, put it in the key. Otherwise two different requests share one cache entry and overwrite each other's data.

A real example of breaking the rule is in this repo: `QueryExample` uses `['posts']` for 5 posts, while `routes/_auth/posts/index.tsx` uses `['posts']` for 10 posts. Whichever loads first fills the cache, so the other one briefly shows the wrong list. The fix is `['posts', { limit: 10 }]`.

### Status flags

| Flag                 | True when                                                                         |
| -------------------- | --------------------------------------------------------------------------------- |
| `isPending`          | There's no data yet                                                               |
| `isFetching`         | A request is in flight, including background refetches when data is already shown |
| `isLoading`          | `isPending && isFetching`: the first load is happening                            |
| `isError` / `error`  | The last request failed (after the retries)                                       |
| `isSuccess` / `data` | Data is available                                                                 |

`QueryExample` uses `isLoading` rather than `isPending` on purpose. Before you click **Load Data**, the query is disabled: it has no data, so `isPending` is already true, but nothing is fetching, so `isLoading` stays false and "Loading..." doesn't show.

### `enabled` and `refetch`

- **`enabled: false`** stops the query from running automatically. `QueryExample` only fetches after **Load Data** sets `loadData` to `true`. Typical uses: waiting for user input, or for another value such as a user id.
- **`refetch()`** fetches again on demand, even while the query is disabled. That's why **Refetch** loads the posts even before you click **Load Data**.

**Practice:**

- [x] Fetch on demand with `enabled` and `refetch`.
- [ ] Type the response with `axios.get<Post[]>` so `posts` is `Post[]` instead of `any`, and remove the `(post: Post)` annotation in the `map`.
- [ ] Fix the cache-key clash: change the key in `routes/_auth/posts/index.tsx` to `['posts', { limit: 10 }]`.

## Level 3: Caching (`CachingExample`)

```tsx
useQuery({
  queryKey: ['posts'],
  queryFn: () => fetchPosts(),
  staleTime: 1000 * 60 * 5, // 5 minutes
})

queryClient.invalidateQueries({ queryKey: ['posts'] })
```

### Fresh, stale and inactive data

Every cache entry goes through a life cycle, controlled by two timers:

```
fetched ──(staleTime)──> stale ──(no component uses it)──> inactive ──(gcTime)──> removed
```

| Option          | Default   | Meaning                                                                                                                                                      |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`staleTime`** | `0`       | How long data counts as **fresh**. Fresh data is served from the cache with no request. Stale data is still shown instantly, but refetched in the background |
| **`gcTime`**    | 5 minutes | How long **inactive** data (no component uses it) stays in the cache before it's garbage-collected                                                           |

With the default `staleTime: 0`, data is stale as soon as it arrives. It's refetched in the background whenever a component using it mounts, the window regains focus, or the network reconnects. `CachingExample` sets `staleTime` to 5 minutes, so toggling the list off and on shows the cached posts with no new request.

Toggling the list off unmounts `PostList`, which makes the query inactive. Its data stays in the cache for `gcTime` (5 minutes by default), which is why it can come back instantly.

### Invalidation

**`invalidateQueries`** marks matching queries as stale and refetches the ones currently on screen. Use it after the server data changes, typically after a mutation (Level 4).

Matching works by **prefix**: `invalidateQueries({ queryKey: ['posts'] })` also matches `['posts', 2]` from `PaginationExample` and `['posts', { limit: 10 }]` from the posts page. That's a good reason to start related keys with the same word.

### Other defaults worth knowing

| Default                      | Effect                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `retry: 3`                   | A failed query is retried 3 times, with increasing delays, before `isError` becomes true |
| `refetchOnWindowFocus: true` | Switching back to the tab refetches stale queries                                        |
| Deduplication                | Components that mount at the same time with the same key share one request               |

**Practice:**

- [x] Show cached data instantly with `staleTime`, and refresh it with `invalidateQueries`.
- [ ] Open the Network tab, toggle `CachingExample` off and on, and confirm there's no new request for 5 minutes. Then set `staleTime: 0` and watch a request happen on every toggle, while the old data still appears instantly.
- [ ] With devtools open, toggle the list off and watch the query become **inactive**.

## Level 4: Mutations (`MutationExample`)

```tsx
const {
  mutate,
  data: addedPost,
  isPending,
  isError,
} = useMutation({
  mutationFn: addPost,
})

mutate({ id: 1, title, body, userId: 1 })
```

|        | `useQuery`                              | `useMutation`                             |
| ------ | --------------------------------------- | ----------------------------------------- |
| For    | **Reading** data                        | **Changing** data: create, update, delete |
| Runs   | Automatically (unless `enabled: false`) | Only when you call `mutate(variables)`    |
| Cached | Yes, by query key                       | No                                        |

- **`mutate(variables)`** runs `mutationFn(variables)`. Use `mutateAsync` instead if you need to `await` the result.
- **`isPending`, `isError`, `data`** describe the last mutation, just like the query flags.
- **Callbacks:** `onSuccess`, `onError` and `onSettled` run after the mutation, either in the `useMutation` options or as the second argument of `mutate`.

### Updating the lists after a mutation

A mutation doesn't update any query by itself. After a successful change, you tell the cache what's out of date:

```tsx
const queryClient = useQueryClient()

useMutation({
  mutationFn: addPost,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})
```

| Approach                      | How                                                   | Use when                                                                   |
| ----------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| **Invalidate**                | `invalidateQueries({ queryKey: ['posts'] })`          | The simple, safe default: refetch from the server                          |
| **Update the cache directly** | `queryClient.setQueryData(['posts'], (old) => [...])` | The response already contains the new data, and you want to skip a request |

JSONPlaceholder fakes writes: the response contains the new post, but it isn't saved, so a refetch won't show it. With a real backend, invalidation is all you need.

**Practice:**

- [x] Create a post with `useMutation` and show the pending, error and success states.
- [ ] Add `onSuccess` with `invalidateQueries({ queryKey: ['posts'] })`, and watch the lists refetch in the Network tab after adding a post.
- [ ] Use a real `<form onSubmit>` instead of a button `onClick`, so pressing Enter in the title field also submits.

## Level 5: Pagination and infinite lists

### Pagination (`PaginationExample`)

```tsx
useQuery({
  queryKey: ['posts', page],
  queryFn: () => fetchPosts(page),
  placeholderData: keepPreviousData,
  staleTime: 1000 * 60,
})
```

- **`['posts', page]`** follows the golden rule: each page has its own cache entry, so going back to a page you've seen is instant.
- **`placeholderData: keepPreviousData`** keeps showing the previous page while the next one loads, instead of an empty list and a loading message. `isPlaceholderData` is true during that time.
- **`isFetching`** (not `isLoading`) is the right flag here: with placeholder data there's always something on screen, but a request is still in flight.

### Infinite lists (`InfiniteExample`)

```tsx
useInfiniteQuery({
  queryKey: ['infinite-posts'],
  queryFn: ({ pageParam }) => fetchInfinitePosts(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) =>
    lastPage.length > 0 ? pages.length + 1 : undefined,
})
```

| Piece                    | What it does                                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`initialPageParam`**   | The `pageParam` of the first request                                                                                                               |
| **`getNextPageParam`**   | Computes the next `pageParam` from the pages loaded so far. Returning `undefined` means there are no more pages, which sets `hasNextPage` to false |
| **`fetchNextPage()`**    | Loads the next page and appends it                                                                                                                 |
| **`data.pages`**         | An array with one entry per loaded page. `data.pages.flat()` turns it into one list                                                                |
| **`isFetchingNextPage`** | True only while loading the next page, unlike `isFetching`, which is also true for refetches                                                       |

|       | Pagination                          | Infinite list                           |
| ----- | ----------------------------------- | --------------------------------------- |
| Shows | One page at a time                  | All loaded pages, appended              |
| Hook  | `useQuery` with the page in the key | `useInfiniteQuery`                      |
| UI    | Previous and Next buttons           | A "Load more" button or infinite scroll |

**Practice:**

- [x] Paginate with `['posts', page]` and `keepPreviousData`.
- [x] Load more posts with `useInfiniteQuery`.
- [ ] Disable **Next Page** on the last page. JSONPlaceholder has 100 posts, so page 21 is empty.
- [ ] Stop the extra empty request in `InfiniteExample`: return `undefined` when `lastPage.length < 5`, not only when it's `0`.
- [ ] Move the page number into the URL (`?page=2`), which is Level 4 of the Router guide.

## Level 6: Query + Router

So far, every page fetches **after** it renders: the component mounts, `useQuery` starts the request, and the page shows "Loading..." first. TanStack Router can start the request **before** the page renders, in a route `loader`, while still using the Query cache. See [external data loading](https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading).

### 1. Share the key and function with `queryOptions`

```ts
import { queryOptions } from '@tanstack/react-query'

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
  })
```

`queryOptions` keeps the key and the function together, so the loader and the component can't drift apart, and it keeps the data type.

### 2. Pass the `queryClient` through the router context

```tsx
// main.tsx
const router = createRouter({ routeTree, context: { auth, queryClient } })

// __root.tsx
createRootRouteWithContext<{ auth: Auth; queryClient: QueryClient }>()
```

### 3. Load in the route, read in the component

```tsx
export const Route = createFileRoute('/_auth/posts/$postId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(postQueryOptions(params.postId)),
  component: PostPage,
})

function PostPage() {
  const { postId } = Route.useParams()
  const { data: post } = useSuspenseQuery(postQueryOptions(postId))
  return <h2>{post.title}</h2>
}
```

- **`ensureQueryData`** returns the cached data if it exists, or fetches it and waits.
- **`useSuspenseQuery`** reads the same cache entry. Because the loader already filled it, `data` is always defined: no `isLoading` check is needed.
- The query keeps all its Query features: `staleTime`, background refetching, invalidation and devtools.

**Practice:**

- [ ] Add `queryClient` to the router context next to `auth`.
- [ ] Move `/posts/$postId` to a loader with `queryOptions` + `ensureQueryData` + `useSuspenseQuery`, and remove its `isLoading` check.
- [ ] Do the same for the `/posts` list.

## Known issues to fix

- `routes/_auth/posts/index.tsx` and `QueryExample`/`CachingExample` share the `['posts']` key for different data (10 posts vs 5). Use `['posts', { limit: 10 }]` on the posts page.
- `QueryExample`, `CachingExample` and `PaginationExample` use untyped `axios.get`, so their data is `any`. Use `axios.get<Post[]>`, as `InfiniteExample` and the posts routes already do.
- `MutationExample` doesn't invalidate anything after a successful mutation.
