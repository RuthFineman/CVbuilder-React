import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import PDFUploader from "./PDFUploader";

const ResumeDisplay = ({ data }: {
  data: {
    firstName: string;
    lastName: string;
    templateUrl: string;
    role: string;
    email: string;
    phone: string;
    summary: string;
    workExperiences?: any[];
    educations?: { institution: string; degree: string }[];
    skills?: string[];
    languages?: { languageName: string; level: string }[];
  }
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedFileIndex = location.state?.selectedFileIndex;
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [cssLoaded, setCssLoaded] = useState(false);
  // const colors = ['#ab9b87', '#96858f', '#a5aaab', '#000000', '#6c7fa0', '#00675d'];
  useEffect(() => {
    if (selectedFileIndex !== undefined) {
      const fetchTemplate = async () => {
        try {
          const cssUrl = `https://cvfilebuilder.s3.eu-north-1.amazonaws.com/cv-styles/${selectedFileIndex}.css`;
          data.templateUrl = cssUrl;
        } catch (err) {
          console.error("שגיאה בשליפת תבנית", err);
        }
      };
      fetchTemplate();
    }
  }, [selectedFileIndex]);

  useLayoutEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = data.templateUrl;
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [data.templateUrl]);


  if (!cssLoaded) return null;
  const defaultData = {
    workExperiences: [],
    educations: [],
    skills: [],
    languages: [],
    ...data,
  };
  const changeColor = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color);
    setCustomColor(color);
  };
  const downloadPDF = () => {
    const resumeElement = document.getElementById("resume");
    if (!resumeElement) return;

    const options = {
      margin: 0,
      filename: `Resume_${data.firstName}_${data.lastName}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 3, dpi: 300, letterRendering: true, useCORS: true },
      jsPDF: { unit: 'mm', format: [210, 297], orientation: 'portrait' }
    };

    html2pdf().set(options).from(resumeElement).save();
  };
  return (
    <>
      <button type="button" onClick={() => navigate("/CVs")}>
        ⬅️
      </button>
      <button onClick={() => setColorPickerVisible(!colorPickerVisible)}>
        שנה צבע
      </button>
      <button
        onClick={downloadPDF}
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#008080",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        הורד PDF
      </button>
      {colorPickerVisible && (
        <div id="colorPicker" style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
          {/* {colors.map((color, index) => (
            <div
              key={`color-${index}`}
              style={{
                backgroundColor: color,
                width: '30px',
                height: '30px',
                cursor: 'pointer'
              }}
              onClick={() => changeColor(color)}
            />
          ))} */}
          <input
            type="color"
            value={customColor}
            onChange={(e) => changeColor(e.target.value)}
            style={{ width: '40px', height: '30px', border: 'none', cursor: 'pointer' }}
          />
        </div>
      )}

      <PDFUploader data={defaultData} />
      <div id="resume" className="resume-container">
        <div className="header">
          <h1>{data.firstName} {data.lastName}</h1>
          <h3>{data.role}</h3>
        </div>

        <div className="summary">
          <p className="fas fa-user"></p>
          <p className="summary1">{data.summary}</p>
        </div>

        <div className="left-column">
          <div className="personal-details">
            <h2>פרטים אישיים</h2>
            <div className="contact-info">
              <p>{data.email}</p>
              <p>{data.phone}</p>
            </div>
          </div>

          <div className="skills-section">
            <h2>מיומנויות</h2>
            {data.skills?.length ? (
              <ul className="skills-list">
                {data.skills.map((skill, index) => (
                  <li key={`skill-${index}`} className="skill-item">{skill}</li>
                ))}
              </ul>
            ) : (
              <p>אין מיומנויות שנבחרו</p>
            )}
          </div>
        </div>

        <div className="work-experiences">
          <h2>ניסיון תעסוקתי</h2>
          <p className="fas fa-briefcase"></p>
          {data.workExperiences?.length ? (
            data.workExperiences.map((exp, index) => (
              <div key={`work-${exp.company}-${index}`} className="work-experience">
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
          <i className="fas fa-graduation-cap"></i>
          {data.educations?.length ? (
            data.educations.map((edu, index) => (
              <div key={`edu-${edu.institution}-${index}`} className="education-item">
                <div className="education-degree-institution">{edu.degree} - {edu.institution}</div>
              </div>
            ))
          ) : (
            <p>אין מידע על השכלה</p>
          )}
        </div>

        <div className="languages-section">
          <h2>שפות</h2>
          {Array.isArray(data.languages) && data.languages.length > 0 ? (
            <ul className="language-item">
              {data.languages.map((lang, index) => (
                <li key={`lang-${index}`}>
                  {lang?.languageName?.trim() && lang?.level?.trim()
                    ? `${lang.languageName} - ${lang.level}`
                    : 'מידע לא זמין'}
                </li>
              ))}
            </ul>
          ) : (
            <p>אין שפות שנבחרו</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeDisplay;
