import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/(authentication)/login')({
  validateSearch: (search) => ({
    redirect:
      typeof search.redirect === 'string' && search.redirect.startsWith('/')
        ? search.redirect
        : '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.getUser()) throw redirect({ href: search.redirect })
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { auth } = Route.useRouteContext()
  const { redirect: redirectTo } = Route.useSearch()
  const [name, setName] = useState('')

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    auth.login(name)
    await router.invalidate()
    router.history.push(redirectTo)
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button type="submit">Log in</button>
    </form>
  )
}
