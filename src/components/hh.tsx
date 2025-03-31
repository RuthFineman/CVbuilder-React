import { useState } from 'react';

const Hh = ({ onSubmit }: { onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string }) => void }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // פונקציה כדי לעדכן את השם הפרטי
    const handleFirstNameChange = (e: any) => {
        setFirstName(e.target.value);
    };

    // פונקציה כדי לעדכן את השם משפחה
    const handleLastNameChange = (e: any) => {
        setLastName(e.target.value);
    };

    // פונקציה כדי לעדכן את המייל
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    // פונקציה כדי לעדכן את הטלפון
    const handlePhoneChange = (e: any) => {
        setPhone(e.target.value);
    };

    // שליחת הנתונים כשממלאים את הטופס
    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit({ firstName, lastName, email, phone });  // מעביר את הנתונים להורה (הקומפוננטה הראשית)
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="שם פרטי"
                    value={firstName}
                    onChange={handleFirstNameChange}
                />
                <input
                    type="text"
                    placeholder="שם משפחה"
                    value={lastName}
                    onChange={handleLastNameChange}
                />
                <input
                    type="email"
                    placeholder="מייל"
                    value={email}
                    onChange={handleEmailChange}
                />
                <input
                    type="tel"
                    placeholder="טלפון"
                    value={phone}
                    onChange={handlePhoneChange}
                />
                <button type="submit">צור קורות חיים</button>
            </form>
        </>
    );
};

export default Hh;
