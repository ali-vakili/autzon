'use client'
 
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react"
import UserNav from "@/components/module/UserNav"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <header className={`w-100 ${isDashboardPage && '!fixed top-0 z-10 w-full'} relative bg-background border-b`}>
      <nav className={`grid ${isDashboardPage ? 'grid-cols-2' : 'grid-cols-3'} p-4 md:px-8 items-center`}>
        <div className="flex items-center gap-4 w-fit">
          <Link href={"/"}>
            <svg width="82" height="18" viewBox="0 0 82 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M76.6359 3.69598C78.2199 3.69598 79.4999 4.19998 80.4759 5.20798C81.4519 6.19999 81.9399 7.59198 81.9399 9.38398V17.184H78.5799V9.83998C78.5799 8.78399 78.3159 7.97599 77.7879 7.41599C77.2599 6.83998 76.5399 6.55198 75.6279 6.55198C74.6999 6.55198 73.9639 6.83998 73.4199 7.41599C72.8919 7.97599 72.6279 8.78399 72.6279 9.83998V17.184H69.2679V3.88798H72.6279V5.54398C73.0759 4.96798 73.6439 4.51998 74.3319 4.19998C75.0359 3.86398 75.8039 3.69598 76.6359 3.69598Z" fill="#101010"/>
              <path d="M59.8672 17.4C58.5872 17.4 57.4352 17.12 56.4112 16.56C55.3872 15.984 54.5792 15.176 53.9872 14.136C53.4112 13.096 53.1232 11.896 53.1232 10.536C53.1232 9.176 53.4192 7.976 54.0112 6.936C54.6192 5.896 55.4432 5.096 56.4832 4.536C57.5232 3.96 58.6832 3.672 59.9632 3.672C61.2432 3.672 62.4032 3.96 63.4432 4.536C64.4832 5.096 65.2992 5.896 65.8912 6.936C66.4992 7.976 66.8032 9.176 66.8032 10.536C66.8032 11.896 66.4912 13.096 65.8672 14.136C65.2592 15.176 64.4272 15.984 63.3712 16.56C62.3312 17.12 61.1632 17.4 59.8672 17.4ZM59.8672 14.472C60.4752 14.472 61.0432 14.328 61.5712 14.04C62.1152 13.736 62.5472 13.288 62.8672 12.696C63.1872 12.104 63.3472 11.384 63.3472 10.536C63.3472 9.272 63.0112 8.304 62.3392 7.632C61.6832 6.944 60.8752 6.6 59.9152 6.6C58.9552 6.6 58.1472 6.944 57.4912 7.632C56.8512 8.304 56.5312 9.272 56.5312 10.536C56.5312 11.8 56.8432 12.776 57.4672 13.464C58.1072 14.136 58.9072 14.472 59.8672 14.472Z" fill="#101010"/>
              <path d="M45.4336 14.424H51.3616V17.184H41.6176V14.472L47.4256 6.64799H41.6416V3.88799H51.2896V6.59999L45.4336 14.424Z" fill="#101010"/>
              <path d="M36.9689 6.64799V13.08C36.9689 13.528 37.0729 13.856 37.2809 14.064C37.5049 14.256 37.8729 14.352 38.3849 14.352H39.9449V17.184H37.8329C35.0009 17.184 33.5849 15.808 33.5849 13.056V6.64799H32.0009V3.88799H33.5849V0.599991H36.9689V3.88799H39.9449V6.64799H36.9689Z" fill="#101010"/>
              <path d="M29.7417 3.88799V17.184H26.3577V15.504C25.9257 16.08 25.3577 16.536 24.6537 16.872C23.9657 17.192 23.2137 17.352 22.3977 17.352C21.3577 17.352 20.4377 17.136 19.6377 16.704C18.8377 16.256 18.2057 15.608 17.7417 14.76C17.2937 13.896 17.0697 12.872 17.0697 11.688V3.88799H20.4297V11.208C20.4297 12.264 20.6937 13.08 21.2217 13.656C21.7497 14.216 22.4697 14.496 23.3817 14.496C24.3097 14.496 25.0377 14.216 25.5657 13.656C26.0937 13.08 26.3577 12.264 26.3577 11.208V3.88799H29.7417Z" fill="#101010"/>
              <path d="M0.0601196 10.488C0.0601196 9.144 0.32412 7.952 0.85212 6.912C1.39612 5.872 2.12412 5.072 3.03612 4.512C3.96412 3.952 4.99612 3.672 6.13212 3.672C7.12412 3.672 7.98812 3.872 8.72412 4.272C9.47612 4.672 10.0761 5.176 10.5241 5.784V3.888H13.9081V17.184H10.5241V15.24C10.0921 15.864 9.49212 16.384 8.72412 16.8C7.97212 17.2 7.10012 17.4 6.10812 17.4C4.98812 17.4 3.96412 17.112 3.03612 16.536C2.12412 15.96 1.39612 15.152 0.85212 14.112C0.32412 13.056 0.0601196 11.848 0.0601196 10.488ZM10.5241 10.536C10.5241 9.72 10.3641 9.024 10.0441 8.448C9.72412 7.856 9.29212 7.408 8.74812 7.104C8.20412 6.784 7.62012 6.624 6.99612 6.624C6.37212 6.624 5.79612 6.776 5.26812 7.08C4.74012 7.384 4.30812 7.832 3.97212 8.424C3.65212 9 3.49212 9.688 3.49212 10.488C3.49212 11.288 3.65212 11.992 3.97212 12.6C4.30812 13.192 4.74012 13.648 5.26812 13.968C5.81212 14.288 6.38812 14.448 6.99612 14.448C7.62012 14.448 8.20412 14.296 8.74812 13.992C9.29212 13.672 9.72412 13.224 10.0441 12.648C10.3641 12.056 10.5241 11.352 10.5241 10.536Z" fill="#101010"/>
            </svg>
          </Link>
          {isDashboardPage && (
            <Select defaultValue="open">
              <SelectTrigger className="ml-auto w-fit gap-3 rounded-full">
                <SelectValue placeholder="Select your gallery state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="close">Close</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {!isDashboardPage && (
          <div className="space-x-2 justify-self-center">
            <Link href="/buy-car" className={`${buttonVariants({variant: "link"})} ${pathname.startsWith("/buy-car") && "underline font-semibold"}`}>Buy Car</Link>
            <Link href="/rent-car" className={`${buttonVariants({variant: "link"})} ${pathname.startsWith("/rent-car") && "underline font-semibold"}`}>Rent Car</Link>
            <Link href="/galleries" className={`${buttonVariants({variant: "link"})} ${pathname.startsWith("/galleries") && "underline font-semibold"}`}>Galleries</Link>
          </div>
        )}
        <div className="col-span-1 justify-self-end">
          {status === "loading" ? (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end space-y-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          ) : status === "authenticated" ? (
            <UserNav user={session.user} isDashboardPage={isDashboardPage} />
          ) : (
            <div className="space-x-3">
              <Link href={"/sign-up"} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                Start as a customer
              </Link>
              {pathname === "/agent/sign-up" ? (
                <Link href={"/sign-in"} className={buttonVariants({ variant: "default", size: "sm" })}>
                  Sign in to your account
                </Link>
              ) : (
                <Link href={"/agent/sign-up"} className={buttonVariants({ variant: "default", size: "sm" })}>
                  Create your own gallery
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar