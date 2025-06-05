import type React from "react"
import { useCallback, useState } from "react"
import "../styles/CoverLetterBot.css"
import { CoverLetterForm } from "../types/type"


const CoverLetterGenerator: React.FC = () => {
  const token = localStorage.getItem("token")
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
8. אורך המכתב צריך להיות בין 200-250 מילים
9. **אל תכלול תאריך במכתב**
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

      const response = await fetch(`${baseUrl}/api/Chat`, {
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
    <div className="coverletter-app-wrapper">
      <div className="coverletter-bg-decorations">
        <div className="coverletter-floating-shape coverletter-shape-1"></div>
        <div className="coverletter-floating-shape coverletter-shape-2"></div>
        <div className="coverletter-floating-shape coverletter-shape-3"></div>
        <div className="coverletter-floating-shape coverletter-shape-4"></div>
        <div className="coverletter-floating-shape coverletter-shape-5"></div>
        <div className="coverletter-floating-shape coverletter-shape-6"></div>
      </div>

      <div className="coverletter-hero-section">
        <div className="coverletter-hero-content">
          <h1 className="coverletter-brand-title">COVER LETTER GENERATOR</h1>
          <h2 className="coverletter-main-heading">צור מכתב מקדים מקצועי בקלות ובמהירות</h2>
          <p className="coverletter-hero-description">
            צור מכתבי מקדים מרשימים עם טכנולוגיית בינה מלאכותית מתקדמת.
          </p>
        </div>
      </div>

      <div className="coverletter-main-app">
        <div className="coverletter-app-container">
          <div className="coverletter-form-panel">
            <div className="coverletter-panel-header">
              <div className="coverletter-header-icon">✍️</div>
              <h3 className="coverletter-panel-title">פרטי המועמד</h3>
              <p className="coverletter-panel-subtitle">מלא את הפרטים ליצירת מכתב מותאם אישית</p>
            </div>

            {error && (
              <div className="coverletter-error-alert">
                <span className="coverletter-error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="coverletter-compact-form">
              <div className="coverletter-triple-row">
                <div className="coverletter-input-group">
                  <label className="coverletter-input-label">שם מלא *</label>
                  <input
                    type="text"
                    placeholder="השם המלא שלך"
                    value={formData.candidateName}
                    onChange={(e) => handleInputChange("candidateName", e.target.value)}
                    className="coverletter-text-input"
                  />
                </div>
                <div className="coverletter-input-group">
                  <label className="coverletter-input-label">שם החברה *</label>
                  <input
                    type="text"
                    placeholder="שם החברה"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="coverletter-text-input"
                  />
                </div>
                <div className="coverletter-input-group">
                  <label className="coverletter-input-label">התפקיד המבוקש *</label>
                  <input
                    type="text"
                    placeholder="תפקיד"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    className="coverletter-text-input"
                  />
                </div>
              </div>

              <div className="coverletter-double-row">
                <div className="coverletter-input-group">
                  <label className="coverletter-input-label">ניסיון רלוונטי *</label>
                  <textarea
                    placeholder="תאר בקצרה את הניסיון שלך"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    className="coverletter-textarea-compact"
                    rows={2}
                  />
                </div>
                <div className="coverletter-input-group">
                  <label className="coverletter-input-label">כישורים מרכזיים *</label>
                  <textarea
                    placeholder="הכישורים הטכניים והאישיים שלך"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    className="coverletter-textarea-compact"
                    rows={2}
                  />
                </div>
              </div>

              <div className="coverletter-double-row">
                <div className="coverletter-input-group">
                  <label className="coverletter-input-label">מוטיבציה</label>
                  <input
                    type="text"
                    placeholder="מדוע אתה מעוניין בתפקיד?"
                    value={formData.motivation}
                    onChange={(e) => handleInputChange("motivation", e.target.value)}
                    className="coverletter-text-input"
                  />
                </div>
                <div className="coverletter-input-group">
                  <label className="coverletter-input-label">פרטי קשר</label>
                  <input
                    type="text"
                    placeholder="אימייל, טלפון (אופציונלי)"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                    className="coverletter-text-input"
                  />
                </div>
              </div>
            </div>

            <div className="coverletter-action-bar">
              <button onClick={generateCoverLetter} disabled={isLoading} className="coverletter-primary-btn">
                {isLoading ? (
                  <>
                    <span className="coverletter-btn-spinner"></span>
                    יוצר מכתב...
                  </>
                ) : (
                  <>
                    <span className="coverletter-btn-icon">🚀</span>
                    צור מכתב מקדים
                  </>
                )}
              </button>
              <button onClick={resetForm} className="coverletter-secondary-btn">
                <span className="coverletter-btn-icon">🔄</span>
                נקה טופס
              </button>
            </div>
          </div>

          <div className="coverletter-results-panel">
            <div className="coverletter-panel-header">
              <div className="coverletter-header-icon">📄</div>
              <h3 className="coverletter-panel-title">המכתב שלך</h3>
              <p className="coverletter-panel-subtitle">
                {generatedLetter ? "המכתב המותאם אישית מוכן!" : "המכתב יופיע כאן"}
              </p>
            </div>

            <div className="coverletter-results-content">
              {generatedLetter ? (
                <>
                  <div className="coverletter-letter-preview">
                    <div className="coverletter-letter-text">{generatedLetter}</div>
                  </div>
                  <div className="coverletter-result-actions">
                    <button onClick={copyToClipboard} className="coverletter-action-btn">
                      <span className="coverletter-btn-icon">{copied ? "✅" : "📋"}</span>
                      {copied ? "הועתק!" : "העתק"}
                    </button>
                    <button onClick={downloadAsText} className="coverletter-action-btn">
                      <span className="coverletter-btn-icon">💾</span>
                      הורד
                    </button>
                  </div>
                </>
              ) : (
                <div className="coverletter-empty-state">
                  <div className="coverletter-empty-icon">📝</div>
                  <h4 className="coverletter-empty-title">מוכן ליצירה</h4>
                  <p className="coverletter-empty-text">מלא את הפרטים ולחץ על "צור מכתב מקדים"</p>
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
