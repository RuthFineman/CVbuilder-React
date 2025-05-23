// App.tsx
import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import CVs from "./components/CVs";
import DeleteFileCV from "./components/DeleteFileCV";
import AllTemplates from "./components/AllTemplates";
import HomePage from "./components/HomePage";
import ResumeDisplay from "./components/ResumeDisplay";
import CreateCV from "./components/CreateCV";
import ResumeDisplayUpdate from "./components/ResumeDisplayUpdate";
import ApiWithAuth from "./components/ApiWithAuth";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const { login } = useContext(AuthContext);


  const [formData, setFormData] = useState<any>(null);

  const handleSubmit = (data: any) => {
    setFormData(data);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register onRegister={login} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/delete/:fileId" element={<DeleteFileCV />} />
          <Route path="/all-templates" element={<AllTemplates />} />
          <Route path="/resume-display-update" element={<ResumeDisplayUpdate />} />
          <Route path="/ApiWithAuth" element={<ApiWithAuth />} />
          <Route path="/resume-display" element={
            formData ? <ResumeDisplay data={formData} /> : <Navigate to="/createCV" />
          } />
          <Route path="/createCV" element={<CreateCV onSubmit={handleSubmit} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
