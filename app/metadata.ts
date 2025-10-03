import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HanJaemi - Korean Learning Platform',
  description: 'Learn Korean with AI-powered lessons, grammar explanations, and vocabulary practice. Master Korean language with interactive exercises and personalized learning.',
  keywords: ['Korean', 'Korean learning', 'Korean language', 'TOPIK', 'Korean grammar', 'Korean vocabulary', 'AI tutor', 'Korean lessons'],
  authors: [{ name: 'HanJaemi Team' }],
  creator: 'HanJaemi',
  publisher: 'HanJaemi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hanjaemi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HanJaemi - Korean Learning Platform',
    description: 'Learn Korean with AI-powered lessons, grammar explanations, and vocabulary practice.',
    url: 'https://hanjaemi.com',
    siteName: 'HanJaemi',
    images: [
      {
        url: '/jaemi-logo-dark.svg',
        width: 1200,
        height: 630,
        alt: 'HanJaemi - Korean Learning Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HanJaemi - Korean Learning Platform',
    description: 'Learn Korean with AI-powered lessons, grammar explanations, and vocabulary practice.',
    images: ['/jaemi-logo-dark.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/jaemi-logo-dark.svg',
    shortcut: '/jaemi-logo-dark.svg',
    apple: '/jaemi-logo-dark.svg',
  },
  manifest: '/manifest.json',
}
