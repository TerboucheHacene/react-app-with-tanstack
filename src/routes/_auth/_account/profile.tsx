import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_account/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_account/profile"!</div>
}
