import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister }: { onRegister: (token: string) => void }) => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        let formErrors: { [key: string]: string } = {};
        if (!fullName) formErrors.fullName = "זהו שדה חובה";
        if (!email) formErrors.email = "זהו שדה חובה";
        if (!password) formErrors.password = "זהו שדה חובה";
        if (!confirmPassword) formErrors.confirmPassword = "זהו שדה חובה";
        if (password !== confirmPassword) {
            alert("הסיסמה ואימות הסיסמה אינן תואמות");
            return;
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const response = await axios.post('https://localhost:7020/api/Users/register', {
                fullName,
                email,
                password,
            });
            const token = response.data.token; // קבלת הטוקן מהשרת
            localStorage.setItem("token", token);
            const userId = response.data.id;

            localStorage.setItem("userId", userId);
            onRegister(token); // קריאה לפונקציה שהועברה כפרופס
            navigate('/CVs'); // מעבר לקומפוננטת CVs
        } catch (error) {
            console.error("שגיאה בשליחה לשרת", error);
            alert("לא ניתן להשלים את ההרשמה, נסה שוב מאוחר יותר.");
        }
    };

    return (
        <>
            <div>
                <button type="button" onClick={() => navigate("/cvs")}>
                    ⬅️
                </button>
                <h2>הרשמה</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>שם מלא:</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        {errors.fullName && <span style={{ color: "red" }}>{errors.fullName}</span>}
                    </div>
                    <div>
                        <label>דוא"ל:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
                    </div>
                    <div>
                        <label>סיסמה:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
                    </div>
                    <div>
                        <label>אימות סיסמה:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        {errors.confirmPassword && <span style={{ color: "red" }}>{errors.confirmPassword}</span>}
                    </div>
                    <button type="submit">הרשמה</button>
                </form>
            </div>
        </>
    );
}

export default Register;
