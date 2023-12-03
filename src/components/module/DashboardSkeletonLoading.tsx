import { Skeleton } from "@/components/ui/skeleton"

const DashboardSkeletonLoading = () => {
  return (
    <>
      <div className="flex gap-4 w-full mb-6">
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
      <div className="flex gap-4 w-full ">
        <Skeleton className="h-40 flex-grow rounded-md" />
        <Skeleton className="h-40 flex-grow rounded-md" />
        <Skeleton className="h-40 flex-grow rounded-md" />
      </div>
    </>
  )
}

export default DashboardSkeletonLoading