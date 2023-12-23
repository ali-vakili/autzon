"use client"

import Link from "next/link";
import { cn } from "@/lib/utils";
import { dashboardPanelRequestItems } from "@/constants/dashboardPanel";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";

const RequestsItem = ({ hasAutoGallery }: {hasAutoGallery: boolean}) => {
  const pathname = usePathname();
  return (
    <>
      {dashboardPanelRequestItems.map((item) => (
        <div className="py-2 w-full" key={item.id}>
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{item.label}</h2>
          {hasAutoGallery ? (
            item.children.map((child) => (
              <li className="my-1 w-full" key={child.id}>
                <Link
                  href={`/dashboard/${child.href}`}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === `/dashboard/${child.href}`
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
                Order to see your requests first need to create an <span className="underline">Auto Gallery</span>.
              </h3>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export default RequestsItem