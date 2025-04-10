import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface WorkExperience {
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
}

interface Language {
  languageName: string;
  proficiency: string;
}

interface CVFile {
  id: string;
  path: string;
}

interface UpdateCVProps {
  file: CVFile;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}

const UpdateCV: React.FC<UpdateCVProps> = ({ file, onClose, onUpdate }) => {
  const [fileCV, setFileCV] = useState({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    summary: '',
    workExperiences: [] as WorkExperience[],
    educations: [] as Education[],
    languages: [] as Language[],
    skills: [] as string[],
  });

  const skillOptions = [
    "כישורי ארגון", "פתרון בעיות", "עבודה בצוות", "יצירתיות", "אחריות",
    "תפקוד במצבי לחץ", "מוסר עבודה גבוה", "ניהול זמן יעיל", "חשיבה אנליטית", "יחסי אנוש מעולים"
  ];

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const response = await axios.get(`https://localhost:7020/upload/fileCV/${file.id}`);
        setFileCV(response.data);
      } catch (error) {
        console.error('שגיאה בהבאת נתוני הקובץ:', error);
      }
    };

    if (file?.id) {
      fetchCVData();
    }
  }, [file]);

  const handleChange = (field: string, value: string) => {
    setFileCV({ ...fileCV, [field]: value });
  };

  const handleArrayChange = (
    index: number,
    field: string,
    value: string,
    type: 'workExperiences' | 'educations' | 'languages'
  ) => {
    const updated = [...(fileCV[type] as any[])];
    updated[index][field] = value;
    setFileCV({ ...fileCV, [type]: updated });
  };

  const addWorkExperience = () => {
    setFileCV({
      ...fileCV,
      workExperiences: [
        ...fileCV.workExperiences,
        { company: '', location: '', startDate: '', endDate: '', description: '' }
      ]
    });
  };

  const addEducation = () => {
    setFileCV({
      ...fileCV,
      educations: [...fileCV.educations, { institution: '', degree: '' }]
    });
  };

  const addLanguage = () => {
    setFileCV({
      ...fileCV,
      languages: [...fileCV.languages, { languageName: '', proficiency: '' }]
    });
  };

  const toggleSkill = (skill: string) => {
    const updatedSkills = fileCV.skills.includes(skill)
      ? fileCV.skills.filter(s => s !== skill)
      : [...fileCV.skills, skill];
    setFileCV({ ...fileCV, skills: updatedSkills });
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://localhost:7020/upload/update/${file.id}`, fileCV);
      await onUpdate();
      onClose();
    } catch (error) {
      console.error('שגיאה בעדכון הקובץ:', error);
    }
  };

  return (
    <div>
      <h2>עדכון קורות חיים</h2>

      <input placeholder="שם פרטי" value={fileCV.firstName} onChange={e => handleChange('firstName', e.target.value)} />
      <input placeholder="שם משפחה" value={fileCV.lastName} onChange={e => handleChange('lastName', e.target.value)} />
      <input placeholder="תפקיד" value={fileCV.role} onChange={e => handleChange('role', e.target.value)} />
      <input placeholder="מייל" value={fileCV.email} onChange={e => handleChange('email', e.target.value)} />
      <input placeholder="טלפון" value={fileCV.phone} onChange={e => handleChange('phone', e.target.value)} />
      <textarea placeholder="תקציר" value={fileCV.summary} onChange={e => handleChange('summary', e.target.value)} />

      <h3>ניסיון תעסוקתי</h3>
      {fileCV.workExperiences.map((exp, i) => (
        <div key={i}>
          <input placeholder="חברה" value={exp.company} onChange={e => handleArrayChange(i, 'company', e.target.value, 'workExperiences')} />
          <input placeholder="מיקום" value={exp.location} onChange={e => handleArrayChange(i, 'location', e.target.value, 'workExperiences')} />
          <input placeholder="תחילת עבודה" value={exp.startDate} onChange={e => handleArrayChange(i, 'startDate', e.target.value, 'workExperiences')} />
          <input placeholder="סיום עבודה" value={exp.endDate} onChange={e => handleArrayChange(i, 'endDate', e.target.value, 'workExperiences')} />
          <textarea placeholder="תיאור" value={exp.description} onChange={e => handleArrayChange(i, 'description', e.target.value, 'workExperiences')} />
        </div>
      ))}
      <button onClick={addWorkExperience}>הוסף ניסיון</button>

      <h3>השכלה</h3>
      {fileCV.educations.map((edu, i) => (
        <div key={i}>
          <input placeholder="מוסד" value={edu.institution} onChange={e => handleArrayChange(i, 'institution', e.target.value, 'educations')} />
          <input placeholder="תואר" value={edu.degree} onChange={e => handleArrayChange(i, 'degree', e.target.value, 'educations')} />
        </div>
      ))}
      <button onClick={addEducation}>הוסף השכלה</button>

      <h3>שפות</h3>
      {fileCV.languages.map((lang, i) => (
        <div key={i}>
          <input placeholder="שפה" value={lang.languageName} onChange={e => handleArrayChange(i, 'languageName', e.target.value, 'languages')} />
          <input placeholder="רמה" value={lang.proficiency} onChange={e => handleArrayChange(i, 'proficiency', e.target.value, 'languages')} />
        </div>
      ))}
      <button onClick={addLanguage}>הוסף שפה</button>

      <h3>כישורים</h3>
      <div>
        {skillOptions.map((skill) => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            style={{
              backgroundColor: fileCV.skills.includes(skill) ? '#ccc' : '',
              margin: '5px'
            }}
          >
            {skill}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSave}>שמור</button>
        <button onClick={onClose}>סגור</button>
      </div>
    </div>
  );
};

export default UpdateCV;
