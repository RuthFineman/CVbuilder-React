import type React from "react"
import { useState, useEffect, useRef, useContext } from "react"
import axios from "axios"
import "../styles/LoginModal.css"
import { LoginModalProps } from "../types/type"
import { AuthContext } from "../contexts/AuthContext"


const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose}) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const { login } = useContext(AuthContext);
  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setPassword("")
      setIsLoading(false)
      setShowSuccess(false)
    } else {
      createParticles()
    }
  }, [isOpen])

  const createParticles = () => {
    if (!particlesRef.current) return
    particlesRef.current.innerHTML = ""

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"

      const size = Math.random() * 4 + 2
      const delay = Math.random() * 15
      const duration = Math.random() * 20 + 10
      const randomX = Math.random() * 200 - 100

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.bottom = "-10px"
      particle.style.animationDelay = `${delay}s`
      particle.style.animationDuration = `${duration}s`
      particle.style.setProperty("--random", randomX.toString())

      particlesRef.current.appendChild(particle)
    }

    const energyField = document.createElement("div")
    energyField.className = "energy-field"
    particlesRef.current.appendChild(energyField)

    for (let i = 0; i < 2; i++) {
      const cube = document.createElement("div")
      cube.className = "floating-cube"
      particlesRef.current.appendChild(cube)
    }
  }
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !showSuccess) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose, showSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${baseUrl}/api/Users/login`, {
        email,
        password,
      })

      const token = response.data.token
      const userId = response.data.id

      localStorage.setItem("token", token)
      localStorage.setItem("userId", userId)

      setShowSuccess(true)
      setTimeout(() => {
        login(token);
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error("Login error", error)
      const errorMsg = error.response?.data || "נסה שוב מאוחר יותר."
      alert("שגיאה: " + errorMsg)
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="modal-particles" ref={particlesRef}></div>
      <div className="login-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="סגור">
          <span className="sr-only">סגור</span>
        </button>
        <h2 data-text="התחברות">התחברות</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">דוא"ל:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="הזן את כתובת הדוא״ל שלך"
              disabled={isLoading || showSuccess}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">סיסמה:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="הזן את הסיסמה שלך"
              disabled={isLoading || showSuccess}
            />
          </div>
          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || showSuccess}
          >
            {isLoading ? "מתחבר..." : "התחבר"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            אין לך חשבון? <a href="/register">הירשם עכשיו</a>
          </p>
        </div>
        <div className={`success-message ${showSuccess ? "active" : ""}`}>
          <div className="success-icon">✓</div>
          <h3 className="success-title">התחברות הצליחה!</h3>
          <p className="success-text">מעביר אותך לעמוד הקורות חיים...</p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
