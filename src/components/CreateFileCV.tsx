
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";

const CreateFileCV = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [summary, setSummary] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const location = useLocation();
    const selectedFileIndex = location.state?.selectedFileIndex;
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedFileIndex !== undefined) {
            console.log("המשתמש בחר קובץ מספר:", selectedFileIndex);
        }
    }, [selectedFileIndex]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setError("אין טוקן");
            return;
        }

        const fileCV = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: phone,
            Summary: summary,
            Skills: skills,
        };

        try {
            await axios.post("https://localhost:7020/api/FileCV/add", fileCV, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setSuccess("הקובץ נוצר בהצלחה!");
            setError(null);
        } catch (err: any) {
            setError("שגיאה לא צפויה");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>שם פרטי:</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <label>שם משפחה:</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                    <label>אימייל:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>טלפון:</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <label>סיכום:</label>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
                </div>
                <div>
                    <label>כישורים:</label>
                    <input type="text" value={skills.join(", ")} onChange={(e) => setSkills(e.target.value.split(", "))} />
                </div>
                <button type="submit">שלח</button>
                {error && <div style={{ color: "red" }}>{error}</div>}
                {success && <div style={{ color: "green" }}>{success}</div>}
            </form>
        </div>
    );
};

export default CreateFileCV;
