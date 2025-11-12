"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Sparkles } from "lucide-react"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(true)
      setEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            HanJaemi
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            Be among the first to experience the future of Korean learning
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-gray-200 shadow-xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
              Join the Waitlist
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              We're building something amazing. Get early access when we launch!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4 py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  You're on the list!
                </h3>
                <p className="text-gray-600">
                  We'll notify you as soon as HanJaemi is ready. Thank you for your interest!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 text-base"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-medium bg-black hover:bg-gray-800 text-white"
                  disabled={loading}
                >
                  {loading ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 rounded-lg bg-white/50 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">AI-Powered</div>
            <p className="text-sm text-gray-600">Personalized Korean learning with AI tutor</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">Gamified</div>
            <p className="text-sm text-gray-600">Learn through engaging games and challenges</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">Real Content</div>
            <p className="text-sm text-gray-600">Practice with K-dramas and YouTube videos</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Coming soon • We're working hard to bring you the best Korean learning experience
        </p>
      </div>
    </div>
  )
}

