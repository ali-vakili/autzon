import DashboardPanel from "@/components/module/DashboardPanel"


const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardPanel/>
      { children }
    </div>
  )
}

export default DashBoardLayout