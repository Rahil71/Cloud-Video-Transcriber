import type { User, Video } from "../types"
import { getAuthHeaders } from "../utils/auth"
import { API_BASE_URL } from "./config"

export const getAllUsers = async (): Promise<{ users: User[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/admin/allUsers`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch users")
  }

  return data
}

export const getAllVideos = async (): Promise<{ videos: Video[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/admin/videos`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch videos")
  }

  return data
}

export const getUserVideos = async (userId: string): Promise<{ videos: Video[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/admin/user-videos/${userId}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch user videos")
  }

  return data
}

export const deleteUserAndVideos = async (userId: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/admin/deleteUserAllInfo/${userId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete user")
  }

  return data
}

export const deleteVideoAdmin = async (videoId: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/admin/delete-video/${videoId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete video")
  }

  return data
}
