import html2canvas from "html2canvas";
import { useEffect} from "react";
import axios from "axios";
import { CVData } from "../../types/type";

const CVUploader = ({ data }: { data: CVData }) => {

    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const uploadCVData = async (file: File) => {
        if (!file || file.size === 0) {
            console.error("No file selected or file is empty.");
            return;
        }
        const id = localStorage.getItem("userId")!;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", id);
        formData.append("fileName", file.name);
        formData.append("Template", data.fileUrl);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("role", data.role);
        formData.append("phone", data.phone);
        formData.append("email", data.email);
        formData.append("summary", data.summary);
        formData.append("WorkExperiences", JSON.stringify(data.workExperiences));
        formData.append("Languages", JSON.stringify(data.languages));
        formData.append("Educations", JSON.stringify(data.educations));
        formData.append("Skills", JSON.stringify(data.skills));
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${baseUrl}/file-cv`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    alert("אין לך הרשאה לבצע פעולה זו. נא להתחבר מחדש או לפנות למנהל המערכת.");
                } else {
                    console.error("שגיאה בהעלאת הקובץ:", error.response?.data || error);
                    alert("אירעה שגיאה בעת ההעלאה. נסה שוב.");
                }
            } else {
                console.error("שגיאה לא צפויה:", error);
                alert("שגיאה כללית. נסה שוב.");
            }
        }
    };
    const createAndUploadImage = async () => {
        const resumeElement = document.getElementById("resume");
        if (!resumeElement) {
          console.error("Resume element not found");
          return;
        }
        try {
          const canvas = await html2canvas(resumeElement);
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.95)
          );
      
          if (!blob) {
            console.error("Failed to create image blob");
            return;
          }
      
          const uniqueId = Date.now(); 
          const fileName = `${data.firstName}_${data.lastName}_${uniqueId}.jpg`;
          const file = new File([blob], fileName, { type: "image/jpeg" });
          
      
          await uploadCVData(file); 
        } catch (error) {
          console.error("Error generating image:", error);
        }
      };
    useEffect(() => {
        if (data) {
            createAndUploadImage();
          }
    }, [data]);
    return null;

};
export default CVUploader;
