// import React, { useEffect, useState } from 'react';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import Login from './components/Login';
// import Register from './components/Register';
// import CVs from './components/CVs';
// import HomePage from './components/homePage';
// import DeleteFileCV from './components/DeleteFileCV';
// import AllTemplates from './components/AllTemplates';
// import CreateFileCV from './components/CreateFileCV';

// const App = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [token, setToken] = useState<string | null>(null);
//     const [files, setFiles] = useState<string[]>([]);

//     useEffect(() => {
//         const storedToken = localStorage.getItem("token");
//         if (storedToken) {
//             setToken(storedToken);
//             setIsLoggedIn(true);
//         }
//     }, []);

//     const handleLogin = (token: string) => {
//         setToken(token);
//         setIsLoggedIn(true);
//     };

//     const handleLogout = () => {
//         setToken(null);
//         setIsLoggedIn(false);
//         localStorage.removeItem("token");
//     };

//     return (
//         <Router>
//             <div>
//                 <Routes>
//                     <Route path="/" element={<HomePage />} />
//                     <Route path="/cvs" element={isLoggedIn ? (<CVs onLogout={handleLogout} /> ) : ( <><Login onLogin={handleLogin} /><Register onRegister={handleLogin} /> </>) } />
//                     <Route path="/register" element={<Register onRegister={handleLogin} />} />
//                     <Route path="/delete-file/:id" element={<DeleteFileCV />} />
//                     <Route path="/create-file-cv" element={<CreateFileCV  />} />
//                     <Route path="/all-templates" element={<AllTemplates  />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// };

// export default App;
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import CVs from './components/CVs';
import DeleteFileCV from './components/DeleteFileCV';
import AllTemplates from './components/AllTemplates';
import CreateFileCV from './components/CreateFileCV';
import HomePage from './components/homePage';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
        }
    }, []);

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
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cvs" element={isLoggedIn ? <CVs onLogout={handleLogout} /> : <><Login onLogin={handleLogin} /><Register onRegister={handleLogin} /></>} />
                    <Route path="/register" element={<Register onRegister={handleLogin} />} />
                    <Route path="/delete-file/:id" element={<DeleteFileCV />} />
                    <Route path="/create-file-cv" element={<CreateFileCV />} />
                    <Route path="/all-templates" element={<AllTemplates />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
