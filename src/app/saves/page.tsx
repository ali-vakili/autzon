import SavedCars from "@/components/template/SavedCars";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Saves',
}

export default async function Saves() {
  const session = await getServerSession(authOptions);

  if(!session || !session.user) return;

  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8">
      <SavedCars />
    </main>
  )
}
