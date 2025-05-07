import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const DeleteFileCV = () => {
    const { fileId } = useParams(); // ID מה-URL
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteFile = async () => {
        // const confirmDelete = window.confirm("האם את בטוחה שברצונך למחוק את הקובץ?");
        // if (!confirmDelete) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://localhost:7020/upload/remove/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("✅ הקובץ נמחק בהצלחה");
            navigate("/cvs"); // חזרה לרשימת הקבצים
        } catch (error) {
            console.error("❌ שגיאה במחיקת הקובץ", error);
            alert("אירעה שגיאה בעת מחיקת הקובץ. נסי שוב.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ direction: "rtl", padding: "2rem" }}>
            <h2>מחיקת קובץ</h2>
            <p>האם את בטוחה שברצונך למחוק את הקובץ?</p>
            <button onClick={deleteFile} disabled={loading} style={{ backgroundColor: "#d32f2f", color: "white", padding: "0.5rem 1rem", marginRight: "10px", border: "none", borderRadius: "5px" }}>
                {loading ? "מוחק..." : "מחק קובץ"}
            </button>
            <button onClick={() => navigate("/cvs")} style={{ padding: "0.5rem 1rem", border: "1px solid gray", borderRadius: "5px" }}>
                בטלי
            </button>
        </div>
    );
};

export default DeleteFileCV;
