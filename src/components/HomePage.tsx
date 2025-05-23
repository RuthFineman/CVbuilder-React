
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CVs from "./CVs";
import "../styles/HomePage.css"; // Import the new CSS file

const HomePage = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            {/* Navigation Header */}
            <div className="nav-header">
                <button 
                    className="sign-in-btn"
                    onClick={() => isLoggedIn ? logout() : navigate("/login")}
                >
                    {isLoggedIn ? "התנתקות" : "התחברות"}
                </button>
                <div className="nav-links">
                    <span className="nav-link" onClick={() => navigate("/")}>בית</span>
                    {/* <span className="nav-link" onClick={() => navigate("/about")}>אודות</span> */}
                    {/* <span className="nav-link" onClick={() => navigate("/contact")}>צור קשר</span> */}
                    {/* <span className="nav-link" onClick={() => navigate("/pricing")}>מחירים</span> */}
                </div>
            </div>

            {/* Animated Background Particles */}
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

            {/* Flowing Lines */}
            <div className="flow-lines">
                <svg className="curved-line" width="300" height="200">
                    <path d="M 50 50 Q 150 20 250 50 Q 200 100 150 120 Q 100 80 50 50" 
                          className="curved-line" />
                </svg>
            </div>

            {/* 3D Isometric Visual */}
            <div className="main-visual">
                <div className="iso-container">
                    <div className="iso-layer"></div>
                    <div className="iso-layer"></div>
                    <div className="iso-layer"></div>
                    <div className="iso-layer"></div>
                </div>
            </div>

            {/* Geometric Patterns */}
            <div className="geo-pattern">
                <div className="diamond"></div>
                <div className="diamond"></div>
                <div className="diamond"></div>
                <div className="diamond"></div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <h1 className="logo-text">CV BUILDER</h1>
                
                <h2 className="hero-title">
                    {/* קורות חיים מקצועיות / דיגיטליות */}
לוקח רק 5 שניות                 
                    <br />
                    {/* בחר תבנית מתאימה */}
                    לעבור על הקורות חיים שלך
                    <br />
                    {/* פתרון מודרני! */}
                    {/* והורד את קורות החיים שלך תוך זמן קצר. */}
                    כתוב אותם היטב
                </h2>
                {/* <p className="hero-subtitle">
                    לוקח רק 5 שניות לעבור על קורות החיים שלך, כתוב אותם היטב
                </p> */}
                <p className="hero-description">
                    צור קורות חיים מרשימות עם הטכנולוגיה החדישה ביותר. 
                    עיצוב מקצועי, תבניות מתקדמות ותוצאות מושלמות.
                </p>
                {isLoggedIn ? (
                    <div className="cv-section">
                        <CVs />
                    </div>
                ) : (
                    <div className="btn-container">
                        <button 
                            onClick={() => navigate("/register")} 
                            className="btn btn-primary"
                        >
                            התחל עכשיו
                        </button>
                        <button 
                            onClick={() => navigate("/login")} 
                            className="btn btn-secondary"
                        >
                            למד עוד
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;