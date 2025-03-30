import axios from "axios";
import { useEffect, useState } from "react";
import UpdateFileCV from "./UpdateCV";
import { useNavigate } from "react-router-dom"; 
import AllTemplates from "./AllTemplates";
const CVs = ({ onLogout }: { onLogout: () => void }) => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showChooswTemplate, setShowChooswTemplate] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any | null>(null);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout();
    };
    const fetchUserFiles = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("לא נמצא אסימון התחברות");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get("https://localhost:7020/api/FileCV/user-files", {
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
        const token = localStorage.getItem("token");
        if (!token) {
            onLogout();
        } else {
            fetchUserFiles();
        }
    }, [onLogout]);
    
    return (
        <>
            <button onClick={() => setShowChooswTemplate(true)}>יצירת קו"ח חדשים</button>
            <button onClick={handleLogout}>התנתק</button>

            {showChooswTemplate ? (<AllTemplates />) : selectedFile ? (<UpdateFileCV file={selectedFile} onClose={() => setSelectedFile(null)} onUpdate={fetchUserFiles} />
                
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
                                            {file.summary}
                                            <button onClick={() => setSelectedFile(file)}>עדכן</button>
                                            <button onClick={() => navigate(`/delete-file/${file.id}`)}>מחק</button>
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
        </>
    );
};

export default CVs;
