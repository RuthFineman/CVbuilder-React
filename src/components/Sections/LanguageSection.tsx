import { memo } from "react"
import { LanguageSectionProps } from "../../types/type"

const LanguageSection = memo(({ languages, onAdd, onUpdate, onRemove }: LanguageSectionProps) => {
  return (
    <div className="form-section-item">
      <h2 className="section-title">שפות</h2>
      {languages.map((lang, index) => (
        <div key={index} className="language-item">
          <button type="button" onClick={() => onRemove(index)} className=".delete-btn-red">
            🗑️
          </button>
          <div className="experience-grid">
            <input
              type="text"
              placeholder="שפה"
              value={lang.languageName}
              onChange={(e) => onUpdate(index, "languageName", e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="רמה (למשל: שפת אם, טובה מאוד, בסיסית)"
              value={lang.level}
              onChange={(e) => onUpdate(index, "level", e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="add-btn">
        ➕ הוסף שפה
      </button>
    </div>
  )
})

LanguageSection.displayName = "LanguageSection"

export default LanguageSection