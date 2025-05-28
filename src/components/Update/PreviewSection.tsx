import type React from "react"
import { CVData } from "../../hooks/use-cv-data"

interface PreviewSectionProps {
  data: CVData
  onUpdate: (e: React.FormEvent) => void;
  onDownloadPDF: () => void
  isUpdating: boolean
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  data,
  onUpdate,
  onDownloadPDF,
  isUpdating,
}) => {
  return (
    <div className="preview-section">
      <div className="action-buttons">
        <button
          type="submit"
          onClick={onUpdate}
          disabled={isUpdating}
          className={`update-btn ${isUpdating ? "disabled" : ""}`}
        >
          {isUpdating ? "🔄 מעדכן..." : "✅ עדכן"}
        </button>

        <button onClick={onDownloadPDF} className="download-btn">
          📥 הורד PDF
        </button>
      </div>

      {/* תצוגה מקדימה */}
      <div className="preview-inner">
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
      </div>
    </div>
  )
}

export default PreviewSection