import { useContext, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'
import { AuthContext } from "../contexts/AuthContext";

const Register = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { login } = useContext(AuthContext);
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
            const response = await axios.post(`${baseUrl}/api/Users/register`, {
                fullName,
                email,
                password,
            });
            const token = response.data.token;
            localStorage.setItem("token", token);
            const userId = response.data.id;

            localStorage.setItem("userId", userId);
            login(token);
            navigate('/CVs');
        } catch (error) {
            console.error("שגיאה בשליחה לשרת", error);
            alert("לא ניתן להשלים את ההרשמה, נסה שוב מאוחר יותר.");
        }
    };
    return (
        <>
            <div className="register-container">
                <div className="geometric-decoration square"></div>
                <div className="geometric-decoration rectangle"></div>
                <div className="geometric-decoration triangle"></div>
                <div className="register-card">
                    <div className="register-header">
                        <button className="back-button" type="button" onClick={() => navigate("/cvs")}>                   
                        </button>
                        <h1 className="register-title">הרשמה</h1>
                        <form className="register-form" onSubmit={handleSubmit} >
                            <div className="form-group">
                                <label htmlFor="fullName">שם מלא:</label>

                                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                {errors.fullName && <div className="error-message">{errors.fullName}</div>}

                            </div>
                            <div className="form-group">
                                <label htmlFor="email">דוא"ל:</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                {errors.email && <div className="error-message">{errors.email}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">סיסמה:</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                {errors.password && <div className="error-message">{errors.password}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">אימות סיסמה:</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                            </div>
                            <button type="submit" className="submit-button">הרשמה</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Register;
