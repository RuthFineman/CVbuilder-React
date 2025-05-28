import type React from "react"
import { CVData, Education, Language, WorkExperience } from "../../hooks/use-cv-data"
import { skillOptions } from "../../data/skill-options"

interface FormSectionsProps {
  cvData: CVData
  updateField: (field: string, value: string) => void
  addWorkExperience: () => void
  updateWorkExperience: (index: number, field: keyof WorkExperience, value: string) => void
  removeWorkExperience: (index: number) => void
  addEducation: () => void
  updateEducation: (index: number, field: keyof Education, value: string) => void
  removeEducation: (index: number) => void
  addLanguage: () => void
  updateLanguage: (index: number, field: keyof Language, value: string) => void
  removeLanguage: (index: number) => void
  toggleSkill: (skill: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const FormSections: React.FC<FormSectionsProps> = ({
  cvData,
  updateField,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addLanguage,
  updateLanguage,
  removeLanguage,
  toggleSkill,
  onSubmit,
}) => {
  return (
    <div className="create-cv-container">
      <form onSubmit={onSubmit} className="cv-form">
        {/* פרטים אישיים */}
        <div className="form-section-item">
          <h2 className="section-title">פרטים אישיים</h2>
          <div className="personal-info-grid">
            <input
              type="text"
              placeholder="שם פרטי"
              value={cvData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="שם משפחה"
              value={cvData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="תפקיד"
              value={cvData.role}
              onChange={(e) => updateField("role", e.target.value)}
              className="form-input role-input"
            />
            <input
              type="email"
              placeholder="מייל"
              value={cvData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="form-input"
            />
            <input
              type="tel"
              placeholder="טלפון"
              value={cvData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="form-input"
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <textarea
              placeholder="תקציר מקצועי..."
              value={cvData.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              className="form-textarea"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* ניסיון תעסוקתי */}
        <div className="form-section-item">
          <h2 className="section-title">ניסיון תעסוקתי</h2>
          {cvData.workExperiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <button type="button" onClick={() => removeWorkExperience(index)} className="delete-btn">
                🗑️
              </button>
              <div className="experience-grid">
                <input
                  type="text"
                  placeholder="שם החברה"
                  value={exp.company}
                  onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="תפקיד"
                  value={exp.position}
                  onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                  className="form-input"
                />
                <div className="experience-dates">
                  <input
                    type="text"
                    placeholder="שנת התחלה"
                    value={exp.startDate}
                    onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="שנת סיום"
                    value={exp.endDate}
                    onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="description-section">
                  <textarea
                    placeholder="תיאור התפקיד וההישגים..."
                    value={exp.description}
                    onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addWorkExperience} className="add-btn">
            ➕ הוסף ניסיון עבודה
          </button>
        </div>

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
  )
}

export default FormSections