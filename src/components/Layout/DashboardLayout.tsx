import DashboardPanel from "@/components/module/DashboardPanel"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";


const DashboardLayout = async ({ children } : { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if(!session || !session.user) return;
  const user = session.user

  const agent = await prisma.autoGalleryAgent.findUnique({
    where: {
      email: user.email,
      AND: { id: user.id}
    },
    include: { gallery: true },
  });
  const hasAutoGallery = agent!.gallery.length > 0;
  
  return (
    <>
      <DashboardPanel user={user} hasAutoGallery={hasAutoGallery} />
      {children}
    </>
  )
}

export default DashboardLayout