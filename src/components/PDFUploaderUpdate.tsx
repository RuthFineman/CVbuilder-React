import { useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const PDFUploaderPDFUploaderUpdate = ({ data }: {
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
            const updateResponse = await axios.put(`https://localhost:7020/file-cv/update/${data.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("Database update successful", updateResponse.data);

            try {
                const element = document.getElementById("resume");
                if (!element) {
                    console.error("The 'resume' element not found.");
                    return;
                }

                const pdfBlob = await html2pdf().from(element).output('blob');
                const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
                const uniqueId = Math.floor(1000 + Math.random() * 9000);
                const fileName = `קורות_חיים_${data.firstName}_${data.lastName}_${uniqueId}.pdf`;

                const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });
                await uploadCVData(pdfFile);
            } catch (error) {
                console.error("Error uploading file to S3, rolling back database update", error);
                // If uploading to S3 fails, roll back the database update
                // Here you would ideally have a mechanism to undo the DB update if necessary
            }
        } catch (error) {
            console.error("Error updating database", error);
        }
    };

    const createAndUploadPDF = async () => {
        console.log("createAndUploadPDF called");

        const element = document.getElementById("resume");
        if (!element) {
            console.error("The element with ID 'resume' not found.");
            return;
        }

        try {
            const pdfBlob = await html2pdf().from(element).output('blob');
            const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
            const uniqueId = Math.floor(1000 + Math.random() * 9000);
            const fileName = `קורות_חיים_${data.firstName}_${data.lastName}_${uniqueId}.pdf`;

            const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });
            await uploadCVData(pdfFile);
        } catch (error) {
            console.error("Error creating PDF:", error);
        }
    };

    useEffect(() => {
        createAndUploadPDF();
    }, [data]);

    return null;
};

export default PDFUploaderPDFUploaderUpdate;
