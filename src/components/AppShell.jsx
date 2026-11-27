import { Link, NavLink } from 'react-router'

const links = [
  ['Dashboard', '/dashboard'],
  ['Archive', '/archive'],
  ['Trash', '/trash'],
  ['Labels', '/labels'],
  ['Profile', '/profile'],
]

export default function AppShell({ children, onLogout }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/dashboard"><span className="small-mark">F</span> Fundoo Notes</Link>
        <nav className="top-links"><button className="text-button" onClick={onLogout}>Log out</button></nav>
      </header>
      <div className="shell-body">
        <aside className="sidebar">
          <p className="sidebar-title">WORKSPACE</p>
          {links.map(([label, path]) => <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
