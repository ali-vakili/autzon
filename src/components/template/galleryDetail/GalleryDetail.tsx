"use client"

import GalleryPage from "./GalleryPage";
import galleryDetailType from "./galleryDetailType";
import { useRouter } from "next/navigation";

import { useGetGalleryDetail } from "@/hooks/useGetGalleryDetail";

import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";
import { useEffect, useState } from "react";

import { Building } from "lucide-react";
import { FiArrowLeft} from "react-icons/fi";

type galleryDetailPropType = {
  galleryId: string
}

const GalleryDetail = ({ galleryId }: galleryDetailPropType) => {
  const [gallery, setGallery] = useState<galleryDetailType | null>(null);
  const router = useRouter();

  const { data: galleryDetail, isSuccess, isLoading, isFetching, isError, error, refetch } = useGetGalleryDetail(galleryId);

  useEffect(() => {
    isSuccess && setGallery(galleryDetail.data);
    //@ts-ignore
    isError === true && error && toast.error(error?.response.data.error);
  }, [galleryDetail, isError])

  return (
    <div className="flex flex-col items-start w-full bg-white rounded-md px-5 py-6 gap-4 max-w-5xl mx-auto">
      <h2 className="flex items-center text-sm font-semibold text-muted-foreground self-start"><Building size={28} className="bg-gray-100 rounded p-1.5 me-1.5" />Gallery Details</h2>
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-md"/>
      ) : !gallery ? (
        <div className="flex flex-col items-center w-full rounded-md gap-4">
          <h2 className="text-4xl font-semibold">404</h2>
          <h2 className="flex items-center text-lg font-semibold">Gallery not found!</h2>
          <h4 className="flex items-center text-xs mb-3">Requested gallery does not exits.</h4>
          <Button onClick={() => router.back()} variant={"default"} className="gap-1"><FiArrowLeft size={16}/>Go Back</Button>
        </div>
      ) : gallery && (
        <GalleryPage gallery={gallery} />
      )}
    </div>
  )
}

export default GalleryDetail