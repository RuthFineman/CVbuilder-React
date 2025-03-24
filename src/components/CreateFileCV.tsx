// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom"; 
// import axios from "axios";

// const CreateFileCV = () => {
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [summary, setSummary] = useState("");
//     const [skills, setSkills] = useState<string[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//     const [selectedFileData, setSelectedFileData] = useState<{ url: string } | null>(null);

//     const location = useLocation();
//     const selectedFileIndex = location.state?.selectedFileIndex;
//     const navigate = useNavigate();

//     // **קריאה לשרת כדי להביא את הקובץ הנבחר**
//     useEffect(() => {
//         const fetchFileData = async () => {
//             if (selectedFileIndex !== undefined) {
//                 console.log("המשתמש בחר קובץ מספר:", selectedFileIndex);
//                 try {
//                     const token = localStorage.getItem("token");
//                     const { data } = await axios.get(`https://localhost:7020/api/Template/${selectedFileIndex}`, {
//                         headers: { Authorization: token ? `Bearer ${token}` : "" },
//                     });

//                     console.log("נתוני הקובץ שהתקבלו מהשרת:", data);
//                     setSelectedFileData({ url: data }); // שמירת ה-URL של הקובץ להצגה
//                 } catch (error) {
//                     console.error("שגיאה בקבלת הנתונים מהשרת:", error);
//                 }
//             }
//         };

//         fetchFileData();
//     }, [selectedFileIndex]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const token = localStorage.getItem("token");

//         if (!token) {
//             setError("אין טוקן");
//             return;
//         }

//         const fileCV = {
//             FirstName: firstName,
//             LastName: lastName,
//             Email: email,
//             Phone: phone,
//             Summary: summary,
//             Skills: skills,
//         };

//         try {
//             await axios.post("https://localhost:7020/api/FileCV/add", fileCV, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });
//             setSuccess("הקובץ נוצר בהצלחה!");
//             setError(null);
//         } catch (err: any) {
//             setError("שגיאה לא צפויה");
//         }
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             {/* הצגת הקובץ הנבחר */}
//             {selectedFileData && (
//                 <div>
//                     <h3>תבנית נבחרה:</h3>
//                     <img
//                         src={selectedFileData.url}
//                         alt="Template"
//                         style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", marginBottom: "15px" }}
//                     />
//                 </div>
//             )}

//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>שם פרטי:</label>
//                     <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>שם משפחה:</label>
//                     <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>אימייל:</label>
//                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>טלפון:</label>
//                     <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>סיכום:</label>
//                     <textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>כישורים:</label>
//                     <input type="text" value={skills.join(", ")} onChange={(e) => setSkills(e.target.value.split(", "))} />
//                 </div>
//                 <button type="submit">שלח</button>
//                 {error && <div style={{ color: "red" }}>{error}</div>}
//                 {success && <div style={{ color: "green" }}>{success}</div>}
//             </form>
//         </div>
//     );
// };

// export default CreateFileCV;
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CreateFileCV: React.FC = () => {
  const { state } = useLocation();
  const selectedFileIndex = state?.selectedFileIndex;

  const [selectedFile, setSelectedFile] = useState<{ url: string } | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (selectedFileIndex !== undefined) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`https://localhost:7020/api/Template/${selectedFileIndex}`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          });
          setSelectedFile({ url: response.data });
        } catch (error) {
          console.error("Error fetching selected file:", error);
        }
      }
    };

    fetchTemplate();
  }, [selectedFileIndex]);

  return (
    <div>
      <h2>יצירת קובץ קו"ח</h2>
      <p>תבנית שנבחרה: {selectedFileIndex !== undefined ? `תבנית מספר ${selectedFileIndex + 1}` : "לא נבחרה תבנית"}</p>

      {selectedFile ? (
        <div>
          <h3>תצוגת תמונה של התבנית</h3>
          <img
            src={selectedFile.url}
            alt="Template"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      ) : (
        <p>מתחיל להוריד את התבנית...</p>
      )}

      {/* טופס יצירת קובץ כאן */}
    </div>
  );
};

export default CreateFileCV;
