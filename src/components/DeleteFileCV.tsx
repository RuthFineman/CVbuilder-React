import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  

const DeleteFileCV = () => {
    const { id } = useParams<{ id: string }>();  
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(false);

    const deleteFile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("לא נמצא אסימון התחברות");
            return;
        }
        setLoading(true);

        try {
            const response = await axios.delete(`https://localhost:7020/api/FileCV/remove/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                navigate("/cvs"); 
            }
        } catch (err: any) {
            setError("שגיאה במחקה הקובץ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            setError("לא נמצא מזהה הקובץ");
        }
    }, [id]);

    return (
        <div>
            {loading ? (
                <div>מתבצע מחיקה...</div>
            ) : (
                <div>
                    <h3>האם אתה בטוח שברצונך למחוק את הקובץ?</h3>
                    <button onClick={deleteFile}>מחק קובץ</button>
                    <button onClick={() => navigate("/cvs")}>חזור לדף הקבצים</button> {/* עדכון לשימוש ב-navigate */}
                    {error && <div>שגיאה: {error}</div>}
                </div>
            )}
        </div>
    );
};

export default DeleteFileCV;
