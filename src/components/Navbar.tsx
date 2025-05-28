import { useState, useEffect, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import "../styles/Navbar.css"

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="modern-navbar">
      <div className="navbar-wrapper">
        <nav className={`navbar-container ${scrolled ? "scrolled" : ""}`}>
          <div className="navbar-bg-effects">
            <div className="glow-line"></div>
            <div className="floating-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>
          <div className="navbar-content">
            {/* כפתורי ניווט בצד ימין */}
            <div className="right-section">
              <button className="nav-button home-btn" onClick={() => navigate("/")}>
                בית
              </button>
              {location.pathname === "/create-cv" && (
                <button className="nav-button" onClick={() => navigate("/cvs")}>
                  הקבצים שלי
                </button>
              )}
              {location.pathname === "/update-cv" && (
                <button className="nav-button" onClick={() => navigate("/cvs")}>
                  הקבצים שלי
                </button>
              )}
            </div>

            {/* לוגו במרכז */}
            <div className="logo-section" onClick={() => navigate("/")}></div>

            {/* כפתור התנתקות בצד שמאל */}
            <div className="left-section">
              {isLoggedIn && (
                <button
                  className="nav-button logout-btn"
                  onClick={() => {
                    logout()
                    navigate("/")
                  }}
                >
                  התנתק
                </button>
              )}
            </div>

            <div className="mobile-toggle">
              <div className="toggle-line"></div>
              <div className="toggle-line"></div>
              <div className="toggle-line"></div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Navbar
