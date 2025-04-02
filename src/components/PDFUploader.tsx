import axios from "axios";
import html2pdf from "html2pdf.js";
import { useEffect } from "react";

const PDFUploader = ({ firstName, lastName }: { firstName: string; lastName: string }) => {

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
        try{
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
            const fileName = `קורות_חיים_${firstName}_${lastName}_${uniqueId}.pdf`;

            // יצירת File מתוך Blob
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
    }, [firstName, lastName]);

    return null;
};

export default PDFUploader;
