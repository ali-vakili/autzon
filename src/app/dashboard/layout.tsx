import DashboardLayout from "@/components/Layout/DashboardLayout";


const DashBoardRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}

export default DashBoardRootLayout