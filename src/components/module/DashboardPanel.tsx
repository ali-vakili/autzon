"use client"

import Link from "next/link"
import { buttonVariants } from "@/ui/button"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/ui/scroll-area"
import { cn } from "@/lib/utils"
import dashboardPanel from "@/constants/dashboardPanel"


const DashboardPanel = () => {
  const pathname = usePathname();
  const items = dashboardPanel();
  
  return (
    <aside className="fixed min-w-[248px] h-full overflow-hidden w-64 transition-all left-0 border-r">
      <ScrollArea className="h-full">
        <div className="pt-8 pb-20 px-4 h-fit">
          <ul className="space-y-4">
            {items.map((item) => (
              item.label ? (
                <div className="py-2" key={item.id}>
                  <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{item.label}</h2>
                  {item.children.map((child) => (
                    <li className="my-1" key={child.id}>
                    <Link
                      href={`dashboard/${child.href}`}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname.startsWith(child.href)
                          ? "bg-muted hover-bg-muted text-gray-800 !font-bold"
                          : "hover:text-gray-800 text-gray-400",
                        "justify-start w-full"
                      )}
                    >
                      {child.icon}
                      {child.title}
                    </Link>
                  </li>
                  ))}
                </div>
              ) : (
                <li className="my-1" key={item.id}>
                  <Link
                    href={`${item.href !== "/dashboard" ? `dashboard/${item.href}` : item.href}`}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname.startsWith(item.href!)
                        ? "bg-muted hover-bg-muted text-gray-800 !font-bold"
                        : "hover:text-gray-800 text-gray-400",
                      "justify-start w-full"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              )
            ))}
          </ul>
        </div>
      </ScrollArea>
    </aside>
  )
}

export default DashboardPanel