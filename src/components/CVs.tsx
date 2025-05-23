import { useEffect, useState } from "react";
import UpdateFileCV from "./UpdateCV";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import '../styles/CVs.css'
const CVs = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFileData, setSelectedFileData] = useState<any | null>(null);
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const checkIfBlocked = async () => {
        const userId = localStorage.getItem("userId");
        // console.log("🔍 userId מה-localStorage:", userId);
        if (!userId) {
            console.warn("⚠️ אין userId - מניחים שהמשתמש חסום");
            return true;
        }
        try {
            const response = await axios.get(`${baseUrl}/api/Users/is-blocked/${userId}`);
            return response.data === true;
        } catch (err) {
            return true;
        }
    };
    const fetchUserFiles = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            setError("לא נמצא אסימון התחברות או userId");
            setLoading(false);
            navigate("/");
            return;
        }
        try {
            const response = await axios.get(`${baseUrl}/file-cv/user-files`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                timeout: 5000,
            });
            setFiles(response.data);
        } catch (err: any) {
            setError("שגיאה בטעינת הקבצים");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserFiles();
    }, []);

    const handleCreateNewCV = async () => {
        const isBlocked = await checkIfBlocked();
        if (isBlocked) {
            alert("הגישה נחסמה. אינך יכול ליצור קבצים מכיוון שאתה חסום על ידי המערכת.");
            return;
        }
        if (files.length >= 5) {
            alert("ניתן ליצור עד 5 קבצי קורות חיים בלבד.");
            return;
        }
        navigate('/all-templates');
    };
    return (
        <>
            <div className="cvs-container">
                <div className="geometric-decoration square"></div>
                <div className="geometric-decoration rectangle"></div>
                <div className="geometric-decoration triangle"></div>
                <div className="cvs-header">
                    <h2 className="cvs-title">קורות החיים שלי</h2>
                    <button className="create-cv-button" onClick={handleCreateNewCV}>
                        יצירת קו"ח חדשים <span>+</span>
                    </button>
                </div>
                {selectedFileData ? (
                    <div className="update-section">
                        <UpdateFileCV
                            file={selectedFileData}
                            onClose={() => setSelectedFileData(null)}
                            onUpdate={fetchUserFiles}
                        /></div>
                ) : (
                    <div>
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>טוען קבצים...</p>
                            </div>
                        ) : error ? (
                            <div className="error-container">שגיאה: {error}</div>
                        ) : (
                            <div className="files-section">
                                <h3>קבצים שלך:</h3>
                                {files.length > 0 ? (
                                    <ul className="files-list">
                                        {files.map(file => (
                                            <li key={file.id ?? file.path} className="file-item">
                                                <p className="file-path"> {file.path}</p>
                                                <div className="file-actions">
                                                    <button className="update-button" onClick={async () => {
                                                        const isBlocked = await checkIfBlocked();
                                                        if (isBlocked) {
                                                            alert("הגישה נחסמה. אינך יכול לעדכן קבצים מכיוון שאתה חסום על ידי המערכת.");
                                                            return;
                                                        }
                                                        console.log("נבחר קובץ לעדכון:", file);
                                                        setSelectedFileData(file);
                                                    }}>
                                                        עדכן
                                                    </button>
                                                    <button className="delete-button" onClick={async () => {
                                                        const isBlocked = await checkIfBlocked();
                                                        if (isBlocked) {
                                                            alert("הגישה נחסמה. אינך יכול למחוק קבצים מכיוון שאתה חסום על ידי המערכת.");
                                                            return;
                                                        }
                                                        navigate(`/delete/${file.id}`);
                                                    }}>
                                                        🗑 מחק
                                                    </button>
                                                    {/* <button className="view-button" onClick={() => setSelectedPdf(file.path)}>
                                                        הצג PDF
                                                    </button> */}
                                                </div>
                                                <img
                                                    src={`https://cvfilebuilder.s3.amazonaws.com/${file.path}`}
                                                    alt={`תצוגה מקדימה של ${file.path}`}
                                                    className="small-preview-image"
                                                />

                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="no-files">אין קבצים זמינים</div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {/* {selectedPdf && (
                    <div className="pdf-viewer">
                        <h3>הצגת PDF:</h3>
                        <iframe
                            src={`https://cvfilebuilder.s3.amazonaws.com/${selectedPdf}`}
                            className="file-preview-frame"
                            title={`Preview of ${selectedPdf}`}
                            width="400"
                            height="300"
                        ></iframe>
                        <button className="close-button" onClick={() => setSelectedPdf(null)}>סגור</button>
                    </div>
                )} */}
            </div></>)
}
export default CVs;









