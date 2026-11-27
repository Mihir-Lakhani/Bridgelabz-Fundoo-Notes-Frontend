import { Navigate, Route, Routes } from 'react-router'
import AppShell from './components/AppShell'
import PlaceholderPage from './pages/PlaceholderPage'
import './App.css'

function WorkspacePage({ title, description }) {
  return <AppShell><PlaceholderPage title={title} description={description} /></AppShell>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PlaceholderPage title="Welcome back" description="Login form is coming next." />} />
      <Route path="/register" element={<PlaceholderPage title="Create an account" description="Registration form is coming next." />} />
      <Route path="/dashboard" element={<WorkspacePage title="Your notes" description="Your dashboard is taking shape." />} />
      <Route path="/archive" element={<WorkspacePage title="Archive" description="Archived notes will appear here." />} />
      <Route path="/trash" element={<WorkspacePage title="Trash" description="Trashed notes will appear here." />} />
      <Route path="/labels" element={<WorkspacePage title="Labels" description="Organize notes using labels." />} />
      <Route path="/profile" element={<WorkspacePage title="Profile" description="Your account details will appear here." />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
