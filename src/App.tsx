import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Register from "./components/Register";
import CVs from "./components/CVs";
import DeleteFileCV from "./components/DeleteFileCV";
import AllTemplates from "./components/AllTemplates";
import HomePage from "./components/HomePage";
import CreateCV from "./components/CreateCV/CreateCV";
import { AuthProvider } from "./contexts/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from "./components/Navbar";
import UpdateCV from "./components/UpdateCV/UpdateCV";
import CoverLetterGenerator from "./components/CoverLetterBot";

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/delete/:fileId" element={<DeleteFileCV />} />
          <Route path="/all-templates" element={<AllTemplates />} />
          <Route path="/create-cv" element={<CreateCV />} />
          <Route path="/update-cv" element={<UpdateCV />} />
          <Route path="/cover-letter-bot" element={<CoverLetterGenerator />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
