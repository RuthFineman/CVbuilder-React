import type React from "react"
import { useCallback, useState } from "react"
import "../../styles/CreateCV.css"
import { useLocation, useNavigate } from "react-router-dom"
import html2pdf from "html2pdf.js"
import { useTemplateLoader } from "../../hooks/use-template-loader"
import { CVData, useCVData } from "../../hooks/use-cv-data"
import PersonalInfoSection from "./Personal-info-section"
import WorkExperienceSection from "./Work-experience-section"
import { skillOptions } from "../../data/skill-options"
import CVPreview from "./Cv-preview"
import PDFUploader from "../CVUploader"
const CreateCV =()=>{
    const navigate = useNavigate()
    const location = useLocation()
    const selectedFileIndex = location.state?.selectedFileIndex;
    const {templateUrl, cssLoaded } = useTemplateLoader(selectedFileIndex)
    const [resumeDataForUpload, setResumeDataForUpload] = useState<(CVData & { templateUrl: string }) | null>(null)
    const [showPDFUploader, setShowPDFUploader] = useState(false);
    const {cvData, updateField, addWorkExperience, updateWorkExperience, removeWorkExperience, addEducation, updateEducation, removeEducation, addLanguage, updateLanguage, removeLanguage, toggleSkill, } = useCVData()
    const [isLoading, setIsLoading] = useState(false)
    const handlePersonalInfoUpdate = useCallback(
        (field: string, value: string) => {
            updateField(field as keyof typeof cvData, value)
        },
        [updateField],
    )

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault()
            if (
                !cvData.firstName.trim() ||
                !cvData.lastName.trim() ||
                !cvData.role.trim() ||
                !cvData.email.trim() ||
                !cvData.phone.trim()
            ) {
                alert("אנא מלא/י פרטים אישיים")
                return
            }
            const resumeData = { ...cvData, templateUrl }
            setResumeDataForUpload(resumeData)
            setShowPDFUploader(true)
            setIsLoading(true)
            setTimeout(() => {
                navigate("/cvs", { state: { selectedFileIndex } })
                setIsLoading(false)
            }, 1000)
        },
        [cvData, templateUrl, navigate, selectedFileIndex], // ✅ dependencies נכונים
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
    
    if (!cssLoaded && templateUrl) {
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
        <div className="cv-builder-container2">
            {showPDFUploader && resumeDataForUpload && (
                <>
                    <p>מעלה קובץ...</p>
                    <PDFUploader data={resumeDataForUpload} />
                </>
            )}
            <div className="cv-builder-container">
                <div className="form-section">
                    <div className="create-cv-container">
                        <form onSubmit={handleSubmit} className="cv-form">
                            <PersonalInfoSection
                                firstName={cvData.firstName}
                                lastName={cvData.lastName}
                                role={cvData.role}
                                email={cvData.email}
                                phone={cvData.phone}
                                summary={cvData.summary} 
                                onUpdate={handlePersonalInfoUpdate}
                            />

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
                            <button type="submit" className="submit-btn">
                                שמור
                            </button>
                        </form>
                        <button
                            onClick={downloadPDF}
                            style={{
                                marginTop: "20px",
                                padding: "10px",
                                background: "#008080",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            הורד PDF
                        </button>
                    </div>
                </div>
                <div className="preview-section">
                    <CVPreview data={cvData} />
                </div>
            </div>
        </div>
    )
}

export default CreateCV
