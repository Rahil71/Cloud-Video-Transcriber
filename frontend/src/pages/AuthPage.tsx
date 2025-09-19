import type React from "react"
import { useState } from "react"
import LoginForm from "../components/LoginForm"
import SignupForm from "../components/SignupForm"

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleSwitchToSignup = () => {
    setIsLogin(false)
    setShowSuccessMessage(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
    setShowSuccessMessage(false)
  }

  const handleSignupSuccess = () => {
    setShowSuccessMessage(true)
    setIsLogin(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Account created successfully!</h3>
                <p className="mt-1 text-sm text-green-700">You can now sign in with your credentials.</p>
              </div>
            </div>
          </div>
        )}

        {isLogin ? (
          <LoginForm onSwitchToSignup={handleSwitchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={handleSwitchToLogin} onSignupSuccess={handleSignupSuccess} />
        )}
      </div>
    </div>
  )
}

export default AuthPage
