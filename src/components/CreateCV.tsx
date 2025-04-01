import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCV = ({ onSubmit }: {
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        summary: string;
        workExperiences: any[];
        educations: { institution: string; degree: string }[];
        skills: string[];
    }) => void;
}) => {
    const navigate = useNavigate();
    const skillOptions = [
        "כישורי ארגון",
        "פתרון בעיות",
        "עבודה בצוות",
        "יצירתיות",
        "אחריות",
        "תפקוד במצבי לחץ",
        "מוסר עבודה גבוה",
        "ניהול זמן יעיל",
        "חשיבה אנליטית",
        "יחסי אנוש מעולים"
    ];

    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const toggleSkill = (skill: string) => {
        setSelectedSkills(prevSkills =>
            prevSkills.includes(skill) ? prevSkills.filter(s => s !== skill) : [...prevSkills, skill]
        );
    };

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [summary, setSummary] = useState('');
    const [workExperiences, setWorkExperiences] = useState<any[]>([]);
    const [educations, setEducations] = useState<{ institution: string; degree: string }[]>([]);

    const addEducation = () => {
        setEducations([...educations, { institution: "", degree: "" }]);
    };

    const handleEducationChange = (index: number, key: string, value: string) => {
        const newEducations = [...educations];
        newEducations[index] = { ...newEducations[index], [key]: value };
        setEducations(newEducations);
    };

    const handleWorkExperienceChange = (index: number, key: string, value: string) => {
        const newWorkExperiences = [...workExperiences];
        newWorkExperiences[index] = { ...newWorkExperiences[index], [key]: value };
        setWorkExperiences(newWorkExperiences);
    };

    const addWorkExperience = () => {
        setWorkExperiences([
            ...workExperiences,
            { company: '', location: '', startDate: '', endDate: '', description: '' }
        ]);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const resumeData = { firstName, lastName, email, phone, summary, workExperiences, educations, skills: selectedSkills };
        onSubmit(resumeData);
        navigate("/resume-display", { state: { data: resumeData } }); // מעבר עם הנתונים
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="שם פרטי" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="שם משפחה" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input type="email" placeholder="מייל" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="tel" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <textarea placeholder="תקציר" value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} />

            {workExperiences.map((exp, index) => (
                <div key={index}>
                    <input type="text" placeholder="חברה" value={exp.company || ''} onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)} />
                    <input type="text" placeholder="מיקום" value={exp.location || ''} onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)} />
                    <input type="text" placeholder="שנת התחלה" value={exp.startDate || ''} onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)} />
                    <input type="text" placeholder="שנת סיום" value={exp.endDate || ''} onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)} />
                    <textarea placeholder="תיאור" value={exp.description || ''} onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)} />
                    <button type="button" onClick={() => setWorkExperiences(workExperiences.filter((_, i) => i !== index))}>🗑️</button>
                </div>
            ))}

            <button type="button" onClick={addWorkExperience}>הוסף ניסיון עבודה</button>

            <h3>השכלה</h3>
            {educations.map((edu, index) => (
                <div key={index}>
                    <input type="text" placeholder="מוסד לימודים" value={edu.institution} onChange={(e) => handleEducationChange(index, "institution", e.target.value)} />
                    <input type="text" placeholder="תואר" value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} />
                    <button type="button" onClick={() => setEducations(educations.filter((_, i) => i !== index))}>🗑️</button>
                </div>
            ))}

            <div className="skills-selection">
                <h3>בחר מיומנויות:</h3>
                {skillOptions.map((skill, index) => (
                    <label key={index} className="skill-option">
                        <input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggleSkill(skill)} />
                        {skill}
                    </label>
                ))}
            </div>

            <button type="button" onClick={addEducation}>➕ הוסף השכלה</button>
            <button type="submit">צור קורות חיים</button>

        </form>

    );
};

export default CreateCV;
