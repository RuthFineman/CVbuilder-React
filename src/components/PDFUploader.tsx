import axios from "axios";
import html2pdf from "html2pdf.js";
import { useEffect } from "react";

const PDFUploader = ({ firstName, lastName }: { firstName: string; lastName: string }) => {
  const uploadToS3 = async (pdfBlob: Blob, fileName: string) => {
    try {
      const formData = new FormData();
      formData.append('file', pdfBlob, fileName);

      await axios.post('https://localhost:7020/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(`קובץ ${fileName} הועלה בהצלחה ל-S3`);
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ ל-S3", error);
    }
  };

  const createAndUploadPDF = async () => {
    const element = document.getElementById("resume");
    if (!element) {
      console.error("האלמנט עם ה-ID 'resume' לא נמצא");
      return;
    }

    try {
      const pdf = await html2pdf().from(element).output('blob');
      const timestamp = new Date().toISOString().replace(/[:.-]/g, "_"); 
      const uniqueId = Math.floor(1000 + Math.random() * 9000); 
      const fileName = `קורות_חיים_${firstName}_${lastName}_${uniqueId}.pdf`;

      await uploadToS3(pdf, fileName);
    } catch (error) {
      console.error("שגיאה ביצירת pdf:", error);
    }
  };

  useEffect(() => {
    createAndUploadPDF();
  }, []);

  return null; // אין צורך ברינדור של אלמנט ויזואלי
};

export default PDFUploader;
