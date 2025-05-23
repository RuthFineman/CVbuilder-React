import { useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

const PDFUploaderUpdate = ({ data }: {
  data: {
    id: string,
    template: string,
    firstName: string;
    lastName: string;
    fileName: string;
    role: string;
    email: string;
    phone: string;
    summary: string;
    workExperiences: { company: string; position: string; startDate: string; endDate: string; description: string }[];
    educations: { institution: string; degree: string }[];
    skills: string[];
    languages: { languageName: string; level: string }[];
  }
}) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  function appendArrayToFormData<T extends Record<string, any>>(
    formData: FormData,
    array: T[],
    fieldName: string
  ): void {
    array.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`${fieldName}[${index}].${key}`, String(value));
        }
      });
    });
  }

  const uploadCVData = async (file: File) => {
    console.log("uploadToS3 called");

    if (!file || file.size === 0) {
      console.error("No file selected or file is empty.");
      return;
    }

    const id = localStorage.getItem("userId")!;
    const token = localStorage.getItem("token")!;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", id);
    formData.append("fileName", file.name);
    formData.append("template", data.template);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("role", data.role);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("summary", data.summary);
    appendArrayToFormData(formData, data.workExperiences, "WorkExperiences");
    appendArrayToFormData(formData, data.languages, "Languages");
    appendArrayToFormData(formData, data.educations, "Educations");
    data.skills.forEach((skill, index) => {
      formData.append(`Skills[${index}]`, skill);
    });

    try {
      const updateResponse = await axios.put(`${baseUrl}/file-cv/update/${data.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Database update successful", updateResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert("אין לך הרשאה לעדכן את הקובץ. נא להתחבר שוב או לבדוק את ההרשאות שלך.");
        } else {
          console.error("שגיאה בעדכון הנתונים", error.response?.data || error);
          alert("אירעה שגיאה בעדכון. נסה שוב.");
        }
      } else {
        console.error("שגיאה לא צפויה בעדכון", error);
        alert("שגיאה כללית בעדכון.");
      }
    }
  };

  const createAndUploadImage = async () => {
    console.log("createAndUploadImage called");

    const element = document.getElementById("resume");
    if (!element) {
      console.error("The 'resume' element not found.");
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
      );

      if (!blob) {
        console.error("Failed to create image blob");
        return;
      }

      const uniqueId = Date.now();
      const fileName = `קורות_חיים_${data.firstName}_${data.lastName}_${uniqueId}.jpg`;
      const imageFile = new File([blob], fileName, { type: "image/jpeg" });

      await uploadCVData(imageFile);
    } catch (error) {
      console.error("שגיאה ביצירת התמונה", error);
    }
  };

  useEffect(() => {
    createAndUploadImage();
  }, [data]);

  return null;
};

export default PDFUploaderUpdate;
