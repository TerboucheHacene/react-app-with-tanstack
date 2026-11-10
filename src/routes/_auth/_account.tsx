// src/routes/_account.tsx
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_account')({
  component: AccountLayout,
})

function AccountLayout() {
  return (
    <div className="account-layout">
      <aside className="account-panel">
        <h2 className="account-panel-title">Account</h2>
        <nav className="account-nav">
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          <Link to="/settings" className="nav-link">
            Settings
          </Link>
        </nav>
      </aside>

      <main className="account-content">
        <Outlet />
      </main>

      <aside className="account-panel account-panel-right">
        <h2 className="account-panel-title">Help</h2>
        <p className="hint">This panel is shared by every account page.</p>
      </aside>
    </div>
  )
}
