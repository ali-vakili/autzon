
import AccessDenied from '@/components/template/AccessDenied'

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Access Denied',
}

export default async function RentCar() {
  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8">
      <AccessDenied />
    </main>
  )
}
