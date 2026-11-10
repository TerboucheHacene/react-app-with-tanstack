import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
  Outlet,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.getUser()) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const router = useRouter()
  const { auth } = Route.useRouteContext()

  const logout = async () => {
    auth.logout()
    await router.invalidate()
  }

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
        <Link to="/profile" className="nav-link">
          Account
        </Link>
        <button type="button" onClick={logout} style={{ marginLeft: 'auto' }}>
          Log out
        </button>
      </nav>
      <Outlet />
    </>
  )
}
