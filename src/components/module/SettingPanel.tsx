"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname } from 'next/navigation'
import settingPanel from "@/constants/settingPanel"
import { buttonVariants } from "@/components/ui/button"


const SettingPanel = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const items = settingPanel(session?.user.is_profile_complete)
  return (
    <aside className="min-w-[250px] w-72 self-start overflow-auto py-6 pe-12">
      <ul>
        {items.map((item) => (
          <li className="my-2" key={item.id}>
            <Link href={item.href} className={`${buttonVariants({variant: "ghost", fontSize: pathname === item.href ? "bold" : "normal",})} !text-base w-full !justify-start`}>
              {item.title}
              {item.alert && (
                <span className="text-destructive ms-2">
                  {item.alertIcon}
                </span>
              )}
            </Link>
          </li>
        )) }
      </ul>
    </aside>
  )
}

export default SettingPanel