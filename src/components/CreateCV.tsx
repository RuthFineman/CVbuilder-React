import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReadySentences from "./ReadySentences";

const CreateCV = ({ onSubmit }: {
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        role: string;
        email: string;
        phone: string;
        summary: string;
        workExperiences: { company: string, position: string, startDate: string, endDate: string, description: string }[];
        educations: { institution: string; degree: string }[];
        skills: string[];
        languages: { languageName: string; level: string }[];
    }) => void;
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedFileIndex = location.state?.selectedFileIndex;
    const skillOptions = ["כישורי ארגון", "פתרון בעיות", "עבודה בצוות", "יצירתיות", "אחריות", "תפקוד במצבי לחץ", "מוסר עבודה גבוה", "ניהול זמן יעיל", "חשיבה אנליטית", "יחסי אנוש מעולים"];
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [workExperiences, setWorkExperiences] = useState<{ company: string; position: string; startDate: string; endDate: string; description: string; }[]>([]);
    const [educations, setEducations] = useState<{ institution: string; degree: string }[]>([]);
    const [languages, setLanguages] = useState<{ languageName: string; level: string }[]>([]);
    const [summary, setSummary] = useState('');
    const [showSentenceOptions, setShowSentenceOptions] = useState(false);
    const handleAddSentence = (sentence: string) => {
        setSummary((prev) => (prev ? `${prev} ${sentence}` : sentence));
        setShowSentenceOptions(false);
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prevSkills =>
            prevSkills.includes(skill) ? prevSkills.filter(s => s !== skill) : [...prevSkills, skill]
        );
    };
    const addEducation = () => {
        setEducations([...educations, { institution: "", degree: "" }]);
    };

    const handleEducationChange = (index: number, key: string, value: string) => {
        const newEducations = [...educations];
        newEducations[index] = { ...newEducations[index], [key]: value };
        setEducations(newEducations);
    };

    const addWorkExperience = () => {
        setWorkExperiences([...workExperiences, { company: "", position: "", startDate: "", endDate: "", description: "" }]);
    };

    const handleWorkExperienceChange = (index: number, key: string, value: string) => {
        const newWorkExperiences = [...workExperiences];
        newWorkExperiences[index] = { ...newWorkExperiences[index], [key]: value };
        setWorkExperiences(newWorkExperiences);
    };

    const addLanguage = () => {
        setLanguages([...languages, { languageName: "", level: "" }]);
    };

    const handleLanguageChange = (index: number, key: string, value: string) => {
        const newLanguages = [...languages];
        newLanguages[index] = { ...newLanguages[index], [key]: value };
        setLanguages(newLanguages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        console.log("Form submitted");
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !role.trim() || !email.trim() || !phone.trim()) {
            alert("אנא מלא/י פרטים אישיים");
            return;
        }
        const resumeData = { firstName, lastName, role, email, phone, summary, workExperiences, educations, skills: selectedSkills, languages };
        onSubmit(resumeData);
        navigate("/resume-display", { state: { selectedFileIndex: selectedFileIndex } });
    };

    return (
        <div>
            <button type="button" onClick={() => navigate("/CVs")}>
                ⬅️
            </button>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="שם פרטי" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="שם משפחה" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <input type="text" placeholder="תפקיד" value={role} onChange={(e) => setRole(e.target.value)} />
                <input type="email" placeholder="מייל" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="tel" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <div className="form-group">
                    <textarea
                        placeholder="תקציר"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={4}
                        style={{ width: "100%", padding: "10px" }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowSentenceOptions((prev) => !prev)}
                        style={{ marginTop: "10px" }}
                    >
                        ✨ משפטים מוכנים עבורך
                    </button>
                    {showSentenceOptions && <ReadySentences onSelect={handleAddSentence} />}
                </div>

                {workExperiences.map((exp, index) => (
                    <div key={index}>
                        <input type="text" placeholder="חברה" value={exp.company || ''} onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)} />
                        <input type="text" placeholder="מיקום" value={exp.position || ''} onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)} />
                        <input type="text" placeholder="שנת התחלה" value={exp.startDate || ''} onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)} />
                        <input type="text" placeholder="שנת סיום" value={exp.endDate || ''} onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)} />
                        <textarea placeholder="תיאור" value={exp.description || ''} onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)} />
                        <button type="button" onClick={() => setWorkExperiences(workExperiences.filter((_, i) => i !== index))}>🗑️</button>
                    </div>
                ))}
                <button type="button" onClick={addWorkExperience}>➕הוסף ניסיון עבודה</button>

                <h3>השכלה</h3>
                {educations.map((edu, index) => (
                    <div key={index}>
                        <input type="text" placeholder="מוסד לימודים" value={edu.institution} onChange={(e) => handleEducationChange(index, "institution", e.target.value)} />
                        <input type="text" placeholder="תואר" value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} />
                        <button type="button" onClick={() => setEducations(educations.filter((_, i) => i !== index))}>🗑️</button>
                    </div>
                ))}
                <button type="button" onClick={addEducation}>➕ הוסף השכלה</button>

                <h3>שפות</h3>
                {languages.map((lang, index) => (
                    <div key={index}>
                        <input type="text" placeholder="שפה" value={lang.languageName} onChange={(e) => handleLanguageChange(index, "languageName", e.target.value)} />
                        <input type="text" placeholder="רמה (למשל: שפת אם,טובה מאד, בסיסית)" value={lang.level} onChange={(e) => handleLanguageChange(index, "level", e.target.value)} />
                        <button type="button" onClick={() => setLanguages(languages.filter((_, i) => i !== index))}>🗑️</button>
                    </div>
                ))}
                <button type="button" onClick={addLanguage}>➕ הוסף שפה</button>

                <h3>בחר מיומנויות:</h3>
                <div className="skills-selection">
                    {skillOptions.map((skill, index) => (
                        <label key={index} className="skill-option">
                            <input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggleSkill(skill)} />
                            {skill}
                        </label>
                    ))}
                </div>

                <button type="submit">צור קורות חיים</button>
            </form>
        </div>
    );
};

export default CreateCV;
