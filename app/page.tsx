import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, BookOpen, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  // This page will only show for non-authenticated users
  // Authenticated users are redirected to /study by middleware
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Master Korean with{" "}
              <span className="block text-primary">HanJaemi</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered learning platform designed to help you achieve TOPIK success
              through structured lessons, real K-content, and personalized feedback.
            </p>
        </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Start Learning Free</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
                </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-muted">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>TOPIK Focused</CardTitle>
              </CardHeader>
              <CardContent>
              <p className="text-muted-foreground">
                  Structured curriculum aligned with TOPIK levels 1-6
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-muted">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>K-Content Learning</CardTitle>
              </CardHeader>
              <CardContent>
              <p className="text-muted-foreground">
                  Learn through K-dramas, music, and authentic content
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-muted">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI-Powered Feedback</CardTitle>
              </CardHeader>
              <CardContent>
              <p className="text-muted-foreground">
                  Get personalized corrections and learning insights
              </p>
              </CardContent>
            </Card>
            </div>
          </div>
          </div>
          </div>
  )
}
