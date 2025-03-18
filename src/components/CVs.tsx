import axios from "axios";
import { useEffect, useState } from "react";
import CreateFileCV from "./CreateFileCV";
import UpdateFileCV from "./UpdateCV";

const CVs = ({ onLogout }: { onLogout: () => void }) => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateCV, setShowCreateCV] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            onLogout();
        } else {
            fetchUserFiles(token);
        }
    }, [onLogout]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout();
    };

    const fetchUserFiles = async (token: string) => {
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

    return (
        <>
            <button onClick={() => setShowCreateCV(true)}>יצירת קו"ח חדשים</button>
            <button onClick={handleLogout}>התנתק</button>

            {showCreateCV ? (
                <CreateFileCV />
            ) : selectedFile ? (
                <UpdateFileCV file={selectedFile} onClose={() => setSelectedFile(null)} />
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
                                            {file.name}
                                            <button onClick={() => setSelectedFile(file)}>עדכן</button>
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
