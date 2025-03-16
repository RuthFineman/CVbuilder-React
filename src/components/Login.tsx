import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/CVs"); 
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7020/api/Users/login', {
                email,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);
            onLogin(token); // קריאה לפונקציה שהועברה כפרופס
            navigate('/CVs'); // מעבר לקומפוננטת CVs

        } catch (error: any) {
            console.error('Login error', error);
            alert("שגיאה בהתחברות: " + error.response?.data || "נסה שוב מאוחר יותר.");
        }
    };

    return (
        <>
            <h2>התחברות</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>דוא"ל:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>סיסמה:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">התחבר</button>
            </form>
        </>
    );
};

export default Login;
