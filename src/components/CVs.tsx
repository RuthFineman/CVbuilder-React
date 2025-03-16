import axios from "axios";
import { useEffect, useState } from "react";

const CVs = ({ onLogout }: { onLogout: () => void }) => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const token = localStorage.getItem("token");
        if (!token) {
            onLogout(); // אם אין טוקן, התנתק
        } else {
            fetchUserFiles(token); // קריאה לפונקציה להביא את הקבצים
        }
    }, [onLogout]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout(); // קריאה לפונקציה שהועברה כפרופס
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
            if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
                setError("הבקשה לקחה יותר מדי זמן. אנא נסה שוב מאוחר יותר.");
            } else {
                setError(err.response?.data?.message || "שגיאה בטעינת הקבצים");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>טוען קבצים...</div>;
    }

    if (error) {
        return <div>שגיאה: {error}</div>;
    }

    return (
        <>
            <div>יצירת קו"ח חדשים</div>
            <button onClick={handleLogout}>התנתק</button>
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
                                <li key={index}>{file.Name}</li>
                            ))}
                        </ul>
                    ) : (
                        <div>אין קבצים זמינים</div>
                    )}
                </div>
            )}
        </>
    );
    
};

export default CVs;
