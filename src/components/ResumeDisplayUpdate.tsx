import { useEffect, useLayoutEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import PDFUploaderUpdate from './PDFUploaderUpdate';
import { useLocation } from 'react-router-dom';

const ResumeDisplayUpdate = () => {
  const location = useLocation();
  const fileCV = location.state;
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const colors = ['#ab9b87', '#96858f', '#a5aaab', '#000000', '#6c7fa0', '#00675d'];
  const changeColor = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color);
    setCustomColor(color);
  };
  const [cssLoaded, setCssLoaded] = useState(false);
  useLayoutEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fileCV.template;
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [fileCV.template]);
  
  const downloadPDF = () => {
    const resumeElement = document.getElementById("resume");
    if (!resumeElement) return;
    const options = {
      margin: 0,
      filename: `Resume_${fileCV.firstName}_${fileCV.lastName}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 3, dpi: 300, letterRendering: true, useCORS: true },
      jsPDF: { unit: 'mm', format: [210, 297], orientation: 'portrait' }
    };
    html2pdf().set(options).from(resumeElement).save();
  };
  return (
    <>
      <button onClick={() => setColorPickerVisible(!colorPickerVisible)}>שנה צבע</button>
      <button onClick={downloadPDF} style={{ marginTop: "20px", padding: "10px", background: "#008080", color: "white", border: "none", cursor: "pointer" }}>
        הורד PDF
      </button>

      {colorPickerVisible && (
        <div id="colorPicker" style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
          {colors.map((color, index) => (
            <div
              key={`color-${index}`}
              className="color"
              style={{ backgroundColor: color, width: '30px', height: '30px', cursor: 'pointer' }}
              onClick={() => changeColor(color)}
            />
          ))}
          <input
            type="color"
            value={customColor}
            onChange={(e) => changeColor(e.target.value)}
            style={{ width: '40px', height: '30px', border: 'none', cursor: 'pointer' }}
          />
        </div>
      )}
      
      <PDFUploaderUpdate data={fileCV} />

      <div id="resume" className="resume-container">
        <div className="header">
          <h1>{fileCV.firstName} {fileCV.lastName}</h1>
          <h3>{fileCV.role}</h3>
        </div>

        <div className="summary">
          <p className="fas fa-user"></p>
          <p className="summary1">{fileCV.summary}</p>
        </div>

        <div className="left-column">
          <div className="personal-details">
            <h2>פרטים אישיים</h2>
            <div className="contact-info">
              <p>{fileCV.email}</p>
              <p>{fileCV.phone}</p>
            </div>
          </div>

          <div className="skills-section">
            <h2>מיומנויות</h2>
            {fileCV.skills?.length ? (
              <ul className="skills-list">
                {fileCV.skills.map((skill: string, index: number) => (
                  <li key={`skill-${index}`} className="skill-item">{skill}</li>
                ))
                }
              </ul>
            ) : (
              <p>אין מיומנויות שנבחרו</p>
            )}
          </div>
        </div>

        <div className="work-experiences">
          <h2>ניסיון תעסוקתי</h2>
          <p className="fas fa-briefcase"></p>
          {fileCV.workExperiences?.length ? (
            fileCV.workExperiences.map((exp: { company: string; Position: string, startDate: string; endDate: string; description: string }, index: number) => (
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
          {fileCV.educations?.length ? (
            fileCV.educations.map((edu: { institution: string; degree: string }, index: number) => (
              <div key={`edu-${edu.institution}-${index}`} className="education-item">
                <div className="education-degree-institution">{edu.degree}-{edu.institution}</div>
              </div>
            ))
          ) : (
            <p>אין מידע על השכלה</p>
          )}
        </div>
        <div className="languages-section">
          <h2>שפות</h2>
          {fileCV.languages?.length ? (
            <ul className="language-item">
              {fileCV.languages.map((lang: { language: string; level: string }, index: number) => (
                <li key={`lang-${lang.language}-${index}`}>
                  {lang.language} - {lang.level}
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

export default ResumeDisplayUpdate;
