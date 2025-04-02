import React, { useContext } from "react";
import { AuthContext } from "../App"; // ודא שהנתיב נכון
import { useNavigate } from "react-router-dom";
import CVs from "./CVs";

const HomePage = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>לוקח רק 5 שניות לעבור על קורות החיים שלך, כתוב אותם היטב</h1>

            {isLoggedIn ? (<>
                <button onClick={logout} style={{ marginTop: "20px", padding: "10px 20px" }}>
                    התנתקות
                </button>
                <CVs /> </>
            ) : (
                <div style={{ marginTop: "20px" }}>
                    <button onClick={() => navigate("/login")} style={{ margin: "0 10px", padding: "10px 20px" }}>
                        התחברות
                    </button>
                    <button onClick={() => navigate("/register")} style={{ margin: "0 10px", padding: "10px 20px" }}>
                        הרשמה
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
