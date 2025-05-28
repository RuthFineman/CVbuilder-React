import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import html2pdf from "html2pdf.js"
import "../../styles/UpdateCV.css"
import FormSections from "./FormSections"
import PreviewSection from "./PreviewSection"
import { CVData, Education, Language, WorkExperience } from "../../hooks/use-cv-data"
import { useTemplateLoaderUpdate } from "../../hooks/use-template-loader-update"
import PDFUploaderUpdate from "../PDFUploaderUpdate"

interface CVFile {
  id: string
  path: string
}

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

  // Loading states
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
          <FormSections
            cvData={cvData}
            updateField={updateField}
            addWorkExperience={addWorkExperience}
            updateWorkExperience={updateWorkExperience}
            removeWorkExperience={removeWorkExperience}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            addLanguage={addLanguage}
            updateLanguage={updateLanguage}
            removeLanguage={removeLanguage}
            toggleSkill={toggleSkill}
            onSubmit={handleSubmit}
          />
        </div>
        
        <PreviewSection
          data={cvData}
          onUpdate={handleSubmit}
          onDownloadPDF={downloadPDF}
          isUpdating={isUpdating}
        />
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