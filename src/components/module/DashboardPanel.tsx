"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/ui/scroll-area"
import { buttonVariants } from "@/ui/button"
import { dashboardPanel } from "@/constants/dashboardPanel"
import { sessionUser } from "@/lib/types/sessionUserType"
import { AutoGalleryItems, CarsItem } from "./DashboardPanelItems"
import { cn } from "@/lib/utils"


const DashboardPanel = ({ user, hasAutoGallery }: { user: sessionUser, hasAutoGallery: boolean}) => {
  const pathname = usePathname();
  return (
    <aside className="fixed min-w-[248px] h-full overflow-hidden w-64 transition-all left-0 border-r">
      <ScrollArea className="h-full">
        <div className="pt-8 pb-20 px-4 h-fit">
          <ul className="space-y-4">
            <>
              {dashboardPanel.map((item) => (
                  <li className="my-1" key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname === item.href
                        ? "bg-muted hover-bg-muted text-gray-800 !font-bold"
                        : "hover:text-gray-800 text-gray-400",
                      "justify-start w-full"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))}
              <AutoGalleryItems hasAutoGallery={hasAutoGallery} />
              <CarsItem hasAutoGallery={hasAutoGallery} />
            </>
          </ul>
        </div>
      </ScrollArea>
    </aside>
  )
}

export default DashboardPanel