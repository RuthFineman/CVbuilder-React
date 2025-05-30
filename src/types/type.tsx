export interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (token: string) => void
}

export interface PersonalInfoSectionProps {
  firstName: string
  lastName: string
  role: string
  email: string
  phone: string
  summary: string
  onUpdate: (field: string, value: string) => void
}
export interface WorkExperienceSectionProps {
  workExperiences: WorkExperience[]
  onAdd: () => void
  onUpdate: (index: number, field: keyof WorkExperience, value: string) => void
  onRemove: (index: number) => void
}
export interface SkillsSectionProps {
  skills: string[]
  onToggle: (skill: string) => void
}

export interface PersonalInfoSectionProps {
  firstName: string
  lastName: string
  role: string
  email: string
  phone: string
  summary: string
  onUpdate: (field: string, value: string) => void
}
export interface EducationSectionProps {
  educations: Education[]
  onAdd: () => void
  onUpdate: (index: number, field: keyof Education, value: string) => void
  onRemove: (index: number) => void
}
export interface CVFile {
    id: string
    path: string
  }
  
  export interface LanguageSectionProps {
    languages: Language[]
    onAdd: () => void
    onUpdate: (index: number, field: keyof Language, value: string) => void
    onRemove: (index: number) => void
  }
  
  export interface CVData {
    id: string,
    template: string
    fileName: string
    firstName: string
    lastName: string
    role: string
    email: string
    phone: string
    summary: string
    workExperiences: WorkExperience[]
    educations: Education[]
    skills: string[]
    languages: Language[]
  
  }
  
  export interface WorkExperience {
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }
  
  export interface Education {
    institution: string
    degree: string
  }
  
  export interface Language {
    languageName: string
    level: string
  }