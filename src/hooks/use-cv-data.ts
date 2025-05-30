import { useState } from "react"
import { CVData, Education, Language, WorkExperience } from "../types/type"

export const useCVData = () => {
  const [cvData, setCVData] = useState<CVData>({
    id: "",
    template: "",
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phone: "",
    summary: "",
    workExperiences: [],
    educations: [],
    skills: [],
    languages: [],
  })

  const updateField = (field: keyof CVData, value: any) => {
    setCVData((prev) => ({ ...prev, [field]: value }))
  }

  const addWorkExperience = () => {
    setCVData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }))
  }

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    setCVData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeWorkExperience = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index),
    }))
  }

  const addEducation = () => {
    setCVData((prev) => ({
      ...prev,
      educations: [...prev.educations, { institution: "", degree: "" }],
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setCVData((prev) => ({
      ...prev,
      educations: prev.educations.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }))
  }

  const addLanguage = () => {
    setCVData((prev) => ({
      ...prev,
      languages: [...prev.languages, { languageName: "", level: "" }],
    }))
  }

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang)),
    }))
  }

  const removeLanguage = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }))
  }

  const toggleSkill = (skill: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  return {
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
  }
}
