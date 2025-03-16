import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CVs from './components/CVs';
import HomePage from './components/homePage';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const handleLogin = (token: string) => {
        setToken(token);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
    };

    return (
        <Router>
            <div>
                <HomePage />
                {isLoggedIn ? (
                    <CVs onLogout={handleLogout} />
                ) : (
                    <>
                        <Login onLogin={handleLogin} />
                        <Register onRegister={handleLogin} />
                    </>
                )}
            </div>
        </Router>
    );
};

export default App;
