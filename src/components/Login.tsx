import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import '../styles/Login.css';
const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
 
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
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
            const response = await axios.post(`${baseUrl}/api/Users/login`, {
                email,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);
            const userId = response.data.id;
            console.log(userId);
            localStorage.setItem("userId", userId);
            onLogin(token); // קריאה לפונקציה שהועברה כפרופס
            navigate('/CVs'); // מעבר לקומפוננטת CVs

        } catch (error: any) {
            console.error('Login error', error);
            // תנסה לשלוף את ההודעה מהשרת אם יש
            const errorMsg =
              error.response?.data || "נסה שוב מאוחר יותר.";
            alert("שגיאה: " + errorMsg);
        }
        
    };

    return (
        <>
        <div className="login-container">
      <div className="geometric-decoration square"></div>
      <div className="geometric-decoration rectangle"></div>
      <div className="geometric-decoration triangle"></div>
      <div className="register-login-page">
          <button type="button" onClick={() => navigate("/CVs")}> 
        ⬅️
    </button>
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
            </div>
            </div>
            
        </>
    );
};

export default Login;
