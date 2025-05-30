import { useContext} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Register from "./components/Register";
import CVs from "./components/CVs";
import DeleteFileCV from "./components/DeleteFileCV";
import AllTemplates from "./components/AllTemplates";
import HomePage from "./components/HomePage";
import CreateCV from "./components/CreateCV/CreateCV";
import ApiWithAuth from "./components/ApiWithAuth";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from "./components/Navbar";
import UpdateCV from "./components/UpdateCV/UpdateCV";
import CoverLetterGenerator from "./components/ApiWithAuth";

const App = () => {
  const { login } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register onRegister={login} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/delete/:fileId" element={<DeleteFileCV />} />
          <Route path="/all-templates" element={<AllTemplates />} />
          <Route path="/create-cv" element={<CreateCV />} />
          <Route path="/ApiWithAuth" element={<ApiWithAuth />} />
          <Route path="/update-cv" element={<UpdateCV />} />
          <Route path="/api" element={<CoverLetterGenerator />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
