import SettingPanel from "@/module/SettingPanel"

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex px-24 py-16">
      <SettingPanel />
      <div className="flex flex-col flex-grow w-100 px-10 py-8 bg-white rounded-lg">
        { children }
      </div>
    </main>
  )
}

export default AccountLayout