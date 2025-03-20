import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllTemplates = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token);

        axios
            .get("https://localhost:7020/api/Template/files", {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })
            .then((response) => {
                setFiles(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching files:", error.response?.status, error.response?.data);
                setLoading(false);
            });
    }, []);

    const handleSelectFile = (file:any) => {
        setSelectedFile(file);
    };

    const handleNext = () => {
        navigate("/create-file-cv", { state: { selectedFile } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>PDF Templates</h2>
            {files.length === 0 ? (
                <p>No files available</p>
            ) : (
                <ul>
                    {files.map((file, index) => (
                        <li
                            key={index}
                            style={{
                                cursor: "pointer",
                                background: selectedFile === file ? "#cce5ff" : "white",
                                padding: "10px",
                                margin: "5px 0",
                                border: "1px solid #ccc",
                            }}
                            onClick={() => handleSelectFile(file)}
                        >
                            <p>
                                <strong>PDF File:</strong>{" "}
                                <a href={file} target="_blank" rel="noopener noreferrer">
                                    {file}
                                </a>
                            </p>
                            <iframe src={file} width="600" height="400" title={`PDF Preview ${index}`}></iframe>
                        </li>
                    ))}
                </ul>
            )}

            {selectedFile && (
                <button onClick={handleNext} style={{ marginTop: "20px", padding: "10px 20px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                    Next
                </button>
            )}
        </div>
    );
};

export default AllTemplates;
