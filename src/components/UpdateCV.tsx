import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type ResumeData = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  summary: string;
  workExperiences: any[];
  educations: { institution: string; degree: string }[];
  skills: string[];
  languages: { languageName: string; proficiency: string }[];
};

type UpdateFileCVProps = {
  file: ResumeData;
  onClose: () => void;
  onUpdate: () => Promise<void>;
};

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

const UpdateCV = ({ file, onClose, onUpdate }: UpdateFileCVProps) => {
  console.log("המידע שהתקבל ב-UpdateFileCV:", file);

  const [firstName, setFirstName] = useState(file.firstName);
  const [lastName, setLastName] = useState(file.lastName);
  const [role, setRole] = useState(file.role);
  const [email, setEmail] = useState(file.email);
  const [phone, setPhone] = useState(file.phone);
  const [summary, setSummary] = useState(file.summary);
  const [workExperiences, setWorkExperiences] = useState(file.workExperiences);
  const [educations, setEducations] = useState(file.educations);
  const [languages, setLanguages] = useState(file.languages);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(file.skills);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, { company: '', location: '', startDate: '', endDate: '', description: '' }]);
  };

  const handleWorkExperienceChange = (index: number, key: string, value: string) => {
    const updated = [...workExperiences];
    updated[index] = { ...updated[index], [key]: value };
    setWorkExperiences(updated);
  };

  const addEducation = () => {
    setEducations([...educations, { institution: '', degree: '' }]);
  };

  const handleEducationChange = (index: number, key: string, value: string) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [key]: value };
    setEducations(updated);
  };

  const addLanguage = () => {
    setLanguages([...languages, { languageName: '', proficiency: '' }]);
  };

  const handleLanguageChange = (index: number, key: string, value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [key]: value };
    setLanguages(updated);
  };

  const handleSubmit = async () => {
    const updatedData: ResumeData = {
      firstName,
      lastName,
      role,
      email,
      phone,
      summary,
      workExperiences,
      educations,
      languages,
      skills: selectedSkills,
    };

    // פה אפשר לשלוח לשרת את הנתונים המעודכנים
    await onUpdate(); // הפונקציה שקיבלת כ-prop
    navigate("/my-files");
  };

  return (
    <div>
      <h2>עדכון קורות חיים</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="שם פרטי" />
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="שם משפחה" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="תפקיד נוכחי" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="מייל" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="טלפון" />
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="תקציר" />

        <h3>ניסיון תעסוקתי</h3>
        {workExperiences.map((exp, i) => (
          <div key={i}>
            <input value={exp.company} onChange={(e) => handleWorkExperienceChange(i, 'company', e.target.value)} placeholder="חברה" />
            <input value={exp.location} onChange={(e) => handleWorkExperienceChange(i, 'location', e.target.value)} placeholder="מיקום" />
            <input value={exp.startDate} onChange={(e) => handleWorkExperienceChange(i, 'startDate', e.target.value)} placeholder="שנת התחלה" />
            <input value={exp.endDate} onChange={(e) => handleWorkExperienceChange(i, 'endDate', e.target.value)} placeholder="שנת סיום" />
            <textarea value={exp.description} onChange={(e) => handleWorkExperienceChange(i, 'description', e.target.value)} placeholder="תיאור" />
          </div>
        ))}
        <button type="button" onClick={addWorkExperience}>הוסף ניסיון תעסוקתי</button>

        <h3>השכלה</h3>
        {educations.map((edu, i) => (
          <div key={i}>
            <input value={edu.institution} onChange={(e) => handleEducationChange(i, 'institution', e.target.value)} placeholder="מוסד לימודים" />
            <input value={edu.degree} onChange={(e) => handleEducationChange(i, 'degree', e.target.value)} placeholder="תואר" />
          </div>
        ))}
        <button type="button" onClick={addEducation}>הוסף השכלה</button>

        <h3>שפות</h3>
        {languages.map((lang, i) => (
          <div key={i}>
            <input value={lang.languageName} onChange={(e) => handleLanguageChange(i, 'languageName', e.target.value)} placeholder="שפה" />
            <input value={lang.proficiency} onChange={(e) => handleLanguageChange(i, 'proficiency', e.target.value)} placeholder="רמה" />
          </div>
        ))}
        <button type="button" onClick={addLanguage}>הוסף שפה</button>

        <h3>כישורים</h3>
        {skillOptions.map((skill) => (
          <div key={skill}>
            <input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggleSkill(skill)} />
            {skill}
          </div>
        ))}

        <button type="submit">עדכן קורות חיים</button>
      </form>
      <button onClick={onClose}>סגור</button>
    </div>
  );
};

export default UpdateCV;
