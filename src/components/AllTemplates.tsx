import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllTemplates = () => {
    const [files, setFiles] = useState<{ url: string }[]>([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<{ url: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get<string[]>("https://localhost:7020/api/Template/files", {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                });

                console.log("Response data:", response.data);

                setFiles(Array.isArray(response.data) ? response.data.map(url => ({ url })) : []);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, []);

    const handleFileClick = async (index: number) => {
        if (selectedFileIndex === index) {
            return;
        }

        setSelectedFileIndex(index);

        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`https://localhost:7020/api/Template/${index}`, {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });

            setSelectedFile({ url: data });
        } catch (error) {
            console.error("Error fetching selected file:", error);
        }
    };

    const handleNextClick = () => {
        console.log("selectedFileIndex before navigation:", selectedFileIndex);
        if (selectedFileIndex !== null) {
            // ניווט לקומפוננטת CreateFileCV עם ה-state שכולל את ה-`selectedFileIndex`
            navigate(`/hh`, { state: { selectedFileIndex } });
            // navigate(`/create-file-cv`, { state: { selectedFileIndex } });

        }
    };
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
            {/* תצוגת תמונה בצד שמאל */}
            <div style={{ flex: 2, paddingRight: "20px", height: "auto", maxWidth: "20%", overflow: "hidden" }}>
                {selectedFile ? (
                    <>
                        <h3>תצוגת תמונה</h3>
                        <img
                            src={selectedFile.url}
                            alt="Template"
                            style={{
                                maxWidth: "100%",
                                height: "auto",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                display: "block",
                                margin: "0 auto",
                            }}
                        />
                    </>
                ) : (
                    <h3>בחר תבנית להצגת תמונה</h3>
                )}
            </div>

            {/* רשימת תמונות בצד ימין */}
            <ul
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "15px",
                    listStyle: "none",
                    padding: 0,
                    flex: 1,
                    textAlign: "center",
                }}
            >
                {files.map(({ url }, index) => (
                    <li
                        key={index}
                        style={{
                            cursor: "pointer",
                            border: selectedFileIndex === index ? "2px solid #4CAF50" : "none",
                            borderRadius: "8px",
                            padding: "10px",
                        }}
                        onClick={() => handleFileClick(index)}
                    >
                        <img
                            src={url.startsWith("http") ? url : `https://cvfilebuilder.s3.amazonaws.com/exampleCV/${url.replace(".pdf", ".jpg")}`}
                            alt="Template"
                            width="100"
                            height="100"
                            style={{ objectFit: "contain", borderRadius: "8px" }}
                        />
                    </li>
                ))}
            </ul>

            {/* כפתור Next */}
            {selectedFileIndex !== null && (
                <div style={{ marginTop: "20px" }}>
                    <button
                        onClick={handleNextClick}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllTemplates;
