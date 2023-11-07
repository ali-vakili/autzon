import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center p-24 ps-64">
      <div className="z-10 max-w-5xl items-center justify-center font-mono text-sm sm:flex">
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 p-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto rounded-xl border lg:bg-gray-200 lg:dark:bg-zinc-800/30">
          Hello autzon from dashboard!
        </p>
      </div>
    </main>
  )
}