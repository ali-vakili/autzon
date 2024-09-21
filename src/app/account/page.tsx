import Account from "@/components/template/account/Account";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Account",
}

export default function General() {
  return <Account />
}