"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, BookOpen, Target, TrendingUp, ArrowRight, CheckCircle, Gamepad2, Video, MessageCircle, Award, BookX, VideoOff, DollarSign, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const problemsRef = useRef<HTMLDivElement>(null)
  const solutionsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) observer.observe(heroRef.current)
    if (problemsRef.current) observer.observe(problemsRef.current)
    if (solutionsRef.current) observer.observe(solutionsRef.current)
    if (ctaRef.current) observer.observe(ctaRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full opacity-30 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-20 animate-float-medium"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full opacity-25 animate-float-fast"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-30 animate-float-slow"></div>
        
        {/* Floating Squares */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rotate-45 opacity-20 animate-spin-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rotate-12 opacity-25 animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-20 animate-pulse-slow"></div>
        
        {/* Animated Lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30 animate-line-move"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-20 animate-line-move-reverse"></div>
        
        {/* Floating Dots */}
        <div className="absolute top-20 left-1/2 w-2 h-2 bg-gray-300 rounded-full opacity-40 animate-dot-float-1"></div>
        <div className="absolute top-32 right-1/4 w-1 h-1 bg-gray-400 rounded-full opacity-50 animate-dot-float-2"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-gray-300 rounded-full opacity-30 animate-dot-float-3"></div>
        <div className="absolute bottom-20 right-1/2 w-2 h-2 bg-gray-400 rounded-full opacity-40 animate-dot-float-4"></div>
      </div>

      {/* Hero Section - Centered */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 data-tour="hero-title" className="text-5xl md:text-7xl font-bold tracking-tight text-black">
              Stop Struggling with{" "}
              <span className="block text-gray-600">Boring Korean Textbooks</span>
              <span className="block bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                Start Learning with HanJaemi
              </span>
            </h1>
            <p data-tour="hero-description" className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Finally, a Korean learning platform that makes you <strong className="text-black">actually want to study</strong> with 
              gamified lessons, real K-dramas, and an AI tutor that's always available.
            </p>
          </div>
          
          <div data-tour="cta-buttons" className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg">
              <Link href="/register">Try Free - No Credit Card</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105">
              <Play className="mr-2 h-5 w-5" />
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Problems Section - Appears on scroll */}
      <section ref={problemsRef} data-tour="problems-section" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Tired of These Korean Learning Problems?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most Korean learners face these frustrating challenges every day
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BookX className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-gray-900 text-lg">Boring & Repetitive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Textbooks and drills don't keep you motivated to continue learning
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <VideoOff className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-gray-900 text-lg">No Real Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Lessons disconnected from actual Korean used in dramas & YouTube
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-gray-900 text-lg">Expensive Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Private tutors are costly and not always available when you need them
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardCheck className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-gray-900 text-lg">Poor TOPIK Prep</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No AI guidance for writing & speaking practice and feedback
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section - Appears on scroll */}
      <section ref={solutionsRef} data-tour="solutions-section" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Here's How HanJaemi Solves Everything
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your Korean learning experience with our innovative approach
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-lg">Motivation Sustained</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gamified levels, XP, and achievements make learning feel like an engaging game
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-lg">Practical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Learn from YouTube videos, dramas, and songs you actually enjoy watching
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-lg">Affordable Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI tutor always available - no expensive private lessons needed
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-lg">Higher TOPIK Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Structured AI-driven prep with personalized feedback and corrections
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Appears on scroll */}
      <section ref={ctaRef} className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Korean Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who finally found their Korean learning breakthrough. 
            Start your journey today and see results in just 3 months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105">
              <Link href="/register">Start Your Breakthrough Today</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white bg-white text-black px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105">
              <ArrowRight className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }
        
        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(360deg);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }
        
        @keyframes line-move {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes line-move-reverse {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes dot-float-1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-15px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        @keyframes dot-float-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-25px) translateX(-10px);
          }
          66% {
            transform: translateY(-15px) translateX(20px);
          }
        }
        
        @keyframes dot-float-3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-35px) translateX(-20px);
          }
        }
        
        @keyframes dot-float-4 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-15px) translateX(-5px);
          }
          50% {
            transform: translateY(-25px) translateX(15px);
          }
          75% {
            transform: translateY(-10px) translateX(-10px);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-line-move {
          animation: line-move 15s linear infinite;
        }
        
        .animate-line-move-reverse {
          animation: line-move-reverse 12s linear infinite;
        }
        
        .animate-dot-float-1 {
          animation: dot-float-1 10s ease-in-out infinite;
        }
        
        .animate-dot-float-2 {
          animation: dot-float-2 8s ease-in-out infinite;
        }
        
        .animate-dot-float-3 {
          animation: dot-float-3 6s ease-in-out infinite;
        }
        
        .animate-dot-float-4 {
          animation: dot-float-4 9s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
