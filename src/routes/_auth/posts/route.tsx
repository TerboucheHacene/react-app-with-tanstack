import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/posts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>Posts Route</div>
      <Outlet />
    </div>
  )
}
