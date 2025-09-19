export interface User {
  id: string
  name: string
  email: string
  plan: "free" | "paid"
  role: "user" | "admin"
  createdAt: string
}

export interface Video {
  _id: string
  originalName: string
  cloudURL: string
  publicId: string
  status: "uploaded" | "processing" | "transcribed" | "failed"
  transcript: string
  summary: string
  userId: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    role: string
  }
}

export interface ApiError {
  error: string
  detailed_error?: string
}
