/* eslint-disable react-refresh/only-export-components */
import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types"
import { getToken, setToken, removeToken, getUser, setUser as setStoredUser, removeUser } from "../utils/auth"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken()
      const storedUser = getUser()

      if (storedToken && storedUser) {
        setTokenState(storedToken)
        setUser(storedUser)
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (newToken: string, userData: User) => {
    setToken(newToken)
    setStoredUser(userData)
    setTokenState(newToken)
    setUser(userData)
  }

  const logout = () => {
    removeToken()
    removeUser()
    setTokenState(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
