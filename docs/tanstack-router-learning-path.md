# TanStack Router: Beginner Learning Path

The core concepts to learn as a beginner, based on the official [TanStack Router docs](https://tanstack.com/router/latest/docs/framework/react/overview). Each level builds on the previous one and ends with a practice step in this repo.

## Level 0: Web basics (URLs, routes, pages, slugs)

### The parts of a URL

```
https://app.example.com/w/acme-construction/projects/42?tab=documents&page=2#notes
└──────────┬──────────┘└──────────────┬───────────────┘└─────────┬─────────┘└──┬─┘
       domain                      path                  search params      hash
```

| Part | Example | Used for |
| --- | --- | --- |
| **Path** | `/w/acme-construction/projects/42` | **Which** page and **which** item |
| **Search params** | `?tab=documents&page=2` | **How** to show it: tab, filters, sorting, page number |
| **Hash** | `#notes` | Scrolling to a section of the page |

### Route vs page

- A **route** is a rule: "URLs that look like this show this component". In TanStack Router, each file in `src/routes/` is a route, for example `projects.$projectId.tsx` matches `/projects/<anything>`.
- A **page** is what the user sees on screen: the route's component, rendered inside its layouts, filled with data.

One route can produce many pages. The route `/projects/$projectId` is one file, but `/projects/1`, `/projects/2` and `/projects/42` are three different pages, because each loads a different project.

| | Route | Page |
| --- | --- | --- |
| What it is | A URL pattern + a component | The result on screen |
| Example | `/projects/$projectId` | `/projects/42`, showing "Office building" |
| How many | One file | As many as there are matching URLs |

### Params, ids and slugs

A `$` segment in a route is a **dynamic param**: a placeholder filled from the URL and read with `Route.useParams()`.

```
Route file:  projects.$projectId.tsx
URL:         /projects/42
Params:      { projectId: '42' }
```

The value in that segment is usually one of two things:

- An **id**: the item's database identifier, such as `42` or `8f3a2c91-4b7e-...`.
- A **slug**: a readable, URL-friendly version of the item's name, such as `acme-construction`.

| Name | Slug |
| --- | --- |
| Acme Construction | `acme-construction` |
| Bâtiment Nord 2026 | `batiment-nord-2026` |
| My First Post! | `my-first-post` |

A slug is made by lowercasing the name, replacing spaces with `-`, and removing accents and special characters. It must be unique so the backend can find the item with it, for example with `getBySlug(params.slug)`.

To the router, a slug is just another param: `$slug`, `$workspaceSlug` and `$postId` all work the same way. The name only tells developers what kind of value to expect.

### Can the page change without the URL changing?

Yes. Anything stored in React state (`useState`) changes the screen without touching the URL: opening a modal, switching a tab, typing in a search box, going to the next page of a list.

The catch is that this state is lost on refresh, and a copied link doesn't include it.

| What changes | Stored in | Survives refresh and shareable? | Example |
| --- | --- | --- | --- |
| Which item | Path param | Yes | `/projects/42` → `/projects/43` |
| How it's shown | Search params | Yes | `?tab=documents` → `?tab=rules` |
| Temporary UI | React state | No | An open dropdown, a half-filled form |

**Rule of thumb:** if a user would expect a link or the Back button to bring them back to the same view, put it in the URL (a path param or a search param). Otherwise, keep it in React state.

Your current `PaginationExample` is an example of the third row: the page number lives in `useState`, so a refresh always goes back to page 1. Level 4 moves it into `?page=2`.

**Practice:**

- [x] In the browser console, run `new URL('https://github.com/search?q=tanstack&type=repositories#results')` and find the `pathname`, `search` and `hash`.
- [x] In this app, go to page 3 of the pagination example, then refresh. Notice that you're back on page 1, because the page number lives in React state.
- [x] Open `/about?tab=team#notes`. It's still the About page: search params and the hash don't change which route matches.
- [x] Open `/does-not-exist`. No route matches, so the router shows its "Not Found" fallback.
- [x] Open `src/routeTree.gen.ts` and count the routes. Then answer: how many pages could a route like `/posts/$postId` produce?

## Level 1: The basics

| Concept | What it is | Docs |
| --- | --- | --- |
| **Router and `RouterProvider`** | `createRouter({ routeTree })` creates the router, and `<RouterProvider>` renders it | [Quick start](https://tanstack.com/router/latest/docs/framework/react/quick-start) |
| **Type registration** | `declare module '@tanstack/react-router' { interface Register { router: typeof router } }` makes every link and param type-safe | [Type safety](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety) |
| **Root route** | `__root.tsx` with `createRootRoute`, the layout that wraps every page | [Routing concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts) |
| **File-based routing** | Each file in `src/routes/` is a route, and `routeTree.gen.ts` is generated from them | [File-based routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing) |
| **`createFileRoute`** | How each route file declares its path and component | [Routing concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts) |
| **`<Outlet />`** | Where child routes render inside a parent layout | [Routing concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts) |
| **Index routes** | `index.tsx` matches the parent path exactly, such as `/` | [File naming conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions) |

**Practice:**

- [x] Wire the router in `main.tsx` and get Home and About working.

## Level 2: Navigation

| Concept | What it is | Docs |
| --- | --- | --- |
| **`<Link>`** | Type-safe links. The active link gets `data-status="active"`, and `activeOptions` controls when a link counts as active | [Navigation](https://tanstack.com/router/latest/docs/framework/react/guide/navigation) |
| **`useNavigate()`** | Navigating from code, for example after a form submit | [Navigation](https://tanstack.com/router/latest/docs/framework/react/guide/navigation) |
| **`<Navigate>` and `redirect()`** | Redirecting in a component or inside a route | [Navigation](https://tanstack.com/router/latest/docs/framework/react/guide/navigation) |
| **Not found** | Unknown URLs show the router's default "Not Found" text inside the root layout. `notFoundComponent` replaces it with a custom page when needed | [Not found errors](https://tanstack.com/router/latest/docs/framework/react/guide/not-found-errors) |

**Practice:**

- [x] Style the active link in the navbar.
- [x] Open an unknown URL such as `/postsdzadaz` and see the default "Not Found" fallback, rendered inside the root layout with the navbar. A custom `notFoundComponent` is optional.

## Level 3: Route structure

These file-naming rules come from the [file naming conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions) page.

| Convention | Example | Meaning |
| --- | --- | --- |
| **Nested routes** (`.` or folders) | `posts.tsx` + `posts.index.tsx` | `/posts` is a layout, and child pages render in its `<Outlet />` |
| **Dynamic params** (`$`) | `posts.$postId.tsx` | `/posts/42`, read with `Route.useParams()` |
| **Pathless layouts** (`_` prefix) | `_layout.tsx` | A shared layout that doesn't add anything to the URL |
| **Route groups** (`(folder)`) | `(examples)/query.tsx` | Organizes files without changing the URL |
| **Excluded files** (`-` prefix) | `-components/Card.tsx` | Keeps helper files next to routes without making them routes |

### Layout routes, index routes and `<Outlet />`

In a route folder, `route.tsx` and `index.tsx` play different roles:

```
src/routes/posts/
├── route.tsx      # /posts         layout for the whole section
├── index.tsx      # /posts/        page shown at exactly /posts
└── $postId.tsx    # /posts/$postId page shown at /posts/1, /posts/42, ...
```

| File | Role | Renders on |
| --- | --- | --- |
| `posts/route.tsx` | **Layout**: what every page of the section shares (title, sub-navigation, sidebar) | `/posts` **and** every URL under it |
| `posts/index.tsx` | **Index page**: the section's home | Only on exactly `/posts` |
| `posts/$postId.tsx` | **Child page**: one post | Only on `/posts/<id>` |

`posts/route.tsx` is the folder version of `posts.tsx`: both create the `/posts` layout. The index route's path is written `'/posts/'`, with a trailing slash, which means "the index of `/posts`".

**`<Outlet />`** is a placeholder inside a layout. The router replaces it with the child route that matches the current URL:

```
URL: /posts                         URL: /posts/42
┌─ __root.tsx ───────────────┐      ┌─ __root.tsx ───────────────┐
│ navbar                     │      │ navbar                     │
│ ┌─ posts/route.tsx ──────┐ │      │ ┌─ posts/route.tsx ──────┐ │
│ │ section header         │ │      │ │ section header         │ │
│ │ ┌─ <Outlet /> ───────┐ │ │      │ │ ┌─ <Outlet /> ───────┐ │ │
│ │ │ posts/index.tsx    │ │ │      │ │ │ posts/$postId.tsx  │ │ │
│ │ └────────────────────┘ │ │      │ │ └────────────────────┘ │ │
│ └────────────────────────┘ │      │ └────────────────────────┘ │
└────────────────────────────┘      └────────────────────────────┘
```

- The layouts stay the same, and only the content of the innermost `<Outlet />` changes.
- Each layout level needs its own `<Outlet />`. The one in `__root.tsx` shows `posts/route.tsx`, and the one in `posts/route.tsx` shows `index.tsx` or `$postId.tsx`.
- Without an `<Outlet />`, a layout still renders, but its child pages have nowhere to appear.

**Fixed vs dynamic segments:** `posts/post.tsx` matches only the exact URL `/posts/post`. `posts/$postId.tsx` matches any value in that position, which you read with `Route.useParams()`.

**Practice:**

- [x] Add `/posts` and `/posts/$postId` using JSONPlaceholder.
- [ ] Remove `<Outlet />` from `posts/route.tsx`, open `/posts/1`, and notice that only the layout shows. Then put it back.

## Level 3b: Reading real-world route structures

Large apps combine all the Level 3 conventions, which makes file names look cryptic at first. Four more things help you read them.

### 1. Non-nested routes (`_` suffix)

A trailing `_` on a segment keeps the URL nested but **not** the layout. See [non-nested routes](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts).

| File | URL | Renders inside |
| --- | --- | --- |
| `dashboard.tsx` | `/dashboard` | The parent layout |
| `dashboard.reports.tsx` | `/dashboard/reports` | `dashboard.tsx`'s `<Outlet />` |
| `dashboard_.w.$workspaceSlug.tsx` | `/dashboard/w/acme` | The parent layout, **not** `dashboard.tsx` |

Use it when a URL belongs under a section but the page needs its own full layout.

### 2. Mixing folders and dotted file names

Folders and dots mean the same thing, so a route can be split across both. A route file next to a folder with the same name is the layout, and the folder holds its children:

```
routes/
├── _auth.tsx                  # pathless layout (for example an auth guard)
└── _auth/                     # children of _auth.tsx
    ├── _sidebar.tsx           # pathless layout nested inside _auth
    ├── _sidebar.settings.tsx  # /settings, inside both layouts
    ├── w.$slug.tsx            # /w/$slug, a layout for one workspace
    └── w.$slug/
        └── projects.$projectId.tsx  # /w/$slug/projects/$projectId
```

Group folders like `(general)` or `(sidebar)` can be added anywhere for organization; they never change the URL or the nesting.

**How to read any file name:**

1. Join the folders and the file name with `/` in place of every `.`.
2. Drop `(group)` segments and `_pathless` segments to get the **URL**.
3. Each `_pathless` segment or parent route that has its own file is a **layout** the page renders inside.
4. When in doubt, open `routeTree.gen.ts`: each route lists its `fullPath` (the URL) and its `parentRoute` (the layout it renders in).

### 3. Checking the current route with `useMatchRoute()`

Layouts sometimes need to know which child page is showing, for example to collapse a sidebar on one page. [`useMatchRoute`](https://tanstack.com/router/latest/docs/framework/react/api/router/useMatchRouteHook) returns a function that checks a route against the current location:

```tsx
const matchRoute = useMatchRoute()
const isLibrary = !!matchRoute({ to: '/library' })
```

### 4. Ignoring non-route files in `src/routes`

The `-` prefix excludes single files. To exclude a whole kind of file, such as translations stored next to each route, set [`routeFileIgnorePattern`](https://tanstack.com/router/latest/docs/api/file-based-routing) in the Vite plugin:

```ts
tanstackRouter({
  target: 'react',
  autoCodeSplitting: true,
  routeFileIgnorePattern: '.i18n', // about.i18n.ts is not treated as a route
})
```

**Practice:**

- [ ] Add a `/posts_/new` page that sits under `/posts` in the URL but doesn't render inside the posts layout.
- [ ] Move the example routes into a `(examples)` group folder and check in `routeTree.gen.ts` that their URLs didn't change.

## Level 4: Search params

This is TanStack Router's signature feature. The docs describe it as "`useState` right in the URL".

| Concept | What it is | Docs |
| --- | --- | --- |
| **`validateSearch`** | A schema (Zod, Valibot, or a plain function) that types and validates `?page=2` | [Search params](https://tanstack.com/router/latest/docs/framework/react/guide/search-params) |
| **`Route.useSearch()`** | Reading the typed search params in a component | [Search params](https://tanstack.com/router/latest/docs/framework/react/guide/search-params) |
| **Updating search params** | `<Link search={...}>` or `navigate({ search: (prev) => ... })` | [Search params](https://tanstack.com/router/latest/docs/framework/react/guide/search-params) |

**Practice:**

- [ ] Convert `PaginationExample` from `useState(page)` to `?page=2`, so the page survives a refresh and can be shared as a link.

## Level 5: Data loading (where Router meets Query)

| Concept | What it is | Docs |
| --- | --- | --- |
| **`loader`** | Fetches data before the route renders, with built-in caching | [Data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading) |
| **`Route.useLoaderData()`** | Reading what the loader returned | [Data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading) |
| **`loaderDeps`** | Makes the loader re-run when search params change | [Data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading) |
| **Pending and error UI** | `pendingComponent` and `errorComponent` per route | [Data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading) |
| **Router context** | `createRootRouteWithContext` passes `queryClient` (or the logged-in user) to every route | [Router context](https://tanstack.com/router/latest/docs/framework/react/guide/router-context) |
| **TanStack Query integration** | `queryClient.ensureQueryData` in the loader, then `useSuspenseQuery` in the component | [External data loading](https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading) |
| **`beforeLoad`** | Runs before the loader, for auth checks and redirects | [Authenticated routes](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes) |

**Practice:**

- [ ] Make `/posts/$postId` prefetch its data with the `queryClient`, so the page opens with its data already loaded.
