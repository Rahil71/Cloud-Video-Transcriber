import type React from "react"
import type { Video } from "../types"
import VideoCard from "./VideoCard"

interface VideoGridProps {
  videos: Video[]
  onVideoDeleted: (videoId: string) => void
  onVideoUpdated: (video: Video) => void
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onVideoDeleted, onVideoUpdated }) => {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No videos</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading your first video.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} onVideoDeleted={onVideoDeleted} onVideoUpdated={onVideoUpdated} />
      ))}
    </div>
  )
}

export default VideoGrid
