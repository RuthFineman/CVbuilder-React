import { memo, useState } from "react"
import WorkSentences from "../../data/WorkSentences"
import {WorkExperienceSectionProps } from "../../types/type"


const WorkExperienceSection = memo(({ workExperiences, onAdd, onUpdate, onRemove }: WorkExperienceSectionProps) => {

  const [openSentenceIndex, setOpenSentenceIndex] = useState<number | null>(null)
  const addSentenceDesc = (sentence: string) => {
    if (workExperiences.length === 0) return
    const lastIndex = workExperiences.length - 1
    const currentDesc = workExperiences[lastIndex].description
    const newDesc = currentDesc ? `${currentDesc} ${sentence}` : sentence
    onUpdate(lastIndex, "description", newDesc)
    setOpenSentenceIndex(null)
  }
  const toggleSentences = (index: number) => {
    setOpenSentenceIndex(prevIndex => (prevIndex === index ? null : index))
  }

  return (
    <div className="form-section-item">
      <h2 className="section-title">ניסיון תעסוקתי</h2>
      {workExperiences.map((exp, index) => (
        <div key={index} className="experience-item">
          <button type="button" onClick={() => onRemove(index)} className="delete-btn-red">
            🗑️
          </button>
          <div className="experience-grid">
            <input
              type="text"
              placeholder="שם החברה"
              value={exp.company}
              onChange={(e) => onUpdate(index, "company", e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="תפקיד"
              value={exp.position}
              onChange={(e) => onUpdate(index, "position", e.target.value)}
              className="form-input"
            />
            <div className="experience-dates">
              <input
                type="text"
                placeholder="שנת התחלה"
                value={exp.startDate}
                onChange={(e) => onUpdate(index, "startDate", e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="שנת סיום"
                value={exp.endDate}
                onChange={(e) => onUpdate(index, "endDate", e.target.value)}
                className="form-input"
              />
            </div>
            <div className="description-section">
              <textarea
                placeholder="תיאור התפקיד וההישגים..."
                value={exp.description}
                onChange={(e) => onUpdate(index, "description", e.target.value)}
                className="form-textarea"
              />
                <button
                type="button"
                onClick={() => toggleSentences(index)}
                className="ready-sentences-btn"
              >
                ✨ משפטים מוכנים עבורך
              </button>
              {openSentenceIndex === index && (
                <div className="sentences-container">
                  <WorkSentences onSelect={addSentenceDesc} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="add-btn">
        ➕ הוסף ניסיון עבודה
      </button>
    </div>
  )
})

WorkExperienceSection.displayName = "WorkExperienceSection"

export default WorkExperienceSection
