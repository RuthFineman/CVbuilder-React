import type React from "react"
import { useCallback, useState } from "react"
import "../../styles/CreateCV.css"
import { useLocation, useNavigate } from "react-router-dom"
import html2pdf from "html2pdf.js"
import { useTemplateLoader } from "../../hooks/use-template-loader"
import { useCVData } from "../../hooks/use-cv-data"
import PDFUploader from "./CVUploader"
import { CVData } from "../../types/type"
import LanguageSection from "../Sections/LanguageSection"
import SkillsSection from "../Sections/SkillsSection"
import EducationSection from "../Sections/EducationSection"
import PersonalInfoSection from "../Sections/PersonalInfoSection"
import WorkExperienceSection from "../Sections/WorkExperienceSection"
import CVPreview from "../UpdateCV/CVPreviewUpdate"

const CreateCV = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const selectedFileIndex = location.state?.selectedFileIndex;
    const { templateUrl, cssLoaded } = useTemplateLoader(selectedFileIndex)
    const [resumeDataForUpload, setResumeDataForUpload] = useState<(CVData & { templateUrl: string }) | null>(null)
    const [showPDFUploader, setShowPDFUploader] = useState(false);
    const { cvData, updateField, addWorkExperience, updateWorkExperience, removeWorkExperience, addEducation, updateEducation, removeEducation, addLanguage, updateLanguage, removeLanguage, toggleSkill, } = useCVData()
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
        [cvData, templateUrl, navigate, selectedFileIndex], 
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
            <div className="templateUr-lloaded" > טוען תבנית...</div>
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
                            <PersonalInfoSection firstName={cvData.firstName} lastName={cvData.lastName} role={cvData.role} email={cvData.email} phone={cvData.phone} summary={cvData.summary} onUpdate={handlePersonalInfoUpdate} />
                            <WorkExperienceSection workExperiences={cvData.workExperiences} onAdd={addWorkExperience} onUpdate={updateWorkExperience} onRemove={removeWorkExperience} />
                            <LanguageSection languages={cvData.languages} onAdd={addLanguage} onUpdate={updateLanguage} onRemove={removeLanguage} />
                            <EducationSection educations={cvData.educations} onAdd={addEducation} onUpdate={updateEducation} onRemove={removeEducation} />
                            <SkillsSection skills={cvData.skills} onToggle={toggleSkill} />
                            <button type="submit" className="submit-btn"> שמור </button>
                        </form>
                        <button onClick={downloadPDF} className="button-downloadPDF" > הורד PDF </button>
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
