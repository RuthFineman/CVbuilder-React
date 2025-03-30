import axios from "axios";
import { useState } from "react";

    const UpdateCV = ({ file, onClose, onUpdate }: { file: any, onClose: () => void, onUpdate: () => void }) => {
    const [formData, setFormData] = useState({
        name: file.name,
        firstName: file.firstName || "",
        lastName: file.lastName || "",
        email: file.email || "",
        phone: file.phone || "",
        summary: file.summary || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return;
        if (!file || !file.id) {
            alert("שגיאה: לא נמצא מזהה לקובץ.");
            return;
        }
        try {
            await axios.put(`https://localhost:7020/api/FileCV/modify/${file.id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            alert("העדכון בוצע בהצלחה!");
            onClose();
            onUpdate();
        } catch (error) {
            alert("שגיאה בעדכון הנתונים");
        }
    };

    return (
        <div>
            <h2>עדכון קורות חיים</h2>
            <form onSubmit={handleSubmit}>
                <label>שם:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />

                <label>שם פרטי:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />

                <label>שם משפחה:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />

                <label>אימייל:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />

                <label>טלפון:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

                <label>תקציר:</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange}></textarea>

                <button type="submit">עדכן</button>
                <button type="button" onClick={onClose}>ביטול</button>
            </form>
        </div>
    );
};

export default UpdateCV;
