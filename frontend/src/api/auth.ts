import type { AuthResponse } from "../types"
import { API_BASE_URL } from "./config"

export const signup = async (userData: {
  name: string
  email: string
  password: string
  plan: "free" | "paid"
}): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Signup failed")
  }

  return data
}

export const login = async (credentials: {
  email: string
  password: string
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Login failed")
  }

  return data
}
