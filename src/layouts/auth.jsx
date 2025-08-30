import Navbar from '../components/Navbar'

export default function AuthLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="page-with-navbar">
        {children}
      </div>
    </>
  )
}
