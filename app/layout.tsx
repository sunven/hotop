'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

const footBar = [
  {
    name: '微博',
    url: '/weibo',
  },
  {
    name: '知乎',
    url: '/zhihu',
  },
]

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const [innerHeight, setinnerHeight] = useState(0)
  useEffect(() => {
    setinnerHeight(window.innerHeight)
  }, [])
  return (
    <html lang="en">
      <body className={inter.className} style={{ height: innerHeight + 'px' }}>
        <div className="flex flex-col h-full">
          <header className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="md:flex md:items-center md:gap-12">
                  <a className="block text-teal-600" href="#">
                    <span className="sr-only">Home</span>
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M25.5 37H21L11 42V37H4V7H44V18"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <circle cx="34" cy="28" r="6" fill="none" stroke="#333" stroke-width="4" />
                      <path
                        d="M39 32L44 36"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 15H15L18 15"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 21H18L24 21"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </a>
                </div>
                <div>HoTop</div>
                <div className="flex items-center gap-4">
                  <div className="sm:flex sm:gap-4">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M36.686 15.171C37.9364 16.9643 38.8163 19.0352 39.2147 21.2727H44V26.7273H39.2147C38.8163 28.9648 37.9364 31.0357 36.686 32.829L40.0706 36.2137L36.2137 40.0706L32.829 36.686C31.0357 37.9364 28.9648 38.8163 26.7273 39.2147V44H21.2727V39.2147C19.0352 38.8163 16.9643 37.9364 15.171 36.686L11.7863 40.0706L7.92939 36.2137L11.314 32.829C10.0636 31.0357 9.18372 28.9648 8.78533 26.7273H4V21.2727H8.78533C9.18372 19.0352 10.0636 16.9643 11.314 15.171L7.92939 11.7863L11.7863 7.92939L15.171 11.314C16.9643 10.0636 19.0352 9.18372 21.2727 8.78533V4H26.7273V8.78533C28.9648 9.18372 31.0357 10.0636 32.829 11.314L36.2137 7.92939L40.0706 11.7863L36.686 15.171Z"
                        fill="none"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z"
                        fill="none"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
          <div className="inline-flex w-full border border-gray-100 bg-gray-100 p-1 justify-between">
            {footBar.map(({ name, url }) => (
              <button
                key={url}
                className={`inline-block rounded-md px-4 py-2 text-sm focus:relative ${
                  url === pathname ? 'text-blue-500 bg-white' : 'text-gray-500'
                }`}
                onClick={() => {
                  router.push(url)
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </body>
    </html>
  )
}
