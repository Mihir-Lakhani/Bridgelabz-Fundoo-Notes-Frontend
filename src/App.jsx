import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AppShell from './components/AppShell'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import CollectionPage from './pages/CollectionPage'
import LabelsPage from './pages/LabelsPage'
import RemindersPage from './pages/RemindersPage'
import ProfilePage from './pages/ProfilePage'
import AccountHelpPage from './pages/AccountHelpPage'
import { clearToken, getToken } from './services/api'
import './App.css'

function App() {
  const [token, setToken] = useState(getToken)
  const logout = () => { clearToken(); setToken(null) }
  const workspace = (content) => token
    ? <AppShell onLogout={logout}>{content}</AppShell>
    : <Navigate to="/login" replace />

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onLogin={setToken} />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" onLogin={setToken} />} />
      <Route path="/verify" element={<AccountHelpPage mode="verify" />} />
      <Route path="/forgot-password" element={<AccountHelpPage mode="forgot" />} />
      <Route path="/reset-password" element={<AccountHelpPage mode="reset" />} />
      <Route path="/dashboard" element={workspace(<DashboardPage onAuthError={logout} />)} />
      <Route path="/archive" element={workspace(<CollectionPage kind="archive" onAuthError={logout} />)} />
      <Route path="/trash" element={workspace(<CollectionPage kind="trash" onAuthError={logout} />)} />
      <Route path="/labels" element={workspace(<LabelsPage onAuthError={logout} />)} />
      <Route path="/reminders" element={workspace(<RemindersPage onAuthError={logout} />)} />
      <Route path="/profile" element={workspace(<ProfilePage onAuthError={logout} />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
