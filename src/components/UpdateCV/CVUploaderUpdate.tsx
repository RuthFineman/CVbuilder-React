import { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { CVData } from "../../types/type";

const PDFUploaderUpdate = ({ data }: { data: CVData }) => {
 
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

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

    if (!file || file.size === 0) {
      console.error("No file selected or file is empty.");
      return;
    }
    const id = localStorage.getItem("userId")!;
    const token = localStorage.getItem("token")!;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", id);
    formData.append("fileName", data.fileName);
    formData.append("fileUrl", data.fileUrl);
    formData.append("template", data.template);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("role", data.role);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("summary", data.summary);
    appendArrayToFormData(formData, data.workExperiences, "workExperiences");
    appendArrayToFormData(formData, data.languages, "languages");
    appendArrayToFormData(formData, data.educations, "educations");
    data.skills.forEach((skill, index) => {
      formData.append(`skills[${index}]`, skill);
    });
    try {
      const updateResponse = await axios.put(`${baseUrl}/file-cv/update/${data.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (updateResponse.status === 200) {
        setIsUpdating(false);
        navigate("/cvs");
      } else {
        console.error("Update failed");
        setIsUpdating(false);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert("אין לך הרשאה לעדכן את הקובץ. נא להתחבר שוב או לבדוק את ההרשאות שלך.");
        } else {
          console.error("שגיאה בעדכון הנתונים - סטטוס:", error.response?.status);
          console.error("שגיאה בעדכון הנתונים - headers:", error.response?.headers);
          console.error("שגיאה בעדכון הנתונים - data:", JSON.stringify(error.response?.data, null, 2));
          alert("אירעה שגיאה בעדכון. נסה שוב.");
        }
      } else {
        console.error("שגיאה לא צפויה בעדכון", error);
        alert("שגיאה כללית בעדכון.");
      }
      setIsUpdating(false);
    }}

    const createAndUploadImage = async () => {
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
