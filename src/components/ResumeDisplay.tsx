import './ResumeDisplay2.css';
import PDFUploader from "./PDFUploader";
import { useState } from 'react';

const ResumeDisplay = ({ data }: {
data: {
firstName: string;
lastName: string;
email: string;
phone: string;
summary: string;
workExperiences?: any[];
educations?: { institution: string; degree: string; }[];
skills?: string[];
}
}) => {
const [colorPickerVisible, setColorPickerVisible] = useState(false);
const [customColor, setCustomColor] = useState('#000000');

const changeColor = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color);
    setCustomColor(color);
};

const colors = ['#ab9b87', '#96858f', '#a5aaab', '#000000','#6c7fa0'];

return (
    <>
        <button onClick={() => { setColorPickerVisible(!colorPickerVisible); }}>שנה צבע</button>

        {colorPickerVisible && (
            <div id="colorPicker" style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className="color"
                        style={{ backgroundColor: color, width: '30px', height: '30px', cursor: 'pointer' }}
                        onClick={() => changeColor(color)}
                    />
                ))}
                {/* בורר צבעים אינסופי */}
                <input
                    type="color"
                    value={customColor}
                    onChange={(e) => changeColor(e.target.value)}
                    style={{ width: '40px', height: '30px', border: 'none', cursor: 'pointer' }}
                />
            </div>
        )}

        <PDFUploader firstName={data.firstName} lastName={data.lastName} />
        <div id="resume" className="resume-container">
            <div className="header">
                <h1>{data.firstName} {data.lastName}</h1>
                <h3>הגדרת תפקיד</h3>
            </div>
            <div className="summary">
                <div></div>
                <p>{data.summary}</p>
            </div>
            <div className="left-column">
                <div className="personal-details">
                    <h2>פרטים אישיים</h2>
                    <div className="contact-info">
                        <p >{data.email}</p>
                        <p>{data.phone}</p>
                    </div>
                </div>

                <div className="skills-section">
                    <h2>מיומנויות</h2>
                    {data.skills?.length ? (
                        <ul className="skills-list">
                            {data.skills.map((skill, index) => (
                                <li key={index} className="skill-item">{skill}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין מיומנויות שנבחרו</p>
                    )}
                </div>
            </div>

            <div className="work-experiences">
                <h2>ניסיון תעסוקתי</h2>
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

            <div className="education-section">
                <h2>השכלה</h2>
                {data.educations?.length ? (
                    data.educations.map((edu, index) => (
                        <div key={index} className="education-item">
                            <div className="education-degree-institution">{edu.degree}-{edu.institution}</div>
                        </div>
                    ))
                ) : (
                    <p>אין מידע על השכלה</p>
                )}
            </div>
        </div>
    </>
);
};

export default ResumeDisplay;

