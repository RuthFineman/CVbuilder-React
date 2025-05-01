export type CVData = {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
    summary: string;
    workExperiences?: {
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
    educations?: {
      institution: string;
      degree: string;
    }[];
    skills?: string[];
    languages?: {
      language: string;
      level: string;
    }[];
  };
  