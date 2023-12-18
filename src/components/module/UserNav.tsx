import Link from "next/link"
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { FiLogOut, FiAlertCircle } from "react-icons/fi"
import userNavDropDownMenuItems from "@/constants/userNavMenuItem";

import { sessionUser } from "@/lib/types/sessionUserType";
import { avatarFallBackText } from "@/helper/fallBackText"


type NavUserPropsType = {
  user: sessionUser,
  isDashboardPage: boolean
}

const UserNav = ({ user, isDashboardPage }: NavUserPropsType) => {
  const { profile, email, firstName, lastName, role, is_profile_complete } = user;
  const items = userNavDropDownMenuItems(is_profile_complete);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-end space-y-1">
        { is_profile_complete ? (
          <h4 className="md:text-base text-sm">
            {firstName}&nbsp;{lastName}
          </h4>
        ) : (
          <Link href={"/account/profile"} className="flex text-destructive text-sm hover:underline"><FiAlertCircle size={20} className="me-1"/>Complete your profile</Link>
        )}
        {!isDashboardPage && <h5 className="text-xs text-gray-400">{role}</h5>}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar>
              <AvatarImage alt="avatar" src={profile ?? undefined} />
              <AvatarFallback>{avatarFallBackText(firstName, lastName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sm:w-52 w-40" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{firstName}&nbsp;{lastName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {items.map((item) => {
              if (!item.role || item.role === role) {
                if (item.disabled) {
                  return (
                    <DropdownMenuItem disabled={item.disabled} key={item.id}>
                      {item.icon}
                      {item.title}
                    </DropdownMenuItem>
                  );
                } else {
                  return (
                    <Link href={item.href} key={item.id}>
                      <DropdownMenuItem>
                        {item.icon}
                        {item.title}
                        {item.alert && (
                          <DropdownMenuShortcut className="text-destructive">
                            {item.alertIcon}
                          </DropdownMenuShortcut>
                        )}
                      </DropdownMenuItem>
                    </Link>
                  );
                }
              } else {
                return null;
              }
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => signOut()}>
            <FiLogOut size={16} className="me-3"/>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserNav;