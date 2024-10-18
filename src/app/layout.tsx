import '@/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple and elegant Todo app built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}
