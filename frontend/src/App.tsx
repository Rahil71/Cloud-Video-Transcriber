"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import AuthPage from "./pages/AuthPage"
import Dashboard from "./pages/Dashboard"
import UploadPage from "./pages/UploadPage"
import AdminPanel from "./pages/AdminPanel"
import InfoPage from "./pages/InfoPage"

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="/upload" element={user ? <UploadPage /> : <Navigate to="/auth" />} />
      <Route path="/info" element={user ? <InfoPage /> : <Navigate to="/auth" />} />
      <Route path="/admin" element={user?.role === "admin" ? <AdminPanel /> : <Navigate to="/dashboard" />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
    </Routes>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
