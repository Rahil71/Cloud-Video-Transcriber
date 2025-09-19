import type { Video } from "../types"
import { getAuthHeaders } from "../utils/auth"
import { API_BASE_URL } from "./config"

export const uploadVideo = async (file: File): Promise<{ message: string; url: string }> => {
  const formData = new FormData()
  formData.append("video", file)

  const response = await fetch(`${API_BASE_URL}/api/videos/upload`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Upload failed")
  }

  return data
}

export const getMyVideos = async (): Promise<Video[]> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/my-videos`, {
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

export const deleteVideo = async (videoId: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/delete/${videoId}`, {
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

export const transcribeVideo = async (videoId: string): Promise<{ message: string; transcript?: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/transcribe/${videoId}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Transcription failed")
  }

  return data
}

export const summarizeVideo = async (videoId: string): Promise<{ message: string; summary: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/summarize/${videoId}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Summarization failed")
  }

  return data
}

export const downloadTranscript = async (videoId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/download-transcript/${videoId}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || "Failed to download transcript")
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `transcript-${videoId}.txt`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
