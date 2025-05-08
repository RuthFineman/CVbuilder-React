// types.ts

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
}

export interface Language {
  languageName: string;
  level: string;
}

export interface CVBaseData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  summary: string;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: string[];
  languages: Language[];
}

export interface CVFile {
  id: string;
  path: string;
}

export interface UpdateCVProps {
  file: CVFile;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}
