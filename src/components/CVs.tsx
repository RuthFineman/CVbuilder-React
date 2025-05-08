import { useEffect, useState } from "react";
import UpdateFileCV from "./UpdateCV";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CVs = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFileData, setSelectedFileData] = useState<any | null>(null);
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

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
            const response = await axios.get("https://localhost:7020/file-cv/user-files", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                timeout: 5000,
            });
            console.log("🔎 קבצים מהשרת:", response.data);
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

    const handleCreateNewCV = () => {
        if (files.length >= 5) {
            alert("ניתן ליצור עד 5 קבצי קורות חיים בלבד.");
            return;
        }
        navigate('/all-templates');
    };
    const handleLogout = () => {
        // מחיקת token ו-userId
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        // הפניית המשתמש לדף הבית
        navigate("/"); 
    };
    return (
        <>
            <button onClick={handleCreateNewCV}>יצירת קו"ח חדשים</button>

            {selectedFileData ? (
                <UpdateFileCV
                    file={selectedFileData}
                    onClose={() => setSelectedFileData(null)}
                    onUpdate={fetchUserFiles}
                />
            ) : (
                <div>
                    {loading ? (
                        <div>טוען קבצים...</div>
                    ) : error ? (
                        <div>שגיאה: {error}</div>
                    ) : (
                        <div>
                            <h3>קבצים שלך:</h3>
                            {files.length > 0 ? (
                                <ul>
                                    {files.map(file => (
                                        <li key={file.id ?? file.path}>
                                            <p>Path: {file.path}</p>
                                            <button onClick={() => {
                                                console.log("נבחר קובץ לעדכון:", file);
                                                setSelectedFileData(file);
                                            }}>עדכן</button>

                                            <Link to={`/delete/${file.id}`}>
                                                <button>🗑 מחק</button>
                                            </Link>

                                            <button onClick={() => setSelectedPdf(file.path)}>הצג PDF</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div>אין קבצים זמינים</div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {selectedPdf && (
                <div>
                    <h3>הצגת PDF:</h3>
                    <iframe
                        src={`https://cvfilebuilder.s3.amazonaws.com/${selectedPdf}`}
                        width="600"
                        height="500"
                        title="PDF Viewer"
                    />
                    <button onClick={() => setSelectedPdf(null)}>סגור</button>
                </div>
            )}
               <button onClick={handleLogout}>התנתקות</button>
        </>
    );
};

export default CVs;
