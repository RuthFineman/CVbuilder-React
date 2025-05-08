import { useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const PDFUploaderPDFUploaderUpdate = ({ data }: {
    data: {
        id: string,
        template: string,
        firstName: string;
        lastName: string;
        fileName: string,
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
    // const [hasUploaded, setHasUploaded] = useState(false);  
    // const element = document.getElementById("resume");
    // console.log("=====מתוך עדכוןןןןןןןן==")
    // console.log(data)
    // console.log("=====מתוךךך  עדכוןןןןןן======")
    // function appendArrayToFormData({formData, array, fieldName}:{formData, array, fieldName}) {
    //     array.forEach((item, index) => {
    //         Object.keys(item).forEach(key => {
    //             formData.append(`${fieldName}[${index}].${key}`, item[key]);
    //         });
    //     });
    // }
    function appendArrayToFormData<T extends Record<string, any>>(
        formData: FormData,
        array: T[],
        fieldName: string
      ): void {
        array.forEach((item, index) => {
          Object.entries(item).forEach(([key, value]) => {
            // כדי לוודא שלא נוסיף undefined או null
            if (value !== undefined && value !== null) {
              formData.append(`${fieldName}[${index}].${key}`, String(value));
            }
          });
        });
      }
      
    //לשנות לפונקציה הזאת את השם
    const uploadToS3 = async (file: File) => {
        console.log("uploadToS3 called");
        if (!file || file.size === 0) {
            console.error("No file selected or file is empty.");
            return;
        }

        const id = localStorage.getItem("userId")!;
        const token = localStorage.getItem("token")!;
        const formData = new FormData();
        // console.log("רשימה של המידע שניה  לפני שאני שולחת לשרת פרט אחר פרט")
        formData.append("file", file);
        // console.log(file)
        formData.append("userId", id);
        // console.log(id)
        formData.append("fileName", file.name);
        // console.log(file.name)
        formData.append("template", data.template);
        // console.log(data.template)
        formData.append("firstName", data.firstName);
        // console.log(data.firstName)
        formData.append("lastName", data.lastName);
        // console.log(data.lastName)
        formData.append("role", data.role);
        // console.log(data.role)
        formData.append("phone", data.phone);
        // console.log(data.phone)
        formData.append("email", data.email);
        // console.log(data.email)
        formData.append("summary", data.summary);
        // console.log(data.summary)
        appendArrayToFormData(formData, data.workExperiences, "WorkExperiences");
        appendArrayToFormData(formData, data.languages, "Languages");
        appendArrayToFormData(formData, data.educations, "Educations");
        data.skills.forEach((skill, index) => {
            formData.append(`Skills[${index}]`, skill);
        });
        
        // formData.append("WorkExperiences", JSON.stringify(data.workExperiences));
        // console.log((JSON.stringify(data.workExperiences)).toString())
        // formData.append("languages", JSON.stringify(data.languages));
        // console.log(JSON.stringify(data.languages))
        // formData.append("educations", JSON.stringify(data.educations));
        // console.log(JSON.stringify(data.educations))
        // formData.append("skills", JSON.stringify(data.skills));
        // console.log(JSON.stringify(data.skills))
        try {
            const response = await axios.put(`https://localhost:7020/file-cv/update/${data.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("עדכון הצליח", response.data);
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
