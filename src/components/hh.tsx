import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Hh = () => {
    
    const location = useLocation();
    const [workExperiences, setWorkExperiences] = useState([{ company: "", location: "", startDate: "", endDate: "", description: "" }]);
    const [educations, setEducations] = useState([{ institution: "", degree: "" }]);
    const [skills, setSkills] = useState<string[]>([""]);
    const selectedFileIndex = location.state?.selectedFileIndex || null;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [summary, setSummary] = useState("");
    const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchFileData = async () => {
            if (selectedFileIndex !== null) {
                try {
                    const token = localStorage.getItem("token");
                    const { data } = await axios.get(`https://localhost:7020/api/Template/${selectedFileIndex}`, {
                        headers: { Authorization: token ? `Bearer ${token}` : "" },
                    });
                    console.log("Received data from API:", data);
                    if (data && typeof data === "object") {
                        setSelectedFileUrl(data.imageUrl || "");
                        setFirstName(data.firstName || "");
                        setLastName(data.lastName || "");
                        setEmail(data.email || "");
                        setPhone(data.phone || "");
                        setSummary(data.summary || "");
                        setWorkExperiences(data.workExperiences || []);
                        setEducations(data.educations || []);
                        setSkills(data.skills || []);
                    } else if (typeof data === "string") {
                        setSelectedFileUrl(data);
                    } else {
                        console.error("Unexpected API response format:", data);
                    }
                } catch (error) {
                    console.error("Error fetching template:", error);
                }
            } else {
                console.warn("selectedFileIndex is null, skipping API call");
            }
        };

        fetchFileData();
    }, [selectedFileIndex]);

    const [image] = useImage(selectedFileUrl && selectedFileUrl.startsWith("http") ? selectedFileUrl : "placeholder.png");

    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
            {/* צד ימין - תמונה */}
            <div style={{ width: "45%", border: "1px solid #ccc", padding: "10px", position: "relative" }}>
                <Stage width={600} height={800}>
                    <Layer>
                        {image && <Image image={image} width={600} height={800} />}
                        <Text text={`${firstName} ${lastName}`} x={50} y={50} fontSize={24} fontStyle="bold" fill="white" />
                        {phone && <Text text={`Phone: ${phone}`} x={50} y={130} fontSize={20} fill="white" />}
                        <Text text={summary} x={50} y={170} fontSize={18} fill="white" width={500} />

                        {workExperiences.map((exp, index) => (
                            <Text
                                key={index}
                                text={`${exp.company} (${exp.startDate} - ${exp.endDate})`}
                                x={50}
                                y={220 + index * 30}
                                fontSize={18}
                                fill="white"
                            />
                        ))}

                        {educations.map((edu, index) => (
                            <Text
                                key={index}
                                text={`${edu.degree}, ${edu.institution}`}
                                x={50}
                                y={350 + index * 30}
                                fontSize={18}
                                fill="white"
                            />
                        ))}

                        {skills.map((skill, index) => (
                            <Text key={index} text={skill} x={50} y={500 + index * 30} fontSize={18} fill="white" />
                        ))}
                    </Layer>
                </Stage>
            </div>

            {/* צד שמאל - שדות טופס */}
            <div style={{ width: "50%", padding: "10px", display: "flex", flexDirection: "column" }}>
                <h3>הזן פרטים:</h3>
                <input type="text" placeholder="שם פרטי" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="שם משפחה" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <textarea placeholder="תקציר" value={summary} onChange={(e) => setSummary(e.target.value)} />

                <h3>ניסיון תעסוקתי:</h3>
                {workExperiences.map((exp, index) => (
                    <div key={index}>
                        <input type="text" placeholder="חברה" value={exp.company} onChange={(e) => {
                            const newExp = [...workExperiences];
                            newExp[index].company = e.target.value;
                            setWorkExperiences(newExp);
                        }} />
                        <input type="text" placeholder="מיקום" value={exp.location} onChange={(e) => {
                            const newExp = [...workExperiences];
                            newExp[index].location = e.target.value;
                            setWorkExperiences(newExp);
                        }} />
                        <input type="text" placeholder="שנת התחלה" value={exp.startDate} onChange={(e) => {
                            const newExp = [...workExperiences];
                            newExp[index].startDate = e.target.value;
                            setWorkExperiences(newExp);
                        }} />
                        <input type="text" placeholder="שנת סיום" value={exp.endDate} onChange={(e) => {
                            const newExp = [...workExperiences];
                            newExp[index].endDate = e.target.value;
                            setWorkExperiences(newExp);
                        }} />
                        <textarea placeholder="תיאור" value={exp.description} onChange={(e) => {
                            const newExp = [...workExperiences];
                            newExp[index].description = e.target.value;
                            setWorkExperiences(newExp);
                        }} />
                        <button onClick={() => setWorkExperiences(workExperiences.filter((_, i) => i !== index))}>🗑️</button>
                    </div>
                ))}
                <button onClick={() => setWorkExperiences([...workExperiences, { company: "", location: "", startDate: "", endDate: "", description: "" }])}>➕ הוסף ניסיון</button>

                <h3>השכלה:</h3>
                {educations.map((edu, index) => (
                    <div key={index}>
                        <input type="text" placeholder="מוסד לימודים" value={edu.institution} onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].institution = e.target.value;
                            setEducations(newEdu);
                        }} />
                        <input type="text" placeholder="תואר" value={edu.degree} onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].degree = e.target.value;
                            setEducations(newEdu);
                        }} />
                        <button onClick={() => setEducations(educations.filter((_, i) => i !== index))}>🗑️</button>
                    </div>
                ))}
                <button onClick={() => setEducations([...educations, { institution: "", degree: "" }])}>➕ הוסף השכלה</button>

                <h3>מיומנויות:</h3>
                {skills.map((skill, index) => (
                    <div key={index}>
                        <input type="text" placeholder="מיומנות" value={skill} onChange={(e) => {
                            const newSkills = [...skills];
                            newSkills[index] = e.target.value;
                            setSkills(newSkills);
                        }} />
                        <button onClick={() => setSkills(skills.filter((_, i) => i !== index))}>🗑️</button>
                    </div>
                ))}
                <button onClick={() => setSkills([...skills, ""])}>➕ הוסף מיומנות</button>
            </div>

            <div style={{
      width: 600,
      height: 800,
      position: "relative",
      backgroundImage: "url('/path-to-your-image.jpg')",
      backgroundSize: "cover",
    }}>
      {/* החלק של פרטים אישיים */}
      <div
        style={{
          position: "absolute",
          top: 188 + 220, // חלק עליון + התחלה של פרטים אישיים
          left: 0,
          width: 200,
          padding: "10px",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "5px",
        }}
      >
        <h4 style={{ margin: 0, textAlign: "center" }}>פרטים אישיים</h4>
        <p style={{ margin: "5px 0", textAlign: "center" }}>{email}</p>
      </div>

      {/* שדה קלט למייל */}
      <input
        type="email"
        placeholder="הכנס אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          position: "absolute",
          top: 750,
          left: 200,
          width: 200,
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
        </div>
    );
};

export default Hh;
