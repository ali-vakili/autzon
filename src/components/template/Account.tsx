import { authOptions } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getServerSession } from "next-auth";
import { avatarFallBackText } from "@/helper/fallBackText"
import { FiCheckCircle, FiAlertCircle, FiEdit, FiUser } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "../ui/button";
import Link from "next/link";


const Account = async () => {
  const session = await getServerSession(authOptions);

  if(!session) return;

  const { email, image, firstName, lastName, role, is_verified } = session.user
  return (
    <>
      <div className="flex items-center justify-between h-fit">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage alt="avatar" src={image ?? undefined}/>
            <AvatarFallback>{avatarFallBackText(firstName, lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1">
            <h2 className="text-2xl font-bold">
              {firstName}&nbsp;{lastName}
              <TooltipProvider>
                <Tooltip>
                  {is_verified ? (
                    <>
                      <TooltipTrigger>
                        <Badge className="ms-3"><FiCheckCircle size={16} className="me-1.5"/> Verified</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your Account is Verified</p>
                      </TooltipContent>
                    </>
                  ) : (
                    <>
                      <TooltipTrigger>
                        <Badge variant="destructive" className="ms-3"><FiAlertCircle size={16} className="me-1.5"/> Not Verified</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your Account is Not Verified</p>
                      </TooltipContent>
                    </>
                  )}
                </Tooltip>
              </TooltipProvider>
            </h2>
            <h4 className="text-base text-gray-400">{role}</h4>
          </div>
        </div>
        <Link href="/profile" className={buttonVariants({variant: "secondary"})}><FiEdit size={16} className="me-1.5"/> Edit Profile</Link>
      </div>
      <Separator className="my-8" />
      <h3 className="inline-flex items-center text-sm text-gray-400 mb-4"><FiUser className="me-1" />Account Information</h3>
      <h4 className="mb-1">Email</h4>
      <h5 className="text-zinc-400 ms-3">{email}</h5>
    </>
  )
}

export default Account