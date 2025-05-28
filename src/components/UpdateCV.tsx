import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import html2pdf from "html2pdf.js"
import "../styles/UpdateCV.css"
import PDFUploaderUpdate from "./PDFUploaderUpdate"
import { useTemplateLoaderUpdate } from "../hooks/use-template-loader-update"
import { CVData, Education, Language, WorkExperience } from "../hooks/use-cv-data"
import { skillOptions } from "../data/skill-options"

// interface CVData {
//   id: string
//   firstName: string
//   lastName: string
//   role: string
//   email: string
//   phone: string
//   summary: string
//   workExperiences: WorkExperience[]
//   educations: Education[]
//   languages: Language[]
//   skills: string[]
//   template: string
// }

interface CVFile {
  id: string
  path: string
}

// Personal Info Section Component
const PersonalInfoSection = ({
  cvData,
  onUpdate,
}: { cvData: CVData; onUpdate: (field: string, value: string) => void }) => {
  return (
    <div className="form-section-item">
      <h2 className="section-title">פרטים אישיים</h2>
      <div className="personal-info-grid">
        <input
          type="text"
          placeholder="שם פרטי"
          value={cvData.firstName}
          onChange={(e) => onUpdate("firstName", e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="שם משפחה"
          value={cvData.lastName}
          onChange={(e) => onUpdate("lastName", e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="תפקיד"
          value={cvData.role}
          onChange={(e) => onUpdate("role", e.target.value)}
          className="form-input role-input"
        />
        <input
          type="email"
          placeholder="מייל"
          value={cvData.email}
          onChange={(e) => onUpdate("email", e.target.value)}
          className="form-input"
        />
        <input
          type="tel"
          placeholder="טלפון"
          value={cvData.phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
          className="form-input"
        />
      </div>

      {/* Summary Section */}
      <div style={{ marginTop: "20px" }}>
        <textarea
          placeholder="תקציר מקצועי..."
          value={cvData.summary}
          onChange={(e) => onUpdate("summary", e.target.value)}
          className="form-textarea"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  )
}

// Work Experience Section Component
const WorkExperienceSection = ({
  workExperiences,
  onAdd,
  onUpdate,
  onRemove,
}: {
  workExperiences: WorkExperience[]
  onAdd: () => void
  onUpdate: (index: number, field: keyof WorkExperience, value: string) => void
  onRemove: (index: number) => void
}) => {
  return (
    <div className="form-section-item">
      <h2 className="section-title">ניסיון תעסוקתי</h2>
      {workExperiences.map((exp, index) => (
        <div key={index} className="experience-item">
          <button type="button" onClick={() => onRemove(index)} className="delete-btn">
            🗑️
          </button>
          <div className="experience-grid">
            <input
              type="text"
              placeholder="שם החברה"
              value={exp.company}
              onChange={(e) => onUpdate(index, "company", e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="תפקיד"
              value={exp.position}
              onChange={(e) => onUpdate(index, "position", e.target.value)}
              className="form-input"
            />
            <div className="experience-dates">
              <input
                type="text"
                placeholder="שנת התחלה"
                value={exp.startDate}
                onChange={(e) => onUpdate(index, "startDate", e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="שנת סיום"
                value={exp.endDate}
                onChange={(e) => onUpdate(index, "endDate", e.target.value)}
                className="form-input"
              />
            </div>
            <div className="description-section">
              <textarea
                placeholder="תיאור התפקיד וההישגים..."
                value={exp.description}
                onChange={(e) => onUpdate(index, "description", e.target.value)}
                className="form-textarea"
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="add-btn">
        ➕ הוסף ניסיון עבודה
      </button>
    </div>
  )
}

// CV Preview Component - בדיוק כמו ביצירה!
const CVPreview = ({ data }: { data: CVData }) => {
  return (
    <div id="resume" className="resume-container">
      <div className="header">
        <h1>
          {data.firstName} {data.lastName}
        </h1>
        <h3>{data.role}</h3>
      </div>

      {data.summary && (
        <div className="summary">
          <p className="fas fa-user"></p>
          <p className="summary1">{data.summary}</p>
        </div>
      )}

      <div className="left-column">
        {(data.email || data.phone) && (
          <div className="personal-details">
            <h2>פרטים אישיים</h2>
            <div className="contact-info">
              {data.email && <p>{data.email}</p>}
              {data.phone && <p>{data.phone}</p>}
            </div>
          </div>
        )}

        {data.skills?.length > 0 && (
          <div className="skills-section">
            <h2>מיומנויות</h2>
            <ul className="skills-list">
              {data.skills.map((skill, index) => (
                <li key={`skill-${index}`} className="skill-item">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data.workExperiences?.length > 0 && (
        <div className="work-experiences">
          <h2>ניסיון תעסוקתי</h2>
          <p className="fas fa-briefcase"></p>
          {data.workExperiences.map((exp, index) => (
            <div key={`work-${exp.company}-${index}`} className="work-experience">
              {exp.company && <div className="company-name">{exp.company}</div>}
              {(exp.startDate || exp.endDate) && (
                <div className="work-dates">
                  {exp.startDate} - {exp.endDate}
                </div>
              )}
              {exp.description && <div className="work-description">{exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {data.educations?.length > 0 && (
        <div className="education-section">
          <h2>השכלה</h2>
          <i className="fas fa-graduation-cap"></i>
          {data.educations.map((edu, index) => (
            <div key={`edu-${edu.institution}-${index}`} className="education-item">
              {(edu.degree || edu.institution) && (
                <div className="education-degree-institution">
                  {edu.degree} - {edu.institution}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {data.languages?.length > 0 && (
        <div className="languages-section">
          <h2>שפות</h2>
          <ul className="language-item">
            {data.languages.map((lang, index) => (
              <li key={`lang-${index}`}>
                {lang?.languageName?.trim() && lang?.level?.trim()
                  ? `${lang.languageName} - ${lang.level}`
                  : lang?.languageName?.trim() || lang?.level?.trim()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Main Update CV Component
const UpdateCV: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const fileData = location.state as CVFile | null

  const [cvData, setCvData] = useState<CVData>({
    id: "",
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phone: "",
    summary: "",
    workExperiences: [{ company: "", position: "", startDate: "", endDate: "", description: "" }],
    educations: [{ institution: "", degree: "" }],
    languages: [{ languageName: "", level: "" }],
    skills: [],
    template: "",
  })

  const [loading, setLoading] = useState(true)
  const baseUrl = process.env.REACT_APP_API_BASE_URL
  const [isUpdating, setIsUpdating] = useState(false)
  const [showUploader, setShowUploader] = useState(false)

  // השתמש ב-hook לטעינת ה-CSS
  const { cssLoaded } = useTemplateLoaderUpdate(cvData.template)

  // Fetch CV data from server
  useEffect(() => {
    if (!fileData?.id) {
      console.error("לא נמצאו נתוני קובץ - חוזר לעמוד הקודם")
      navigate("/cvs")
      return
    }

    const fetchCVData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          console.error("לא נמצא טוקן - מנווט להתחברות")
          navigate("/")
          return
        }

        console.log("מבצע קריאה לשרת עבור קובץ:", fileData.id)
        const response = await axios.get(`${baseUrl}/file-cv/fileCV/${fileData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("תגובה מהשרת:", response.data)
        const data = response.data

        if (data) {
          setCvData({
            id: data.id||"",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            role: data.role || "",
            email: data.email || "",
            phone: data.Phone || "",
            summary: data.summary || "",
            workExperiences:
              Array.isArray(data.workExperiences) && data.workExperiences.length > 0
                ? data.workExperiences
                : [{ company: "", position: "", startDate: "", endDate: "", description: "" }],
            educations:
              Array.isArray(data.educations) && data.educations.length > 0
                ? data.educations
                : [{ institution: "", degree: "" }],
            languages:
              Array.isArray(data.languages) && data.languages.length > 0
                ? data.languages
                : [{ languageName: "", level: "" }],
            skills: Array.isArray(data.skills) ? data.skills : [],
            template: data.template || "",
          })
        }
      } catch (err) {
        console.error("שגיאה בהבאת נתוני הקובץ:", err)
        alert("שגיאה בטעינת נתוני הקובץ")
      } finally {
        setLoading(false)
      }
    }

    fetchCVData()
  }, [fileData?.id, baseUrl, navigate])

  // Update handlers
  const updateField = useCallback((field: string, value: string) => {
    setCvData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const addWorkExperience = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        { company: "", position: "", startDate: "", endDate: "", description: "" },
      ],
    }))
  }, [])

  const updateWorkExperience = useCallback((index: number, field: keyof WorkExperience, value: string) => {
    setCvData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }, [])

  const removeWorkExperience = useCallback((index: number) => {
    setCvData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index),
    }))
  }, [])

  const addEducation = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      educations: [...prev.educations, { institution: "", degree: "" }],
    }))
  }, [])

  const updateEducation = useCallback((index: number, field: keyof Education, value: string) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }, [])

  const removeEducation = useCallback((index: number) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }))
  }, [])

  const addLanguage = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      languages: [...prev.languages, { languageName: "", level: "" }],
    }))
  }, [])

  const updateLanguage = useCallback((index: number, field: keyof Language, value: string) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang)),
    }))
  }, [])

  const removeLanguage = useCallback((index: number) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }))
  }, [])

  const toggleSkill = useCallback((skill: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      console.log("עדכון קורות חיים:", cvData)
      setIsUpdating(true)
      setShowUploader(true)
    },
    [cvData],
  )

  const handleCancel = () => {
    navigate("/cvs")
  }

  const downloadPDF = useCallback(() => {
    const resumeElement = document.getElementById("resume")
    if (!resumeElement) return

    const options = {
      margin: 0,
      filename: `Resume_${cvData.firstName}_${cvData.lastName}.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 3, dpi: 300, letterRendering: true, useCORS: true },
      jsPDF: { unit: "mm", format: [208, 297], orientation: "portrait" },
    }
    html2pdf().set(options).from(resumeElement).save()
  }, [cvData.firstName, cvData.lastName])

  if (!fileData || !fileData.id) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>טוען נתוני קובץ...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div className="loading-spinner"></div>
        <p>טוען נתוני הקובץ...</p>
      </div>
    )
  }

  // אם ה-CSS עדיין לא נטען, הצג הודעת טעינה
  if (cvData.template && !cssLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          direction: "rtl",
        }}
      >
        טוען תבנית...
      </div>
    )
  }

  return (
    <div className="cv-builder-container1">
      <div className="cv-builder-container">
        <div className="form-section">
          <div className="create-cv-container">
            <form onSubmit={handleSubmit} className="cv-form">
              <PersonalInfoSection cvData={cvData} onUpdate={updateField} />

              <WorkExperienceSection
                workExperiences={cvData.workExperiences}
                onAdd={addWorkExperience}
                onUpdate={updateWorkExperience}
                onRemove={removeWorkExperience}
              />

              {/* השכלה */}
              <div className="form-section-item">
                <h2 className="section-title">השכלה</h2>
                {cvData.educations.map((edu, index) => (
                  <div key={index} className="education-item">
                    <button type="button" onClick={() => removeEducation(index)} className="delete-btn">
                      🗑️
                    </button>
                    <div className="experience-grid">
                      <input
                        type="text"
                        placeholder="מוסד לימודים"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="תואר/תעודה"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addEducation} className="add-btn">
                  ➕ הוסף השכלה
                </button>
              </div>

              {/* שפות */}
              <div className="form-section-item">
                <h2 className="section-title">שפות</h2>
                {cvData.languages.map((lang, index) => (
                  <div key={index} className="language-item">
                    <button type="button" onClick={() => removeLanguage(index)} className="delete-btn">
                      🗑️
                    </button>
                    <div className="experience-grid">
                      <input
                        type="text"
                        placeholder="שפה"
                        value={lang.languageName}
                        onChange={(e) => updateLanguage(index, "languageName", e.target.value)}
                        className="form-input"
                      />
                      <input
                        type="text"
                        placeholder="רמה (למשל: שפת אם, טובה מאוד, בסיסית)"
                        value={lang.level}
                        onChange={(e) => updateLanguage(index, "level", e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addLanguage} className="add-btn">
                  ➕ הוסף שפה
                </button>
              </div>

              {/* מיומנויות */}
              <div className="form-section-item">
                <h2 className="section-title">מיומנויות</h2>
                <div className="skills-selection">
                  {skillOptions.map((skill, index) => (
                    <label key={index} className="skill-option">
                      <input
                        type="checkbox"
                        checked={cvData.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="preview-section">
          {/* כפתורי פעולה אלגנטיים בפינה העליונה */}
          <div className="action-buttons">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isUpdating}
              className={`update-btn ${isUpdating ? "disabled" : ""}`}
            >
              {isUpdating ? "🔄 מעדכן..." : "✅ עדכן"}
            </button>

            <button onClick={downloadPDF} className="download-btn">
              📥 הורד PDF
            </button>
          </div>

          <div className="preview-inner">
            <CVPreview data={cvData} />
          </div>
        </div>
      </div>
      {showUploader && (
        <PDFUploaderUpdate
          data={{
            id: cvData.id,
            firstName: cvData.firstName,
            lastName: cvData.lastName,
            fileName: `קורות_חיים_${cvData.firstName}_${cvData.lastName}`,
            role: cvData.role,
            email: cvData.email,
            phone: cvData.phone,
            summary: cvData.summary,
            workExperiences: cvData.workExperiences,
            educations: cvData.educations,
            skills: cvData.skills,
            languages: cvData.languages,
            template: cvData.template,
          }}
          
        />
      )}
    </div>
  )
}

export default UpdateCV
