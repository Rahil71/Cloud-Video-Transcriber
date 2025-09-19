import type React from "react"
import { useState, useEffect } from "react"
import type { Video } from "../types"
import { deleteVideo, transcribeVideo, summarizeVideo, downloadTranscript, getMyVideos } from "../api/videos"

interface VideoCardProps {
  video: Video
  onVideoDeleted: (videoId: string) => void
  onVideoUpdated: (video: Video) => void
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoDeleted, onVideoUpdated }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentVideo, setCurrentVideo] = useState(video)
  const [showSummaryButton, setShowSummaryButton] = useState(true)
  const [showAISummary, setShowAISummary] = useState(false)

  useEffect(() => {
    console.log("[v0] VideoCard - Current video state:", {
      id: currentVideo._id,
      status: currentVideo.status,
      hasTranscript: !!currentVideo.transcript,
      hasSummary: !!currentVideo.summary,
      showSummaryButton,
    })
  }, [currentVideo, showSummaryButton])

  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval> | null = null

    const pollVideoStatus = async () => {
      if (currentVideo.status === "processing") {
        try {
          const videos = await getMyVideos()
          const updatedVideo = videos.find((v) => v._id === currentVideo._id)
          if (updatedVideo && updatedVideo.status !== currentVideo.status) {
            console.log("[v0] Video status updated:", {
              oldStatus: currentVideo.status,
              newStatus: updatedVideo.status,
              hasTranscript: !!updatedVideo.transcript,
              hasSummary: !!updatedVideo.summary,
            })
            setCurrentVideo(updatedVideo)
            onVideoUpdated(updatedVideo)
            if (pollInterval) clearInterval(pollInterval)
          }
        } catch (err) {
          console.error("Failed to poll video status:", err)
        }
      }
    }

    if (currentVideo.status === "processing") {
      pollInterval = setInterval(pollVideoStatus, 3000) // Poll every 3 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [currentVideo.status, currentVideo._id, onVideoUpdated])

  useEffect(() => {
    setCurrentVideo(video)
  }, [video])

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return

    setIsLoading(true)
    try {
      await deleteVideo(video._id)
      onVideoDeleted(video._id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete video")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTranscribe = async () => {
    setIsLoading(true)
    setError("")
    try {
      await transcribeVideo(currentVideo._id)
      const updatedVideo: Video = { ...currentVideo, status: "processing" }
      setCurrentVideo(updatedVideo)
      onVideoUpdated(updatedVideo)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start transcription")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSummarize = async () => {
    console.log("[v0] Starting summarization for video:", currentVideo._id)
    setIsLoading(true)
    setError("")
    setShowSummaryButton(false)
    try {
      const response = await summarizeVideo(currentVideo._id)
      console.log("[v0] Summarization response:", response)
      const updatedVideo = { ...currentVideo, summary: response.summary }
      setCurrentVideo(updatedVideo)
      onVideoUpdated(updatedVideo)
      setShowAISummary(true)
    } catch (err) {
      console.error("[v0] Summarization failed:", err)
      setError(err instanceof Error ? err.message : "Failed to generate summary")
      setShowSummaryButton(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadTranscript = async () => {
    try {
      await downloadTranscript(video._id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download transcript")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "transcribed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentVideo.originalName}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentVideo.status)}`}
            >
              {currentVideo.status}
            </span>
            <span className="text-sm text-gray-500">{new Date(currentVideo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <video src={currentVideo.cloudURL} controls className="w-full h-48 object-cover rounded-md bg-gray-100">
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="space-y-3">
        {currentVideo.status === "uploaded" && (
          <button
            onClick={handleTranscribe}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Starting Transcription..." : "Start Transcription"}
          </button>
        )}

        {currentVideo.status === "processing" && (
          <div className="w-full bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md text-center flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            Transcription in progress...
          </div>
        )}

        {currentVideo.status === "transcribed" && (
          <div className="space-y-2">
            <button
              onClick={handleDownloadTranscript}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Download Transcript
            </button>

            {currentVideo.transcript && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript Preview:</h4>
                <div className="bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-600">
                    {currentVideo.transcript.length > 200
                      ? `${currentVideo.transcript.substring(0, 200)}...`
                      : currentVideo.transcript}
                  </p>
                </div>
              </div>
            )}

            {!showAISummary && currentVideo.transcript && (
              <button
                onClick={handleSummarize}
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 mt-3"
              >
                {isLoading ? "Generating AI Summary..." : "Generate AI Summary"}
              </button>
            )}

            {showAISummary && currentVideo.summary && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">AI Summary:</h4>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">{currentVideo.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {currentVideo.status === "failed" && (
          <div className="w-full bg-red-100 text-red-800 py-2 px-4 rounded-md text-center">
            Transcription failed. Please try uploading again.
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCard
