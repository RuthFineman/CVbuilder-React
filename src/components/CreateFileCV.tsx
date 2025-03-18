// import { useState } from "react";
// import axios from "axios";

// const CreateFileCV = () => {
//     const [name, setName] = useState("");
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [summary, setSummary] = useState("");
//     const [skills, setSkills] = useState<string[]>([]);
//     const [languages, setLanguages] = useState<string[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const token = localStorage.getItem("token");

//         if (!token) {
//             setError("לא נמצאה הכרה.");
//             return;
//         }

//         const fileCV = {
//             Name: name,
//             FirstName: firstName,
//             LastName: lastName,
//             Email: email,
//             Phone: phone,
//             Summary: summary,
//             Skills: skills,
//             Languages: languages,
//         };

//         try {
//             const response = await axios.post("https://localhost:7020/api/FileCV/add", fileCV, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });
//             setSuccess("הקובץ נוצר בהצלחה!");
//             setError(null); // ניקוי שגיאות קודמות
//         } catch (err: any) {
//             if (axios.isAxiosError(err)) {
//                 setError(err.response?.data || "שגיאה לא צפויה");
//             } else {
//                 setError("שגיאה לא צפויה");
//             }
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>שם:</label>
//                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//             </div>
//             <div>
//                 <label>שם פרטי:</label>
//                 <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//             </div>
//             <div>
//                 <label>שם משפחה:</label>
//                 <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//             </div>
//             <div>
//                 <label>אימייל:</label>
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//             </div>
//             <div>
//                 <label>טלפון:</label>
//                 <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
//             </div>
//             <div>
//                 <label>סיכום:</label>
//                 <textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
//             </div>
//             <div>
//                 <label>כישורים:</label>
//                 <input type="text" value={skills.join(", ")} onChange={(e) => setSkills(e.target.value.split(", "))} />
//             </div>
//             <div>
//                 <label>שפות:</label>
//                 <input type="text" value={languages.join(", ")} onChange={(e) => setLanguages(e.target.value.split(", "))} />
//             </div>
//             <button type="submit">שלח</button>

//             {error && <div style={{ color: "red" }}>{error}</div>}
//             {success && <div style={{ color: "green" }}>{success}</div>}
//         </form>
//     );
// };

// export default CreateFileCV;


import { useState } from "react";
import axios from "axios";

const CreateFileCV = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [summary, setSummary] = useState("");
    const [workExperiences, setWorkExperiences] = useState<{ company: string, position: string, startDate: string, endDate: string, description: string }[]>([]);
    const [educations, setEducations] = useState<{ institution: string, degree: string }[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setError("לא נמצאה הכרה.");
            return;
        }

        const fileCV = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: phone,
            Summary: summary,
            WorkExperiences: workExperiences,
            Educations: educations,
            Skills: skills,
        };

        try {
            const response = await axios.post("https://localhost:7020/api/FileCV/add", fileCV, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setSuccess("הקובץ נוצר בהצלחה!");
            setError(null); // ניקוי שגיאות קודמות
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || "שגיאה לא צפויה");
            } else {
                setError("שגיאה לא צפויה");
            }
        }
    };

    return (
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
            <div>
                <label>ניסיון תעסוקתי:</label>
                {/* תוכל להוסיף פה אפשרות להוסיף כמה "עבודות" */}
                <input type="text" placeholder="חברה" onChange={(e) => setWorkExperiences([...workExperiences, { company: e.target.value, position: '', startDate: '', endDate: '', description: '' }])} />
            </div>
            <div>
                <label>השכלה:</label>
                {/* תוכל להוסיף פה אפשרות להוסיף כמה "השכלות" */}
                <input type="text" placeholder="מוסד" onChange={(e) => setEducations([...educations, { institution: e.target.value, degree: '' }])} />
            </div>
            <button type="submit">שלח</button>

            {error && <div style={{ color: "red" }}>{error}</div>}
            {success && <div style={{ color: "green" }}>{success}</div>}
        </form>
    );
};

export default CreateFileCV;
