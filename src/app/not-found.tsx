import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

import { FiArrowLeft } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center h-[80svh] gap-6'>
      <div className='flex items-center'>
        <h1 className='text-2xl font-medium p-3 ps-0 me-3 border-r'>404</h1>
        <h4 className='text-sm'>This page could not found.</h4>
      </div>
      <Link href={"/"} className={`${buttonVariants({variant: "default"})} gap-1.5`}><FiArrowLeft size={16}/>Back to Home</Link>
    </div>
  )
}

export default NotFound