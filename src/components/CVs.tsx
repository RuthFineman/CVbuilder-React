import axios from "axios";
import { useEffect, useState } from "react";
import UpdateFileCV from "./UpdateCV";
import { useNavigate } from "react-router-dom";
import AllTemplates from "./AllTemplates";

const CVs = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showChooseTemplate, setShowChooseTemplate] = useState(false);
    const [selectedFileData, setSelectedFileData] = useState<any | null>(null);

    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchUserFiles = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            setError("לא נמצא אסימון התחברות או userId");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`https://localhost:7020/upload/user-files?userId=${userId}`, {
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
    // בדוק את זה
    // הקוד שלך עם שינוי בניתוב
    const handleDelete = async (filePath: string) => {
        try {
            const response = await axios.get("https://localhost:7020/upload/get-file-id-by-url", {
                params: { fileUrl: filePath }
            });
            const fileId = response.data.id;
            console.log("🔍 מזהה שנשלף:", fileId);

            // ניווט לדף מחיקת הקובץ עם ה-ID (ה-URL כולל את ה-ID)
            navigate(`/delete-file/${fileId}`);
        } catch (err) {
            console.error("❌ שגיאה באחזור מזהה הקובץ", err);
            alert("לא ניתן למצוא מזהה לקובץ. נסי שוב.");
        }
    };
    useEffect(() => {
        fetchUserFiles();
    }, []);
    return (
        <>
            <button onClick={() => setShowChooseTemplate(true)}>יצירת קו"ח חדשים</button>

            {showChooseTemplate ? (
                <AllTemplates />
            ) : selectedFileData ? (
                <UpdateFileCV file={selectedFileData} onClose={() => setSelectedFileData(null)} onUpdate={fetchUserFiles} />
              )
               : (
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
                                            {/* <button onClick={() => setSelectedFileData(file)}>עדכן</button> */}
                                            <button onClick={() => { console.log(file); setSelectedFileData(file); }}>עדכן</button>
                                            <button onClick={() => handleDelete(file.path)}>מחק</button>
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
        </>
    );
};

export default CVs;
