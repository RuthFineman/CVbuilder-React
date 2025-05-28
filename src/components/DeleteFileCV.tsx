import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import '../styles/DeleteFileCV.css'

const DeleteFileCV = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const { fileId } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteFile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${baseUrl}/file-cv/delete/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("✅ הקובץ נמחק בהצלחה");
            navigate("/cvs");
        } catch (error) {
            console.error("❌ שגיאה במחיקת הקובץ", error);
            alert("אירעה שגיאה בעת מחיקת הקובץ. נסי שוב.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal">
                {/* Animated Background Particles */}
                <div className="particles-bg">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="cyan-particle"></div>
                    <div className="cyan-particle"></div>
                </div>

                {/* Delete Icon */}
                <div className="delete-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </div>

                <h2 className="modal-title">מחיקת קובץ</h2>
                <p className="modal-message">האם את בטוחה שברצונך למחוק את הקובץ?</p>
                <p className="warning-text">⚠️ פעולה זו אינה ניתנת לביטול</p>

                <div className="button-container">
                    <button 
                        className="modal-btn btn-delete" 
                        onClick={deleteFile} 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                מוחק
                                <span className="loading-spinner"></span>
                            </>
                        ) : (
                            "מחק קובץ"
                        )}
                    </button>
                    <button 
                        className="modal-btn btn-cancel" 
                        onClick={() => navigate("/cvs")}
                        disabled={loading}
                    >
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteFileCV;