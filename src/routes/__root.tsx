import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-link" activeOptions={{ exact: true }}>
          Home
        </Link>
        <Link to="/posts" className="nav-link">
          Posts
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}
