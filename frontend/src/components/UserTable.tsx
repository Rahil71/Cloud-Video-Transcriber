import type React from "react"
import { useState } from "react"
import type { User } from "../types"
import { deleteUserAndVideos } from "../api/admin"

interface UserTableProps {
  users: User[]
  onUserDeleted: (userId: string) => void
  onViewUserVideos: (userId: string) => void
}

const UserTable: React.FC<UserTableProps> = ({ users, onUserDeleted, onViewUserVideos }) => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}" and all their videos? This action cannot be undone.`,
      )
    ) {
      return
    }

    setDeletingUserId(userId)
    try {
      await deleteUserAndVideos(userId)
      onUserDeleted(userId)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete user")
    } finally {
      setDeletingUserId(null)
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user.id}>
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.plan === "paid" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.plan} plan
                </span>
                <button
                  onClick={() => onViewUserVideos(user.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Videos
                </button>
                {user.role !== "admin" && (
                  <button
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    disabled={deletingUserId === user.id}
                    className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                  >
                    {deletingUserId === user.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserTable
