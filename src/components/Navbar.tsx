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
            <div className="right-section">
              <button className="nav-button home-btn" onClick={() => navigate("/")}>
                בית
              </button>
              <button className="nav-button" onClick={() => {
                if (!isLoggedIn) {
                  alert("עליך להתחבר כדי לגשת לעמוד זה"); navigate("/"); return;
                }
                navigate("/cvs");
              }}>
                הקבצים שלי
              </button>
              <button className="nav-button" onClick={() => {
                if (!isLoggedIn) {
                  alert("עליך להתחבר כדי לגשת לעמוד זה"); navigate("/"); return;
                }
                navigate("/cover-letter-bot");
              }}
              >
                צור מכתב מקדים
              </button>
            </div>
            <div className="logo-section" onClick={() => navigate("/")}></div>
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
