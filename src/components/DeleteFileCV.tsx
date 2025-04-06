import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const DeleteFileCV = () => {
    const { fileId } = useParams(); // שולפים את ה-ID מה-URL
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteFile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://localhost:7020/upload/remove/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("✅ הקובץ נמחק בהצלחה");
            navigate("/cvs"); // חזרה לעמוד קבצים לאחר המחיקה
        } catch (error) {
            console.error("❌ שגיאה במחיקת הקובץ", error);
            alert("אירעה שגיאה. נסי שוב.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ direction: "rtl" }}>
            <h2>מחיקת קובץ</h2>
            <button onClick={deleteFile} disabled={loading}>
                {loading ? "מוחק..." : "מחק"}
            </button>
            <button onClick={() => navigate("/cvs")} style={{ marginRight: "10px" }}>
                בטלי
            </button>
        </div>
    );
};

export default DeleteFileCV;
