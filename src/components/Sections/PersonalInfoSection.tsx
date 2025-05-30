import { memo, useState } from "react"
import { PersonalInfoSectionProps } from "../../types/type"
import ReadySentences from "../../data/SummarySentences"

const PersonalInfoSection = memo(({ firstName, lastName, role, email, phone, summary, onUpdate }: PersonalInfoSectionProps) => {

  const [showSentenceOptions, setShowSentenceOptions] = useState(false);

  const handleAddSentence = (sentence: string) => {
    const updatedSummary = summary ? `${summary} ${sentence}` : sentence;
    onUpdate("summary", updatedSummary);
    setShowSentenceOptions(false);
  };
  return (
    <div className="form-section-item">
      <h2 className="section-title">פרטים אישיים</h2>
      <div className="personal-info-grid">
        <input
          type="text"
          placeholder="שם פרטי"
          value={firstName}
          onChange={(e) => onUpdate("firstName", e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="שם משפחה"
          value={lastName}
          onChange={(e) => onUpdate("lastName", e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="תפקיד"
          value={role}
          onChange={(e) => onUpdate("role", e.target.value)}
          className="form-input role-input"
        />
        <input
          type="email"
          placeholder="מייל"
          value={email}
          onChange={(e) => onUpdate("email", e.target.value)}
          className="form-input"
        />
        <input
          type="tel"
          placeholder="טלפון"
          value={phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
          className="form-input"
        />
      </div>
      <div 
       style={{ marginTop: "20px" }}>
        <textarea
          placeholder="תקציר מקצועי..."
          value={summary}
          onChange={(e) => onUpdate("summary", e.target.value)}
          className="form-textarea"
        />
        <button
        className="ready-sentences-btn"
          type="button"
          onClick={() => setShowSentenceOptions((prev) => !prev)}
          style={{ marginTop: "10px" }}
        >
          ✨ משפטים מוכנים עבורך
        </button>
        {showSentenceOptions && <ReadySentences onSelect={handleAddSentence} />}
      </div>

    </div>
  )
})

PersonalInfoSection.displayName = "PersonalInfoSection"

export default PersonalInfoSection
