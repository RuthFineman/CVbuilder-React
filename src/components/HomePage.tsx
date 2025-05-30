import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import LoginModal from "./LoginModal";

const HomePage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false)
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleLogin = () => {
        navigate("/cvs")
    }

    return (
        <div className="homepage-container">
            <div className="nav-header">
                <button
                    className="sign-in-btn"
                    onClick={() => isLoggedIn ? logout() : navigate("/login")}
                >
                </button>
            </div>
            <div className="particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="cyan-particle"></div>
                <div className="cyan-particle"></div>
                <div className="cyan-particle"></div>
            </div>
            <div className="flow-lines">
                <svg className="curved-line" width="300" height="200">
                    <path d="M 50 50 Q 150 20 250 50 Q 200 100 150 120 Q 100 80 50 50"
                        className="curved-line" />
                </svg>
            </div>
            <div className="main-visual">
                <div className="iso-container">
                    <div className="iso-layer"></div>
                    <div className="iso-layer"></div>
                    <div className="iso-layer"></div>
                    <div className="iso-layer"></div>
                </div>
            </div>
            <div className="geo-pattern">
                <div className="diamond"></div>
                <div className="diamond"></div>
                <div className="diamond"></div>
                <div className="diamond"></div>
            </div>
            <div className="main-content">
                <h1 className="logo-text">CV BUILDER</h1>

                <h2 className="hero-title">
                    לוקח רק 5 שניות
                    <br />
                    לעבור על הקורות חיים שלך.
                    <br />
                    כתוב אותם היטב.
                </h2>
                <p className="hero-description">
                    צור קורות חיים מרשימות עם הטכנולוגיה החדישה ביותר.
                    עיצוב מקצועי, תבניות מתקדמות ותוצאות מושלמות.
                </p>
                {isLoggedIn ? (
                    <div className="btn-container">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/cvs")}
                        >
                            עמוד קורות החיים שלי
                        </button>
                    </div>
                ) : (
                    <div className="btn-container">
                        <button
                            onClick={() => navigate("/register")}
                            className="btn btn-primary"
                        >
                            הרשמה
                        </button>
                        <button className="btn btn-secondary" onClick={() => setShowLoginModal(true)}>
                            התחברות
                        </button>
                    </div>

                )}
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
        </div>
    );
};

export default HomePage;