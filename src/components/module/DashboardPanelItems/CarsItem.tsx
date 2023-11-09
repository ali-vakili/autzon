"use client"

import { dashboardPanelCarsItems } from "@/constants/dashboardPanel";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";

const CarsItem = ({ hasAutoGallery }: {hasAutoGallery: boolean}) => {
  const pathname = usePathname();
  return (
    <>
      {dashboardPanelCarsItems.map((item) => (
        <div className="py-2" key={item.id}>
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{item.label}</h2>
          {hasAutoGallery ? (
            item.children.map((child) => (
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
            ))
          ) : (
            <div className="flex items-start bg-orange-100 text-orange-400 p-4 rounded">
              <FiAlertTriangle size={16} className="mb-2 me-1.5 flex-shrink-0"/>
              <h3 className="text-sm">
                Order to add your cars first need to create an <span className="underline">Auto Gallery</span>.
              </h3>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export default CarsItem