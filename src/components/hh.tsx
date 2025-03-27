import React from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";

const ResumeEditor = () => {
  const [image] = useImage("/template.jpg"); // טענת התמונה כרקע

  // נתוני המשתמש - ניתן לשנות כאן ישירות
  const userData = {
    name: "ישראל ישראלי",
    email: "israel@example.com",
    phone: "050-1234567",
    address: "תל אביב, ישראל",
    experience: "מנהל פרויקטים - 5 שנות ניסיון",
    education: "תואר ראשון במדעי המחשב",
  };

  return (
    <Stage width={600} height={800}>
      <Layer>
        {/* תמונת הרקע של התבנית */}
        {image && <Image image={image} width={600} height={800} />}
        
        {/* טקסטים שממוקמים לפי תבנית קבועה */}
        <Text text={`שם: ${userData.name}`} x={50} y={100} fontSize={20} fill="black" />
        <Text text={`אימייל: ${userData.email}`} x={50} y={140} fontSize={20} fill="black" />
        <Text text={`טלפון: ${userData.phone}`} x={50} y={180} fontSize={20} fill="black" />
        <Text text={`כתובת: ${userData.address}`} x={50} y={220} fontSize={20} fill="black" />
        <Text text={`ניסיון תעסוקתי: ${userData.experience}`} x={50} y={260} fontSize={20} fill="black" />
        <Text text={`השכלה: ${userData.education}`} x={50} y={300} fontSize={20} fill="black" />
      </Layer>
    </Stage>
  );
};

export default ResumeEditor;
