import type React from "react"
import { useState, useEffect } from "react"
import type { User, Video } from "../types"
import { getAllUsers, getAllVideos, getUserVideos } from "../api/admin"
import UserTable from "../components/UserTable"
import AdminVideoTable from "../components/AdminVideoTable"
import StatsCard from "../components/StatsCard"
import Layout from "../components/Layout"
import ProtectedRoute from "../components/ProtectedRoute"

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "videos">("overview")
  const [users, setUsers] = useState<User[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedUserVideos, setSelectedUserVideos] = useState<Video[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [usersResponse, videosResponse] = await Promise.all([getAllUsers(), getAllVideos()])
      setUsers(usersResponse.users)
      setVideos(videosResponse.videos)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserDeleted = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    setVideos(videos.filter((video) => video.userId !== userId))
  }

  const handleVideoDeleted = (videoId: string) => {
    setVideos(videos.filter((video) => video._id !== videoId))
    setSelectedUserVideos(selectedUserVideos.filter((video) => video._id !== videoId))
  }

  const handleViewUserVideos = async (userId: string) => {
    try {
      const response = await getUserVideos(userId)
      setSelectedUserVideos(response.videos)
      setSelectedUserId(userId)
      setActiveTab("videos")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user videos")
    }
  }

  const stats = {
    totalUsers: users.length,
    totalVideos: videos.length,
    transcribedVideos: videos.filter((v) => v.status === "transcribed").length,
    processingVideos: videos.filter((v) => v.status === "processing").length,
  }

  if (isLoading) {
    return (
      <ProtectedRoute adminOnly>
        <Layout>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute adminOnly>
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="mt-2 text-sm text-gray-700">Manage users, videos, and system overview</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab("videos")
                  setSelectedUserId(null)
                  setSelectedUserVideos([])
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "videos"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Videos ({videos.length})
              </button>
            </nav>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Users"
                  value={stats.totalUsers}
                  color="blue"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  }
                />
                <StatsCard
                  title="Total Videos"
                  value={stats.totalVideos}
                  color="green"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  }
                />
                <StatsCard
                  title="Transcribed"
                  value={stats.transcribedVideos}
                  color="purple"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
                <StatsCard
                  title="Processing"
                  value={stats.processingVideos}
                  color="yellow"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {videos.slice(0, 5).map((video) => (
                    <div key={video._id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{video.originalName}</p>
                        <p className="text-xs text-gray-500">{new Date(video.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          video.status === "transcribed"
                            ? "bg-green-100 text-green-800"
                            : video.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {video.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">All Users</h2>
                <p className="text-sm text-gray-500">Manage user accounts and their data</p>
              </div>
              <UserTable users={users} onUserDeleted={handleUserDeleted} onViewUserVideos={handleViewUserVideos} />
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">{selectedUserId ? "User Videos" : "All Videos"}</h2>
                <p className="text-sm text-gray-500">
                  {selectedUserId ? "Videos uploaded by selected user" : "All videos in the system"}
                </p>
                {selectedUserId && (
                  <button
                    onClick={() => {
                      setSelectedUserId(null)
                      setSelectedUserVideos([])
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ← Back to all videos
                  </button>
                )}
              </div>
              <AdminVideoTable
                videos={selectedUserId ? selectedUserVideos : videos}
                onVideoDeleted={handleVideoDeleted}
              />
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

export default AdminPanel
