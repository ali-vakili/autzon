"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/ui/scroll-area"
import { buttonVariants } from "@/ui/button"
import { dashboardPanel } from "@/constants/dashboardPanel"
import { sessionUser } from "@/lib/types/sessionUserType"
import { AutoGalleryItems, CarsItem, RequestsItem } from "./DashboardPanelItems"
import { cn } from "@/lib/utils"


const DashboardPanel = ({ user, hasAutoGallery }: { user: sessionUser, hasAutoGallery: boolean}) => {
  const pathname = usePathname();
  return (
    <aside className="fixed min-w-[248px] h-full overflow-hidden -translate-x-full md:translate-x-0 w-64 transition-all z-40 top-[73px] left-0">
      <ScrollArea className="h-full z-20 bg-background w-64 border-r">
        <div className="pt-8 pb-20 px-4 h-fit">
          <ul className="flex flex-col w-full items-start gap-y-2">
            <>
              {dashboardPanel.map((item) => (
                  <li className="my-1 w-full" key={item.id}>
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
              <RequestsItem hasAutoGallery={hasAutoGallery} />
            </>
          </ul>
        </div>
      </ScrollArea>
      <div role="button" aria-label="backdrop" className="fixed inset-0 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-10 w-full"></div>
    </aside>
  )
}

export default DashboardPanel