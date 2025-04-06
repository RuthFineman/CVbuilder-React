import axios from "axios";
import html2pdf from "html2pdf.js";
import { useEffect } from "react";

const PDFUploader = ({ data }: { data: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
    summary: string;
    workExperiences: any[];
    educations: { institution: string; degree: string }[];
    skills: string[];
    languages: { language: string; level: string }[];
} }) => {

    const uploadToS3 = async (file: File) => {
        if (!file || file.size === 0) {
            console.error("No file selected or file is empty.");
            return;
        }
        
        const id = localStorage.getItem("userId")!;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", id);
        formData.append("fileName", file.name);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("role", data.role);
        formData.append("phone", data.phone);
        formData.append("email", data.email);
        formData.append("summary", data.summary);
        formData.append("workExperiences", JSON.stringify(data.workExperiences));
        formData.append("languages", JSON.stringify(data.languages));
        formData.append("educations", JSON.stringify(data.educations));
        formData.append("skills", JSON.stringify(data.skills));
        
        try {
            const response = await axios.post(`https://localhost:7020/upload?userId=${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("File uploaded successfully", response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error uploading the file to S3", error.response?.data || error);
            } else {
                console.error("Unexpected error", error);
            }
        }
    };
    
    const createAndUploadPDF = async () => {
        const element = document.getElementById("resume");
        if (!element) {
            console.error("האלמנט עם ה-ID 'resume' לא נמצא");
            return;
        }
    
        try {
            const pdfBlob = await html2pdf().from(element).output('blob');
            const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
            const uniqueId = Math.floor(1000 + Math.random() * 9000);
            const fileName = `קורות_חיים_${data.firstName}_${data.lastName}_${uniqueId}.pdf`;
    
            const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });
    
            await uploadToS3(pdfFile);
        } catch (error) {
            console.error("שגיאה ביצירת pdf:", error);
        }
    };
    
    useEffect(() => {
        const generateAndUpload = async () => {
            await createAndUploadPDF();
        };
        generateAndUpload();
    }, [data]);
    
    return null;
};

export default PDFUploader;