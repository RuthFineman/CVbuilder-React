import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

interface WorkExperience {
  company: string;
  position: string;
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
  level: string;
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
    const navigate = useNavigate();

  const [fileCV, setFileCV] = useState({
    id: '',
    firstName: '',
    lastName: '',
    template:'',
    role: '',
    email: '',
    phone: '',
    summary: '',
    workExperiences: [] as WorkExperience[],
    educations: [] as Education[],
    languages: [] as Language[],
    skills: [] as string[],
  });
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const skillOptions = [
    "כישורי ארגון", "פתרון בעיות", "עבודה בצוות", "יצירתיות", "אחריות",
    "תפקוד במצבי לחץ", "מוסר עבודה גבוה", "ניהול זמן יעיל", "חשיבה אנליטית", "יחסי אנוש מעולים"
  ];
  useEffect(() => {
    
    if (!file?.id) return;
    const fetchCVData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/file-cv/fileCV/${file.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("response.data", response.data);
        console.log("PHONE:", response.data.Phone);
        const data = response.data;
        if (data) {
          setFileCV({
            id: data.id || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            template: data.template || '',
            role: data.role || '',
            email: data.email || '',
            phone: data.Phone || '',
            summary: data.summary || '',
            workExperiences: Array.isArray(data.workExperiences) && data.workExperiences.length > 0
              ? data.workExperiences
              : [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
            educations: Array.isArray(data.educations) && data.educations.length > 0
              ? data.educations
              : [{ institution: '', degree: '' }],
            languages: Array.isArray(data.languages) && data.languages.length > 0
              ? data.languages
              : [{ languageName: '', level: '' }],
            skills: Array.isArray(data.skills) ? data.skills : []
          });
        }
      } catch (err) {
        console.error('שגיאה בהבאת נתוני הקובץ:', err);
      }
    };
    fetchCVData();
  }, [file.id]);
  
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
        { company: '', position: '', startDate: '', endDate: '', description: '' }
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
      languages: [...fileCV.languages, { languageName: '', level: '' }]
    });
  };
  const toggleSkill = (skill: string) => {
    const updatedSkills = fileCV.skills.includes(skill)
      ? fileCV.skills.filter(s => s !== skill)
      : [...fileCV.skills, skill];
    setFileCV({ ...fileCV, skills: updatedSkills });
  };

  const handleSave = async () => {
    console.log("fileCV שנשלח לניווט:", fileCV);
     navigate('/resume-display-update', { state: fileCV });
  };
  return (
    <div>
      {/* <button onClick={()=>console.log(fileCV)}></button> */}
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
          <input placeholder="מיקום" value={exp.position} onChange={e => handleArrayChange(i, 'position', e.target.value, 'workExperiences')} />
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
      {fileCV.languages?.map((lang, i) => (
        <div key={i}>
          <input placeholder="שפה" value={lang.languageName} onChange={e => handleArrayChange(i, 'languageName', e.target.value, 'languages')} />
          <input placeholder="רמה" value={lang.level||''} onChange={e => handleArrayChange(i, 'level', e.target.value, 'languages')} />
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


