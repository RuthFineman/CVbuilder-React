import { memo } from "react"
import { EducationSectionProps } from "../../types/type"

const EducationSection = memo(({ educations, onAdd, onUpdate, onRemove }: EducationSectionProps) => {
  return (
    <div className="form-section-item">
      <h2 className="section-title">השכלה</h2>
      {educations.map((edu, index) => (
        <div key={index} className="education-item">
          <button type="button" onClick={() => onRemove(index)} className=".delete-btn-red">
            🗑️
          </button>
          <div className="experience-grid">
            <input
              type="text"
              placeholder="מוסד לימודים"
              value={edu.institution}
              onChange={(e) => onUpdate(index, "institution", e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="תואר/תעודה"
              value={edu.degree}
              onChange={(e) => onUpdate(index, "degree", e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="add-btn">
        ➕ הוסף השכלה
      </button>
    </div>
  )
})

EducationSection.displayName = "EducationSection"

export default EducationSection