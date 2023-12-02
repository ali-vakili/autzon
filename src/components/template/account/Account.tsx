import Link from "next/link";
import { sessionUser } from "@/lib/types/sessionUserType";

import { FiCheckCircle, FiAlertCircle, FiEdit, FiUser } from "react-icons/fi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { avatarFallBackText } from "@/helper/fallBackText"
import { getCreatedAndJoinDate, getUpdatedAtDate } from "@/helper/getDate";


const Account = async ({ user } : { user: sessionUser }) => {
  const { email, profile, firstName, lastName, role, is_verified, join_date, updatedAt } = user
  const joined_date = getCreatedAndJoinDate(join_date);
  const updatedAt_date = getUpdatedAtDate(updatedAt);

  return (
    <>
      <div className="flex items-center justify-between h-fit">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage alt="avatar" src={profile ?? undefined}/>
            <AvatarFallback>{avatarFallBackText(firstName, lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1">
            <h2 className="text-2xl font-bold">
              {firstName}&nbsp;{lastName}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {is_verified ? (
                      <Badge className="ms-3"><FiCheckCircle size={16} className="me-1.5"/> Verified</Badge>
                    ) : (
                      <Badge variant="destructive" className="ms-3"><FiAlertCircle size={16} className="me-1.5"/> Not Verified</Badge>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {is_verified ? (
                      <p>Your Account is Verified</p>
                    ) : (
                      <p>Your Account is Not Verified</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h2>
            <h4 className="text-base text-gray-400">{role}</h4>
          </div>
        </div>
        <Link href="account/profile" className={buttonVariants({variant: "secondary"})}><FiEdit size={16} className="me-1.5"/> Edit Profile</Link>
      </div>
      <Separator className="my-8" />
      <div className="flex items-center justify-between mb-5">
        <h3 className="inline-flex items-center text-sm text-gray-400"><FiUser size={16} className="me-1.5" />Account Information</h3>
        <h5 className="text-sm text-gray-400">Last updated: {updatedAt_date}</h5>
      </div>
      <h4 className="mb-1 font-semibold text-primary">Email</h4>
      <h5 className="text-zinc-500 ms-3">{email}</h5>
      <h4 className="mb-1 font-semibold text-primary mt-3">Join Date</h4>
      <h5 className="text-zinc-500 ms-3">{joined_date}</h5>
    </>
  )
}

export default Account