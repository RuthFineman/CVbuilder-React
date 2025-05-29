import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import axios from "axios";

const CVUploader = ({ data }: {
    data: {
        firstName: string;
        lastName: string;
        templateUrl:string;
        role: string;
        email: string;
        phone: string;
        summary: string;
        workExperiences: any[];
        educations: { institution: string; degree: string }[];
        skills: string[];
        languages: { languageName: string; level: string }[];
    }
}) => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const uploadCVData = async (file: File) => {
        console.log("uploadToS3 called");
        if (!file || file.size === 0) {
            console.error("No file selected or file is empty.");
            return;
        }
        const id = localStorage.getItem("userId")!;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", id);
        formData.append("fileName", file.name);
        formData.append("Template", data.templateUrl);
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
        console.log("PDFUploader")
        console.log(data.workExperiences)
        console.log("PDFUploader")
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${baseUrl}/file-cv`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("File uploaded successfully", response.data);
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
      
          const uniqueId = Date.now(); // מזהה ייחודי על בסיס הזמן
          const fileName = `${data.firstName}_${data.lastName}_${uniqueId}.jpg`;
          const file = new File([blob], fileName, { type: "image/jpeg" });
          
      
          await uploadCVData(file); // שליחה לשרת כמו קודם
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
// import { useEffect } from "react";
// import axios from "axios";
// import html2canvas from "html2canvas";
// import { CVData } from "../hooks/use-cv-data";

// ממשק משותף
// interface CVData {
//   id?: string;
//   template?: string;
//   templateUrl?: string;
//   firstName: string;
//   lastName: string;
//   fileName?: string;
//   role: string;
//   email: string;
//   phone: string;
//   summary: string;
//   workExperiences: any[];
//   educations: { institution: string; degree: string }[];
//   skills: string[];
//   languages: { languageName: string; level: string }[];
// }

// פונקציה משותפת לטיפול בשגיאות
// const handleError = (error: any, isUpdate = false) => {
//   if (axios.isAxiosError(error)) {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       alert(isUpdate 
//         ? "אין לך הרשאה לעדכן את הקובץ. נא להתחבר שוב או לבדוק את ההרשאות שלך."
//         : "אין לך הרשאה לבצע פעולה זו. נא להתחבר מחדש או לפנות למנהל המערכת."
//       );
//     } else {
//       console.error(isUpdate ? "שגיאה בעדכון הנתונים" : "שגיאה בהעלאת הקובץ:", error.response?.data || error);
//       alert(isUpdate ? "אירעה שגיאה בעדכון. נסה שוב." : "אירעה שגיאה בעת ההעלאה. נסה שוב.");
//     }
//   } else {
//     console.error(isUpdate ? "שגיאה לא צפויה בעדכון" : "שגיאה לא צפויה:", error);
//     alert(isUpdate ? "שגיאה כללית בעדכון." : "שגיאה כללית. נסה שוב.");
//   }
// };

// // פונקציה משותפת ליצירת תמונה
// const createImageFromElement = async (data: CVData): Promise<File | null> => {
//   const element = document.getElementById("resume");
//   if (!element) {
//     console.error("The 'resume' element not found.");
//     return null;
//   }

//   try {
//     const canvas = await html2canvas(element, { scale: 2 });
//     const blob = await new Promise<Blob | null>((resolve) =>
//       canvas.toBlob(resolve, "image/jpeg", 0.95)
//     );

//     if (!blob) {
//       console.error("Failed to create image blob");
//       return null;
//     }

//     const uniqueId = Date.now();
//     const fileName = `קורות_חיים_${data.firstName}_${data.lastName}_${uniqueId}.jpg`;
//     return new File([blob], fileName, { type: "image/jpeg" });
//   } catch (error) {
//     console.error("שגיאה ביצירת התמונה", error);
//     return null;
//   }
// };

// // קומפוננטה ליצירת קורות חיים 
// export const CVUploader = ({ data }: { data: CVData }) => {
//   const baseUrl = process.env.REACT_APP_API_BASE_URL;

//   const uploadCVData = async (file: File) => {
//     if (!file || file.size === 0) {
//       console.error("No file selected or file is empty.");
//       return;
//     }

//     const id = localStorage.getItem("userId")!;
//     const token = localStorage.getItem("token");
//     const formData = new FormData();
    
//     formData.append("file", file);
//     formData.append("userId", id);
//     formData.append("fileName", file.name);
//     formData.append("Template", data.template!);
//     formData.append("firstName", data.firstName);
//     formData.append("lastName", data.lastName);
//     formData.append("role", data.role);
//     formData.append("Phone", data.phone);
//     formData.append("email", data.email);
//     formData.append("summary", data.summary);
//     formData.append("WorkExperiences", JSON.stringify(data.workExperiences));
//     formData.append("Languages", JSON.stringify(data.languages));
//     formData.append("Educations", JSON.stringify(data.educations));
//     formData.append("Skills", JSON.stringify(data.skills));

//     try {
//       const response = await axios.post(`${baseUrl}/file-cv`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "Authorization": `Bearer ${token}`
//         }
//       });
//       console.log("File uploaded successfully", response.data);
//     } catch (error) {
//       handleError(error, false);
//     }
//   };

//   const createAndUploadImage = async () => {
//     const imageFile = await createImageFromElement(data);
//     if (imageFile) {
//       await uploadCVData(imageFile);
//     }
//   };

//   useEffect(() => {
//     if (data) {
//       createAndUploadImage();
//     }
//   }, [data]);

//   return null;
// };

// קומפוננטה לעדכון קורות חיים 
// export const PDFUploaderUpdate = ({ data }: { data: CVData & { id: string; template: string } }) => {
//   const baseUrl = process.env.REACT_APP_API_BASE_URL;

//   const appendArrayToFormData = <T extends Record<string, any>>(
//     formData: FormData,
//     array: T[],
//     fieldName: string
//   ): void => {
//     array.forEach((item, index) => {
//       Object.entries(item).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           formData.append(`${fieldName}[${index}].${key}`, String(value));
//         }
//       });
//     });
//   };

//   const uploadCVData = async (file: File) => {
//     if (!file || file.size === 0) {
//       console.error("No file selected or file is empty.");
//       return;
//     }

//     const id = localStorage.getItem("userId")!;
//     const token = localStorage.getItem("token")!;
//     const formData = new FormData();
    
//     formData.append("file", file);
//     formData.append("userId", id);
//     formData.append("fileName", file.name);
//     formData.append("template", data.template);
//     formData.append("firstName", data.firstName);
//     formData.append("lastName", data.lastName);
//     formData.append("role", data.role);
//     formData.append("phone", data.phone);
//     formData.append("email", data.email);
//     formData.append("summary", data.summary);
    
//     appendArrayToFormData(formData, data.workExperiences, "WorkExperiences");
//     appendArrayToFormData(formData, data.languages, "Languages");
//     appendArrayToFormData(formData, data.educations, "Educations");
//     data.skills.forEach((skill, index) => {
//       formData.append(`Skills[${index}]`, skill);
//     });

//     try {
//       const updateResponse = await axios.put(`${baseUrl}/file-cv/update/${data.id}`, formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       console.log("Database update successful", updateResponse.data);
//     } catch (error) {
//       handleError(error, true);
//     }
//   };

//   const createAndUploadImage = async () => {
//     const imageFile = await createImageFromElement(data);
//     if (imageFile) {
//       await uploadCVData(imageFile);
//     }
//   };

//   useEffect(() => {
//     createAndUploadImage();
//   }, [data]);

//   return null;
// };

// export default CVUploader;
