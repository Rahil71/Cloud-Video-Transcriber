import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import VideoUpload from "../components/VideoUpload"
import Layout from "../components/Layout"
import type { Video } from "../types"

const UploadPage: React.FC = () => {
  const [uploadedVideo, setUploadedVideo] = useState<Video | null>(null)
  const navigate = useNavigate()

  const handleVideoUploaded = (video: Video) => {
    setUploadedVideo(video)
  }

  const handleGoToDashboard = () => {
    navigate("/dashboard")
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Upload Video</h1>
            <p className="mt-2 text-lg text-gray-600">
              Upload your video to get started with transcription and AI-powered summaries
            </p>
          </div>

          {!uploadedVideo ? (
            <VideoUpload onVideoUploaded={handleVideoUploaded} />
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">Upload Successful!</h2>
                <p className="text-green-700 mb-4">
                  Your video "{uploadedVideo.originalName}" has been uploaded successfully.
                </p>
                <p className="text-sm text-green-600">You can now start transcription from your dashboard.</p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setUploadedVideo(null)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Upload Another Video
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Upload</h4>
                <p className="text-sm text-gray-600">Upload your video file to our secure cloud storage</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Transcribe</h4>
                <p className="text-sm text-gray-600">AI-powered transcription converts speech to text</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Summarize</h4>
                <p className="text-sm text-gray-600">Generate intelligent summaries with AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UploadPage
