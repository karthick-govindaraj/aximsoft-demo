'use client'

import Scene from './components/Scene'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="h-screen w-screen">
        <Scene />
      </div>
    </main>
  )
}