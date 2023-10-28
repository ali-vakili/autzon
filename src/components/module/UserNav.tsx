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


type NavUserPropsType = {
  user: sessionUser
}

const UserNav = ({ user } : NavUserPropsType) => {
  const { email, firstName, lastName, role, is_profile_complete } = user;

  const avatarFallBackText= (firstName: string|null, lastName: string|null): string => {
    if (firstName && lastName) {
      const firstLetters = `${firstName[0]}${lastName[0]}`;
      return firstLetters.toUpperCase();
    }
    return "AV";
  }

  const items = userNavDropDownMenuItems(is_profile_complete);
  

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-end space-y-1">
        { is_profile_complete ? (
          <h4 className="text-base">
            {firstName}&nbsp;{lastName}
          </h4>
        ) : (
          <Link href={"#"} className="flex text-destructive text-sm hover:underline"><FiAlertCircle size={20} className="me-1"/> Complete your profile</Link>
        )}
        <h5 className="text-xs text-gray-400">{role}</h5>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar>
              <AvatarImage alt="avatar" />
              <AvatarFallback>{avatarFallBackText(firstName, lastName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end" forceMount>
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
          {items.map((item) => (
            <>
              {!item.role || item.role === role ? (
                item.disabled ? (
                  <DropdownMenuItem disabled={item.disabled}>
                    {item.icon}
                    {item.title}
                  </DropdownMenuItem>
                ) : (
                  <Link href={item.href}>
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
                )
              ) : null}
            </>
          ))}
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