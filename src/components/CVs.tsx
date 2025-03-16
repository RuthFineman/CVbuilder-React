import { useEffect } from "react";

const CVs = ({ onLogout }: { onLogout: () => void }) => {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            onLogout(); // אם אין טוקן, התנתק
        }
    }, [onLogout]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout(); // קריאה לפונקציה שהועברה כפרופס
    }

    return (
        <>
            <div>יצירת קו"ח חדשים</div>
            <button onClick={handleLogout}>התנתק</button>
        </>
    );
}

export default CVs;
