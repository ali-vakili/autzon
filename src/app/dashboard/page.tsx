import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib';
import CreateGalleyWarning from '@/components/module/CreateGalleyWarning';

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if(!session || !session.user) redirect("/sign-in");
  const user = session.user;

  const gallery = await prisma.autoGallery.findFirst({
    where: {
      agent_id: user.id,
      AND: { agent: {
        email: user.email
      }}
    }
  });

  if (!gallery) {
    return (
      <CreateGalleyWarning />
    )
  }

  return (
    <div className="z-10 max-w-5xl items-center justify-center font-mono text-sm sm:flex">
      <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 p-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto rounded-xl border lg:bg-gray-200 lg:dark:bg-zinc-800/30">
        Hello autzon from dashboard!
      </p>
    </div>
  )
}