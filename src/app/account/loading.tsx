import { Skeleton } from "@/ui/skeleton"

const AccountSkeleton = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-end space-y-2">
        <Skeleton className="h-3 w-[100px]" />
        <Skeleton className="h-3 w-[80px]" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  )
}

export default AccountSkeleton