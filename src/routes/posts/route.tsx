import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/posts')({
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
