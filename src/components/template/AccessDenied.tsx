import Link from "next/link";

import { FiArrowLeft } from "react-icons/fi";
import { buttonVariants } from "@/ui/button";

const AccessDenied = () => {

  return (
    <div className="flex flex-col items-center justify-center w-full mt-24 gap-4">
      <h1 className="text-6xl font-semibold">
        Access Denied
      </h1>
      <p>Your don&apos;t have the required permission to see this page.</p>
      <Link href={"/"} className={`${buttonVariants({variant: "default"})} gap-1.5`}><FiArrowLeft size={16}/>Back to Home</Link>
    </div>
  )
}

export default AccessDenied