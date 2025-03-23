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
            return; // אם הקובץ כבר נבחר, אל תעשה כלום
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

    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
            {/* רשימת תמונות */}
            <ul
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "15px",
                    listStyle: "none",
                    padding: 0,
                    flex: 1,
                }}
            >
                {files.map(({ url }, index) => (
                    <li
                        key={index}
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            border: selectedFileIndex === index ? "2px solid #4CAF50" : "none",
                            borderRadius: "8px",
                            padding: "10px",
                        }}
                        onClick={() => handleFileClick(index)}
                    >
                        <img
                            src={url.startsWith("http") ? url : `https://cvfilebuilder.s3.amazonaws.com/exampleCV/${url.replace(".pdf", ".png")}`}
                            alt="Template"
                            width="150"
                            height="150"
                            style={{ objectFit: "contain", borderRadius: "8px" }}
                        />
                    </li>
                ))}
            </ul>

            {/* תצוגת PDF בצד שמאל */}
            {selectedFile && (
                <div style={{ flex: 1, paddingLeft: "20px" }}>
                    <h3>תצוגת PDF</h3>
                    <iframe
                        src={selectedFile.url}
                        title="PDF Preview"
                        width="100%"
                        height="600px"
                        style={{
                            border: "2px solid #ddd",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default AllTemplates;
