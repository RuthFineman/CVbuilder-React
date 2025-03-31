import html2pdf from "html2pdf.js";
import './R.css';

const ResumeDisplay = ({ data }: { data: { firstName: string; lastName: string; email: string; phone: string; summary: string; workExperiences?: any[] } }) => {
    const downloadPDF = () => {
        const element = document.getElementById("resume");
        if (!element) return;

        html2pdf().from(element).set({
            margin: 1,
            filename: "resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { dpi: 192, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        }).save();
    };

    return (
        <>
            <div id="resume" className="resume-container">
                <div className="header">
                    <h1>{data.firstName} {data.lastName}</h1>
                </div>
                <div className="summary">
                    <p>{data.summary}</p>
                </div>
                <div className="personal-details">
                    <h2>פרטים אישיים</h2>
                    <div className="contact-info">
                        <p>{data.email}</p>
                        <p>{data.phone}</p>
                    </div>
                </div>

                <div className="work-experiences">
                    <h2 className="section-title">ניסיון תעסוקתי</h2>
                    {data.workExperiences?.length ? (
                        data.workExperiences.map((exp, index) => (
                            <div key={index} className="work-experience">
                                <div className="company-name">{exp.company}</div>
                                <div className="work-dates">{exp.startDate} - {exp.endDate}</div>
                                <div className="work-description">{exp.description}</div>
                            </div>
                        ))
                    ) : (
                        <p>אין חוויות עבודה זמינות</p>
                    )}
                </div>
            </div>
            <button onClick={downloadPDF}>הורד קובץ PDF</button>
        </>
    );
};

export default ResumeDisplay;
