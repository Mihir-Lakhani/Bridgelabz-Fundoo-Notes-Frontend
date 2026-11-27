import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AppShell from './components/AppShell'
import AuthPage from './pages/AuthPage'
import PlaceholderPage from './pages/PlaceholderPage'
import { clearToken, getToken } from './services/api'
import './App.css'

function App() {
  const [token, setToken] = useState(getToken)
  const logout = () => { clearToken(); setToken(null) }
  const workspace = (title, description) => token
    ? <AppShell onLogout={logout}><PlaceholderPage title={title} description={description} /></AppShell>
    : <Navigate to="/login" replace />

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onLogin={setToken} />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" onLogin={setToken} />} />
      <Route path="/dashboard" element={workspace('Your notes', 'Your dashboard is taking shape.')} />
      <Route path="/archive" element={workspace('Archive', 'Archived notes will appear here.')} />
      <Route path="/trash" element={workspace('Trash', 'Trashed notes will appear here.')} />
      <Route path="/labels" element={workspace('Labels', 'Organize notes using labels.')} />
      <Route path="/profile" element={workspace('Profile', 'Your account details will appear here.')} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
