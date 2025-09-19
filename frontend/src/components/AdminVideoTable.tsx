import type React from "react"
import { useState } from "react"
import type { Video } from "../types"
import { deleteVideoAdmin } from "../api/admin"

interface AdminVideoTableProps {
  videos: Video[]
  onVideoDeleted: (videoId: string) => void
}

const AdminVideoTable: React.FC<AdminVideoTableProps> = ({ videos, onVideoDeleted }) => {
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null)

  const handleDeleteVideo = async (videoId: string, videoName: string) => {
    if (!window.confirm(`Are you sure you want to delete video "${videoName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingVideoId(videoId)
    try {
      await deleteVideoAdmin(videoId)
      onVideoDeleted(videoId)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete video")
    } finally {
      setDeletingVideoId(null)
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
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {videos.map((video) => (
              <tr key={video._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <video src={video.cloudURL} className="h-10 w-10 rounded object-cover" muted />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{video.originalName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}
                  >
                    {video.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(video as any).userId?.name || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(video.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteVideo(video._id, video.originalName)}
                    disabled={deletingVideoId === video._id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {deletingVideoId === video._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminVideoTable
