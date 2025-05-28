import { memo } from "react"

interface PersonalInfoSectionProps {
  firstName: string
  lastName: string
  role: string
  email: string
  phone: string
  onUpdate: (field: string, value: string) => void
}

const PersonalInfoSection = memo(({ firstName, lastName, role, email, phone, onUpdate }: PersonalInfoSectionProps) => {
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
    </div>
  )
})

PersonalInfoSection.displayName = "PersonalInfoSection"

export default PersonalInfoSection
