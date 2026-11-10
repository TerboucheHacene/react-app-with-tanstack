const KEY = 'auth-user'

export type AuthUser = { name: string }

export const auth = {
  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  },
  login: (name: string) => localStorage.setItem(KEY, JSON.stringify({ name })),
  logout: () => localStorage.removeItem(KEY),
}

export type Auth = typeof auth
