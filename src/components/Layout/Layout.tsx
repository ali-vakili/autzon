import Navbar from "./Navbar"

const Layout = async ({ children } : { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="container max-w-screen-LDesktop relative !p-0">
        {children}
      </div>
    </>
  )
}

export default Layout