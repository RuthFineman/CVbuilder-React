import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CVs from "./components/CVs";
import DeleteFileCV from "./components/DeleteFileCV";
import AllTemplates from "./components/AllTemplates";
import HomePage from "./components/HomePage";
import ResumeDisplay from "./components/ResumeDisplay";
import CreateCV from "./components/CreateCV";
import FileUpload from "./components/PDFUploader";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ResumeDisplayUpdate from "./components/ResumeDisplayUpdate";
import UpdateCV from "./components/UpdateCV";
import { CssProvider } from "./contexts/CssContext";
// יצירת AuthContext

// הוסף את השורה הבאה לייצוא AuthContext
export const AuthContext = createContext({
  isLoggedIn: false,
  token: null as string | null,
  login: (token: string) => { },
  logout: () => { },
});

// שאר הקוד נשאר כפי שהוא

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
const CVContext = createContext<{
  fileCV: any;
  setFileCV: React.Dispatch<React.SetStateAction<any>>;
} | undefined>(undefined);

// const CVProvider = ({ children }: { children: React.ReactNode }) => {
//   const [fileCV, setFileCV] = useState({
//     firstName: '',
//     lastName: '',
//     role: '',
//     email: '',
//     phone: '',
//     summary: '',
//     workExperiences: [] as any[],
//     educations: [] as any[],
//     languages: [] as any[],
//     skills: [] as string[],
//   });

//   return (
//     <CVContext.Provider value={{ fileCV, setFileCV }}>
//       {children}
//     </CVContext.Provider>
//   );
// };

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
};


const App = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>(null); // הוספת סוג כללי

  const handleSubmit = (data: any) => {
    setFormData(data);
  };

  const { login } = useContext(AuthContext);

  return (

    <AuthProvider>
      <CssProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register onRegister={login} />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/delete/:fileId" element={<DeleteFileCV />} />
          <Route path="/all-templates" element={<AllTemplates />} />
          {/* <Route path="/update/:id" /> */} 
          {/* <Route path="/update" element={<UpdateCV />} /> */}


          <Route path="/resume-display-update" element={<ResumeDisplayUpdate />} />
          <Route path="/resume-display" element={
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
      </CssProvider>
    </AuthProvider>
  );
};
export default App;
