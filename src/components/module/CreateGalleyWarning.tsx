import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { FiAlertCircle, FiPlus } from "react-icons/fi";

const CreateGalleyWarning = () => {
  return (
    <div className="flex flex-col w-full bg-red-50 rounded p-6 space-y-4">
      <h2 className="flex items-center gap-2 font-semibold text-destructive"><FiAlertCircle className="inline" size={20}/> Create your gallery</h2>
      <p className="text-destructive text-justify">To continue and harness the benefits of autzon, you need to create an auto gallery first which will represent your gallery, This auto gallery will serve as the platform for showcasing your collection for both sales and rentals within the autzon community.</p>
      <Link href={"dashboard/gallery/create"} className={`${buttonVariants({ variant: "default", size: "lg" })} w-fit gap-x-1`}>
        <FiPlus size={16}/>Create My Auto Gallery
      </Link>
    </div>
  )
}

export default CreateGalleyWarning