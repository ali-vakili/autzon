"use client"

import { usePathname } from "next/navigation";
import { useEffect } from "react"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const body = document.getElementById('body');
    pathname.startsWith("/dashboard") ? body?.classList.add("overflow-hidden") : body?.classList.remove("overflow-hidden")
  }, [])

  return <>{children}</>
}