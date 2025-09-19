import type React from "react"
import Layout from "../components/Layout"

const InfoPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Cloud Video Transcriber</h1>
            <p className="text-blue-100 text-lg">AI-Powered Video Transcription & Summarization Platform</p>
          </div>

          {/* Content Section */}
          <div className="px-6 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* About Section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Platform</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Cloud Video Transcriber is a cutting-edge platform that leverages artificial intelligence to
                    automatically transcribe and summarize your video content. Whether you're a content creator,
                    educator, or business professional, our platform makes it easy to extract valuable insights from
                    your videos.
                  </p>

                  <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Key Features:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Automatic video transcription with high accuracy</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>AI-powered content summarization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Support for multiple video formats</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Secure cloud storage and processing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Free and paid plans available</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Easy transcript download and sharing</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Creator Section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet the Creator</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Placeholder for creator photo */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">RS</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Rahil Shaikh</h3>
                      <p className="text-gray-600">Full Stack Developer & AI Enthusiast</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-600">
                    <p>
                      Rahil Shaikh is a passionate full-stack developer with expertise in modern web technologies and
                      artificial intelligence. With a focus on creating innovative solutions that solve real-world
                      problems, Rahil developed this platform to make video content more accessible and actionable.
                    </p>

                    <div className="pt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">MongoDB</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">AWS</span>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Cloudinary</span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">AI APIs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Upload Video</h3>
                  <p className="text-sm text-gray-600">Upload your video file to our secure cloud platform</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">AI Processing</h3>
                  <p className="text-sm text-gray-600">Our AI analyzes and transcribes your video content</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Generate Summary</h3>
                  <p className="text-sm text-gray-600">Get AI-powered summaries of your video content</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Download & Share</h3>
                  <p className="text-sm text-gray-600">Download transcripts and share insights easily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default InfoPage
