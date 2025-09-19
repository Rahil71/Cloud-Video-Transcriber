/* eslint-disable @typescript-eslint/no-explicit-any */
export const getToken = (): string | null => {
  return localStorage.getItem("token")
}

export const setToken = (token: string): void => {
  localStorage.setItem("token", token)
}

export const removeToken = (): void => {
  localStorage.removeItem("token")
}

export const getUser = (): any | null => {
  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

export const setUser = (user: any): void => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const removeUser = (): void => {
  localStorage.removeItem("user")
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// export const getAuthHeaders = () => {
//   const token = 
//   return token ? { Authorization: `Bearer ${token}` } : {}
// }

export function getAuthHeaders(): HeadersInit {
  const token = getToken()
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    }
  } else {
    return {}
  }
}
