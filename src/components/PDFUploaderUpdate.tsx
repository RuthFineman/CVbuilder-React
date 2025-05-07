import { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const PDFUploaderPDFUploaderUpdate = ({ data }: {
    data: {
        id:string,
        template:string,
        firstName: string;
        lastName: string;
        fileName:string,
        role: string;
        email: string;
        phone: string;
        summary: string;
        WorkExperiences: any[];
        educations: { institution: string; degree: string }[];
        skills: string[];
        languages: { language: string; level: string }[];
    }
}) => {
    // const [hasUploaded, setHasUploaded] = useState(false);  
    const element = document.getElementById("resume");
    console.log("=====מתוך עדכוןןןןןןןן==")
    console.log(data.template)
    console.log("=====מתוךךך  עדכוןןןןןן======")

    const uploadToS3 = async (file: File) => {
        console.log("uploadToS3 called");
        if (!file || file.size === 0) {
            console.error("No file selected or file is empty.");
            return;
        }
        // useEffect(() => {
        //     if (selectedResume.templateName) {
        //       const link = document.createElement("link");
        //       link.rel = "stylesheet";
        //       link.href = `/styles/${selectedResume.templateName}.css`;
        //       document.head.appendChild(link);
        //       return () => {
        //         document.head.removeChild(link);
        //       };
        //     }
        //   }, [selectedResume]);
          
        const id = localStorage.getItem("userId")!;
        const token = localStorage.getItem("token")!;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", id);
        formData.append("fileName", file.name);
        formData.append("Template", data.template);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("role", data.role);
        formData.append("Phone", data.phone);
        formData.append("email", data.email);
        formData.append("summary", data.summary);
        formData.append("WorkExperiences", JSON.stringify(data.WorkExperiences));
        formData.append("languages", JSON.stringify(data.languages));
        formData.append("educations", JSON.stringify(data.educations));
        formData.append("skills", JSON.stringify(data.skills));

        try {
            const response = await axios.put(`https://localhost:7020/upload/update/${data.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("עדכון קובץ הצליח", response.data);
            // setHasUploaded(true);  // לאחר שהקובץ הועלה, נעדכן את ה-state
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error uploading the file to S3 עדכוןןן נכשל", error.response?.data || error);
            } else {
                console.error("Unexpected error עדכון נכשלל ", error);
            }
        }
    };

    const createAndUploadPDF = async () => {
        // אם כבר הועלה, אל תיצור קובץ נוסף
        // if (hasUploaded) return;  

        console.log("createAndUploadPDF called");

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
        createAndUploadPDF();
    }, [data]);
    return null;
};

export default PDFUploaderPDFUploaderUpdate;
