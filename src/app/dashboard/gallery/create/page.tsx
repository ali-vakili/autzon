import CreateGalleryForm from "@/components/template/CreateGallery";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Create Gallery",
}

export default function CreateGallery() {

  return (
    <CreateGalleryForm />
  )
}