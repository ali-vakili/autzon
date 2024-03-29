import DashboardPanel from "@/components/module/DashboardPanel"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import { ScrollArea } from "@/ui/scroll-area";
import { redirect } from "next/navigation";


const DashboardLayout = async ({ children } : { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if(!session || !session.user) return;
  const user = session.user;

  const agent = await prisma.autoGalleryAgent.findUnique({
    where: {
      email: user.email,
      AND: { id: user.id}
    },
    include: { gallery: true },
  });

  if (!agent) redirect("/dashboard")

  const hasAutoGallery = agent.gallery.length > 0;
  
  return (
    <>
      <DashboardPanel user={user} hasAutoGallery={hasAutoGallery} />
      <main className="flex flex-col flex-grow overflow-hidden justify-center h-full md:ps-64 transition-all">
        <ScrollArea className="h-[100svh] max-h-fit pt-[65px]">
          <div className="relative px-5 py-8 md:px-10 !pb-8 min-h-screen">
            {children}
          </div>
        </ScrollArea>
      </main>
    </>
  )
}

export default DashboardLayout