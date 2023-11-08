import Navbar from "./Navbar"

const Layout = ({ children } : { children: React.ReactNode }) => {
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