"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "../styles/LoginModal.css"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (token: string) => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setPassword("")
      setIsLoading(false)
      setShowSuccess(false)
    } else {
      // Create particles when modal opens
      createParticles()
      // Add 3D tilt effect
      addTiltEffect()
    }
  }, [isOpen])

  // Create floating particles
  const createParticles = () => {
    if (!particlesRef.current) return

    particlesRef.current.innerHTML = ""

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"

      // Random properties
      const size = Math.random() * 4 + 2
      const delay = Math.random() * 15
      const duration = Math.random() * 20 + 10
      const randomX = Math.random() * 200 - 100

      // Apply styles
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.bottom = "-10px"
      particle.style.animationDelay = `${delay}s`
      particle.style.animationDuration = `${duration}s`
      particle.style.setProperty("--random", randomX.toString())

      particlesRef.current.appendChild(particle)
    }

    // Add energy field
    const energyField = document.createElement("div")
    energyField.className = "energy-field"
    particlesRef.current.appendChild(energyField)

    // Add floating cubes
    for (let i = 0; i < 2; i++) {
      const cube = document.createElement("div")
      cube.className = "floating-cube"
      particlesRef.current.appendChild(cube)
    }
  }

  // Add 3D tilt effect to modal
  const addTiltEffect = () => {
    if (!modalRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!modalRef.current) return

      const rect = modalRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateY = (x - centerX) / 20
      const rotateX = (centerY - y) / 20

      modalRef.current.style.transform = `
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale(1) 
        translateZ(0px)
      `
    }

    const handleMouseLeave = () => {
      if (!modalRef.current) return
      modalRef.current.style.transform = `
        rotateX(0deg) 
        rotateY(0deg) 
        scale(1) 
        translateZ(0px)
      `
    }

    modalRef.current.addEventListener("mousemove", handleMouseMove)
    modalRef.current.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener("mousemove", handleMouseMove)
        modalRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }

  // Close modal on escape key
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

      // Save to localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("userId", userId)

      // Show success message
      setShowSuccess(true)

      // Wait 2 seconds then close and redirect
      setTimeout(() => {
        onLogin(token)
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
      {/* Particles container */}
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

        {/* Success Message */}
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
