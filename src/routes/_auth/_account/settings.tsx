import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_account/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_account/settings"!</div>
}
