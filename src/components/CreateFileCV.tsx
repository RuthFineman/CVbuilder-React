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
import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import axios from "axios";
import { useLocation } from "react-router-dom";

// const CreateFileCV = ({ selectedFileIndex }) => {
    const CreateFileCV = () => {
      const location = useLocation();
      const selectedFileIndex = location.state?.selectedFileIndex || null;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileData = async () => {
      if (selectedFileIndex !== undefined) {
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.get(`https://localhost:7020/api/Template/${selectedFileIndex}`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          });
          console.log("Received data from API:", data); 
          if (data && typeof data === "object" && data.imageUrl) {
            setSelectedFileUrl(data.imageUrl);
          } else if (typeof data === "string") {
            setSelectedFileUrl(data); 
          } else {
            console.error("Unexpected API response format:", data);
          }
        } catch (error) {
          console.error("Error fetching template:", error);
        }
      }
    };
  
    fetchFileData();
  }, [selectedFileIndex]);
  const [image] = useImage(selectedFileUrl && selectedFileUrl.startsWith("http") ? selectedFileUrl : "placeholder.png");



  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
      {/* טופס להזנת הפרטים */}
      <div style={{ width: "40%" }}>
        <h3>הזן פרטים:</h3>
        <input type="text" placeholder="שם פרטי" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="שם משפחה" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      {/* תצוגת הקובץ עם הנתונים שהוזנו */}
      <div style={{ width: "55%", border: "1px solid #ccc", padding: "10px" }}>
        <Stage width={600} height={800}>
          <Layer>
            {image && <Image image={image} width={600} height={800} />}
            <Text text={`שם: ${firstName} ${lastName}`} x={100} y={150} fontSize={24} fill="black" fontStyle="bold" />
            <Text text={`אימייל: ${email}`} x={100} y={200} fontSize={20} fill="black" />
            <Text text={`טלפון: ${phone}`} x={100} y={250} fontSize={20} fill="black" />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CreateFileCV;
