import { memo } from "react"
import { skillOptions } from "../../data/skill-options"
import { SkillsSectionProps } from "../../types/type"

const SkillsSection = memo(({ skills, onToggle }: SkillsSectionProps) => {
  return (
    <div className="form-section-item">
      <h2 className="section-title">מיומנויות</h2>
      <div className="skills-selection">
        {skillOptions.map((skill, index) => (
          <label key={index} className="skill-option">
            <input
              type="checkbox"
              checked={skills.includes(skill)}
              onChange={() => onToggle(skill)}
            />
            <span>{skill}</span>
          </label>
        ))}
      </div>
    </div>
  )
})

SkillsSection.displayName = "SkillsSection"

export default SkillsSection