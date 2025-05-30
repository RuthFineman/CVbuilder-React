import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import html2pdf from "html2pdf.js"
import "../../styles/UpdateCV.css"
import PDFUploaderUpdate from "./CVUploaderUpdate"
import { useTemplateLoaderUpdate } from "../../hooks/use-template-loader-update"
import { CVData, CVFile, Education, Language, WorkExperience } from "../../types/type"
import WorkExperienceSection from "../Sections/WorkExperienceSection"
import CVPreview from "./CVPreviewUpdate"
import PersonalInfoSection from "../Sections/PersonalInfoSection"
import LanguageSection from "../Sections/LanguageSection"
import EducationSection from "../Sections/EducationSection"
import SkillsSection from "../Sections/SkillsSection"

const UpdateCV: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const fileData = location.state as CVFile | null

  const [cvData, setCvData] = useState<CVData>({
    id: "",
    fileName: "",
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

  const baseUrl = process.env.REACT_APP_API_BASE_URL
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showUploader, setShowUploader] = useState(false)

  const { cssLoaded } = useTemplateLoaderUpdate(cvData.template)

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

        const response = await axios.get(`${baseUrl}/file-cv/fileCV/${fileData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = response.data
        if (data) {
          setCvData({
            id: data.id || "",
            fileName: data.fileName || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            role: data.role || "",
            email: data.email || "",
            phone: data.phone || "",
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
      setIsUpdating(true)
      setShowUploader(true)
    },
    [cvData],
  )

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
              <PersonalInfoSection firstName={cvData.firstName} lastName={cvData.lastName} role={cvData.role} email={cvData.email} phone={cvData.phone} summary={cvData.summary} onUpdate={updateField} />
              <WorkExperienceSection workExperiences={cvData.workExperiences} onAdd={addWorkExperience} onUpdate={updateWorkExperience} onRemove={removeWorkExperience} />
              <LanguageSection languages={cvData.languages} onAdd={addLanguage} onUpdate={updateLanguage} onRemove={removeLanguage} />
              <EducationSection educations={cvData.educations} onAdd={addEducation} onUpdate={updateEducation} onRemove={removeEducation} />
              <SkillsSection skills={cvData.skills} onToggle={toggleSkill} />
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