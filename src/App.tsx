import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CVs from "./components/CVs";
import DeleteFileCV from "./components/DeleteFileCV";
import AllTemplates from "./components/AllTemplates";
import CreateFileCV from "./components/CreateFileCV";
import HomePage from "./components/HomePage";
import ResumeDisplay from "./components/ResumeDisplay";
import CreateCV from "./components/CreateCV";
import FileUpload from "./components/PDFUploader";

// יצירת AuthContext
const AuthContext = createContext({
  isLoggedIn: false,
  token: null as string | null,
  login: (token: string) => { },
  logout: () => { },
});



const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const isLoggedIn = Boolean(token);

  const handleLogin = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => {
  const { login, logout, isLoggedIn } = useContext(AuthContext);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState(null);


  const handleSubmit = (data: any) => {
    setFormData(data);  // שמור את המידע בלי לרוקן workExperiences
  };

  const handleUploadSuccess = (url: string) => {
    // התנהגות אחרי שההעלאה הושלמה בהצלחה
    console.log('File uploaded successfully. URL:', url);
  };
  return (
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register onRegister={login} />} />
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route path="/cvs" element={<CVs onLogout={logout} />} />
      <Route path="/delete-file/:id" element={<DeleteFileCV />} />
      <Route path="/create-file-cv" element={<CreateFileCV />} />
      <Route path="/all-templates" element={<AllTemplates />} />
      <Route
        path="/resume-display"
        element={
          formData ? (
            <ResumeDisplay data={formData} />  // מציג את קורות החיים אחרי שהנתונים הוזנו
          ) : (
            <Navigate to="/createCV" />  // אם אין נתונים, מעביר לעמוד יצירת קורות חיים
          )
        }
      />
      <Route
        path="/createCV"
        element={<CreateCV onSubmit={handleSubmit} />} 
      />
    </Routes>
  </Router>
  
  );
};

export default App;
