import axios from "axios";
import { useEffect, useState } from "react";
import UpdateFileCV from "./UpdateCV";
import { useNavigate } from "react-router-dom"; 
import AllTemplates from "./AllTemplates";

const CVs = () => {
    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showChooseTemplate, setShowChooseTemplate] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
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
            const response = await axios.get(`https://localhost:7020/api/FileCV/user-files?userId=${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                timeout: 5000,
            });
            console.log("Response from server:", response.data);
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
    
    return (
        <>
            <button onClick={() => setShowChooseTemplate(true)}>יצירת קו"ח חדשים</button>

            {showChooseTemplate ? (
                <AllTemplates />
            ) : selectedFile ? (
                <UpdateFileCV file={selectedFile} onClose={() => setSelectedFile(null)} onUpdate={fetchUserFiles} />
            ) : (
                <>
                    {loading ? (
                        <div>טוען קבצים...</div>
                    ) : error ? (
                        <div>שגיאה: {error}</div>
                    ) : (
                        <div>
                            <h3>קבצים שלך:</h3>
                            {files.length > 0 ? (
                                <ul>
                                    {files.map((file, index) => (
                                        <li key={index}>
                                            {file}
                                            <button onClick={() => setSelectedFile(file)}>עדכן</button>
                                            <button onClick={() => navigate(`/delete-file/${file}`)}>מחק</button>
                                            <button onClick={() => setSelectedPdf(file)}>הצג PDF</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div>אין קבצים זמינים</div>
                            )}
                        </div>
                    )}
                </>
            )}

            {selectedPdf && (
                <div>
                    <h3>הצגת PDF:</h3>
                    <iframe 
                        src={`https://cvfilebuilder.s3.eu-north-1.amazonaws.com/115/%D7%92.pdf`} 
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
