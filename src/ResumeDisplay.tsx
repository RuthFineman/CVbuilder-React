import './R.css';  // ייבוא הקובץ
import html2pdf from 'html2pdf.js';

const ResumeDisplay = ({ data }: { data: { firstName: string; lastName: string; email: string; phone: string } }) => {

    const downloadPDF = () => {
        const element = document.getElementById('resume');
        
        const options = {
            margin:       1,
            filename:     'resume.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { dpi: 192, letterRendering: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(options).save();
    };

    return (
        <>
            <div id="resume" className="resume-container">
                <div className="header">
                    <h1>{data.firstName} {data.lastName}</h1>  {/* השם מופיע כאן */}
                </div>
                <div className="personal-details">
                    <h2>פרטים אישיים</h2>  {/* כותרת "פרטים אישיים" */}
                    <div className="contact-info">
                        <p>{data.email}</p>  {/* הצגת המייל */}
                        <p>{data.phone}</p>  {/* הצגת הטלפון */}
                    </div>
                </div>
                <button onClick={downloadPDF}>הורד קובץ PDF</button>
            </div>
        </>
    );
};

export default ResumeDisplay;
