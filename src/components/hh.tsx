import { useState } from "react";
const Hh = ({ onSubmit }: { onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string; summary: string; workExperiences: any[] }) => void }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [summary, setSummary] = useState('');
    const [workExperiences, setWorkExperiences] = useState<any[]>([]);

    // פונקציות לעדכון השדות
    const handleFirstNameChange = (e: any) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: any) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handlePhoneChange = (e: any) => {
        setPhone(e.target.value);
    };

    const handleSummaryChange = (e: any) => {
        setSummary(e.target.value);
    };

    // פונקציה לעדכון רשימת חוויות עבודה
    const handleWorkExperienceChange = (index: number, key: string, value: string) => {
        const newWorkExperiences = [...workExperiences];
        newWorkExperiences[index] = { ...newWorkExperiences[index], [key]: value };
        setWorkExperiences(newWorkExperiences);
    };

    // פונקציה להוספת חוויית עבודה חדשה
    const addWorkExperience = () => {
        setWorkExperiences([
            ...workExperiences,
            { company: '', location: '', startDate: '', endDate: '', description: '' }
        ]);
    };

    // שליחת הנתונים
    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit({ firstName, lastName, email, phone, summary, workExperiences }); // שמירה על workExperiences
    };
    
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="שם פרטי" value={firstName} onChange={handleFirstNameChange} />
            <input type="text" placeholder="שם משפחה" value={lastName} onChange={handleLastNameChange} />
            <input type="email" placeholder="מייל" value={email} onChange={handleEmailChange} />
            <input type="tel" placeholder="טלפון" value={phone} onChange={handlePhoneChange} />
            <textarea placeholder="תקציר" value={summary} onChange={handleSummaryChange} rows={4} />
            
            {/* הצגת שדות חוויות עבודה */}
            {workExperiences.map((exp, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="חברה"
                        value={exp.company || ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="מיקום"
                        value={exp.location || ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="שנת התחלה"
                        value={exp.startDate || ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="שנת סיום"
                        value={exp.endDate || ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                    />
                    <textarea
                        placeholder="תיאור"
                        value={exp.description || ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                    />
                    <button type="button" onClick={() => setWorkExperiences(workExperiences.filter((_, i) => i !== index))}>🗑️</button>
                </div>
            ))}
            
            {/* כפתור להוספת חוויית עבודה */}
            <button type="button" onClick={addWorkExperience}>הוסף ניסיון עבודה</button>
            
            <button type="submit">צור קורות חיים</button>
        </form>
    );
};

export default Hh;
