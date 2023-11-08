"user client"

import { dashboardPanelAutoGallery } from "@/constants/dashboardPanel";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AutoGalleryItems = ({ hasAutoGallery }: {hasAutoGallery: boolean}) => {
  const items = dashboardPanelAutoGallery(hasAutoGallery);
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => (
        <div className="py-2" key={item.id}>
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{item.label}</h2>
          {item.children.map((child) => (
            child.show && (
              <li className="my-1" key={child.id}>
                {child.alert ? (
                  <Link
                    href={`dashboard/${child.href}`}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname.startsWith(child.href)
                        ? "bg-muted hover-bg-muted text-gray-800 !font-bold"
                        : "hover:text-gray-800 text-gray-400",
                      "justify-between w-full"
                    )}
                  >
                    <span className="inline-flex items-center">
                      {child.icon}
                      {child.title}
                    </span>
                    <span className="text-destructive">
                      {child.alertIcon}
                    </span>
                  </Link>
                ) : (
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
                )}
              </li>
            )
          ))}
        </div>
      ))}
    </>
  )
}

export default AutoGalleryItems