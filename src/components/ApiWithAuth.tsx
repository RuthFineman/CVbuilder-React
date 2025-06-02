import type React from "react"
import { useState } from "react"
import "../styles/ApiWithAuth.css"
import { env } from "process"

interface CoverLetterForm {
  candidateName: string
  companyName: string
  jobTitle: string
  experience: string
  skills: string
  motivation: string
  contactInfo: string
}

const CoverLetterGenerator: React.FC = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState<CoverLetterForm>({
    candidateName: "",
    companyName: "",
    jobTitle: "",
    experience: "",
    skills: "",
    motivation: "",
    contactInfo: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const baseUrl = process.env.REACT_APP_API_BASE_URL
  const handleInputChange = (field: keyof CoverLetterForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("") 
  }

  const generatePrompt = (data: CoverLetterForm) => {
    return `אתה כותב מכתבי מקדים מקצועי. צור מכתב מקדים באיכות גבוהה בעברית עבור המועמד הבא:

שם המועמד: ${data.candidateName}
שם החברה: ${data.companyName}
התפקיד המבוקש: ${data.jobTitle}
ניסיון רלוונטי: ${data.experience}
כישורים מרכזיים: ${data.skills}
מוטיבציה ועניין: ${data.motivation}
פרטי קשר: ${data.contactInfo}

הנחיות לכתיבת המכתב:
1. התחל בפנייה מכובדת לחברה
2. הזכר את התפקיד הספציפי שמעניין את המועמד
3. הדגש את הניסיון הרלוונטי והכישורים
4. הסבר מדוע המועמד מתאים לתפקיד ולחברה
5. הוסף מוטיבציה אישית ועניין בחברה
6. סיים בקריאה לפעולה מנומסת
7. השתמש בשפה מקצועית אך חמה
8. אורך המכתב צריך להיות בין 200-300 מילים

צור מכתב מקדים מושלם שיבליט את המועמד בצורה הטובה ביותר.`
  }

  const validateForm = () => {
    const requiredFields = ["candidateName", "companyName", "jobTitle", "experience", "skills"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof CoverLetterForm])

    if (missingFields.length > 0) {
      setError("אנא מלא את כל השדות הנדרשים (מסומנים בכוכבית)")
      return false
    }
    return true
  }

  const generateCoverLetter = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const prompt = generatePrompt(formData)

      const response = await fetch(`{baseUrl}/api/Chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          prompt: prompt,
          question: `צור מכתב מקדים עבור ${formData.candidateName} לתפקיד ${formData.jobTitle} בחברת ${formData.companyName}`,
        }),
      })

      if (!response.ok) {
        throw new Error("שגיאה ביצירת המכתב")
      }

      const result = await response.text()
      setGeneratedLetter(result.replace(/"/g, ""))
    } catch (error) {
      console.error("Error:", error)
      setError("אירעה שגיאה ביצירת המכתב. בדוק שהשרת פועל ונסה שוב.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setError("לא ניתן להעתיק את המכתב")
    }
  }

  const downloadAsText = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedLetter], { type: "text/plain;charset=utf-8" })
    element.href = URL.createObjectURL(file)
    element.download = `מכתב_מקדים_${formData.candidateName}_${formData.companyName}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const resetForm = () => {
    setFormData({
      candidateName: "",
      companyName: "",
      jobTitle: "",
      experience: "",
      skills: "",
      motivation: "",
      contactInfo: "",
    })
    setGeneratedLetter("")
    setError("")
  }

  return (
    <div className="cover-letter-container">
      <div className="header">
        <h1 className="title">📄 יוצר מכתבי מקדים</h1>
        <p className="subtitle">צור מכתב מקדים מקצועי ומותאם אישית בעזרת בינה מלאכותית</p>
      </div>

      <div className="main-content">
        {/* טופס הזנת נתונים */}
        <div className="form-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">פרטי המועמד והתפקיד</h2>
              <p className="card-description">מלא את הפרטים הבאים כדי ליצור מכתב מקדים מותאם אישית</p>
            </div>

            <div className="card-content">
              {error && <div className="error-message">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="candidateName">שם המועמד *</label>
                  <input
                    id="candidateName"
                    type="text"
                    placeholder="השם המלא שלך"
                    value={formData.candidateName}
                    onChange={(e) => handleInputChange("candidateName", e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="companyName">שם החברה *</label>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="שם החברה שאליה פונים"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="jobTitle">התפקיד המבוקש *</label>
                <input
                  id="jobTitle"
                  type="text"
                  placeholder="למשל: מפתח Full Stack, מנהל פרויקטים"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience">ניסיון רלוונטי *</label>
                <textarea
                  id="experience"
                  placeholder="תאר את הניסיון המקצועי הרלוונטי שלך (2-3 שורות)"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">כישורים מרכזיים *</label>
                <textarea
                  id="skills"
                  placeholder="רשום את הכישורים הטכניים והאישיים הרלוונטיים"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="motivation">מוטיבציה ועניין בחברה</label>
                <textarea
                  id="motivation"
                  placeholder="מדוע אתה מעוניין בתפקיד ובחברה הזו?"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactInfo">פרטי קשר</label>
                <input
                  id="contactInfo"
                  type="text"
                  placeholder="אימייל, טלפון (אופציונלי)"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="button-group">
                <button onClick={generateCoverLetter} disabled={isLoading} className="btn btn-primary">
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      יוצר מכתב מקדים...
                    </>
                  ) : (
                    <>📄 צור מכתב מקדים</>
                  )}
                </button>

                <button onClick={resetForm} className="btn btn-secondary">
                  🔄 נקה טופס
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* תצוגת התוצאה */}
        <div className="result-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">המכתב המקדים שלך</h2>
              <p className="card-description">
                {generatedLetter ? "המכתב המקדים המותאם אישית שלך מוכן!" : "המכתב יופיע כאן לאחר יצירתו"}
              </p>
            </div>

            <div className="card-content">
              {generatedLetter ? (
                <div className="result-content">
                  <div className="letter-display">
                    <pre className="letter-text">{generatedLetter}</pre>
                  </div>

                  <div className="action-buttons">
                    <button onClick={copyToClipboard} className="btn btn-outline">
                      {copied ? <>✅ הועתק!</> : <>📋 העתק</>}
                    </button>
                    <button onClick={downloadAsText} className="btn btn-outline">
                      💾 הורד כקובץ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <p>מלא את הפרטים בטופס ולחץ על "צור מכתב מקדים"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoverLetterGenerator
