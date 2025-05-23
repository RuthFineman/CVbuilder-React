import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllTemplates = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    // const [files, setFiles] = useState<{ url: string }[]>([]);
    const [files, setFiles] = useState<{ id: number; name: string; templateUrl: string; inUse: boolean }[]>([]);

    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [centerIndex, setCenterIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;

            const container = scrollRef.current;
            const center = container.scrollLeft + container.offsetWidth / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            Array.from(container.children).forEach((child, i) => {
                const rect = (child as HTMLElement).getBoundingClientRect();
                const childCenter = rect.left + rect.width / 2;
                const distance = Math.abs(childCenter - window.innerWidth / 2);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            });
            setCenterIndex(closestIndex);
        };

        const container = scrollRef.current;
        container?.addEventListener("scroll", handleScroll);
        handleScroll(); // ראשוני

        return () => container?.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // const fetchFiles = async () => {
        //     try {
        //         const token = localStorage.getItem("token");
        //         const response = await axios.get<string[]>("https://localhost:7020/api/Template/files", {
        //             headers: { Authorization: token ? `Bearer ${token}` : "" },
        //         });
        //         setFiles(Array.isArray(response.data) ? response.data.map(url => ({ url })) : []);
        //     } catch (error) {
        //         console.error("Error fetching files:", error);
        //     }
        // };
        const fetchFiles = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${baseUrl}/api/Template/files`, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                });

                if (Array.isArray(response.data)) {
                    setFiles(response.data); // מקבל ישירות את רשימת התבניות
                }
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };
        fetchFiles();
    }, []);

    // const handleFileClick = async (index: number) => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const { data } = await axios.get(`https://localhost:7020/api/Template/${index}`, {
    //             headers: { Authorization: token ? `Bearer ${token}` : "" },
    //         });
    //         navigate(`/createCV`, { state: { selectedFileIndex: index, fileUrl: data } });
    //     } catch (error) {
    //         console.error("Error fetching selected file:", error);
    //     }
    // };
    const handleFileClick = async (index: number) => {
        try {
            const token = localStorage.getItem("token");
            const template = files[index];
            const { data } = await axios.get(`${baseUrl}/api/Template/${template.id}`, {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            navigate(`/createCV`, { state: { selectedFileIndex: index, fileUrl: data } });
        } catch (error) {
            console.error("Error fetching selected file:", error);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={() => navigate("/CVs")}>⬅️</button>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>בחר תבנית</h2>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                {/* חץ שמאלה */}
                <button
                    onClick={() => scroll("left")}
                    style={{
                        position: "absolute",
                        left: 0,
                        zIndex: 1,
                        fontSize: "24px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    ◀
                </button>

                {/* גלריית תבניות בשורה אחת נגללת */}
                <div
                    ref={scrollRef}
                    style={{
                        overflowX: "auto",
                        display: "flex",
                        gap: "20px",
                        padding: "10px 40px",
                        scrollBehavior: "smooth",
                        scrollbarWidth: "none",
                    }}
                >
                    {/* {files.map(({ url }, index) => (
                        <div
                            key={index}
                            onClick={() => handleFileClick(index)}
                            style={{
                                cursor: "pointer",
                                borderRadius: "8px",
                                flex: "0 0 auto",
                                transform: index === centerIndex ? "scale(1.15)" : "scale(1)",
                                transition: "transform 0.3s",
                                zIndex: index === centerIndex ? 2 : 1,
                            }}
                        >
                            <img
                               src={url} 
                                alt="Template"
                                width="400"
                                height="550"
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    boxShadow: index === centerIndex ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
                                    transition: "box-shadow 0.3s",
                                }}
                            />
                        </div>
                    ))} */}
                    {files.map((template, index) => (
                        <div
                            key={template.id ?? index}
                            onClick={() => handleFileClick(index)}
                            style={{
                                cursor: "pointer",
                                borderRadius: "8px",
                                flex: "0 0 auto",
                                transform: index === centerIndex ? "scale(1.15)" : "scale(1)",
                                transition: "transform 0.3s",
                                zIndex: index === centerIndex ? 2 : 1,
                                opacity: template.inUse ? 1 : 0.5, // לדוגמה: אפקט ויזואלי לתבנית שאינה בשימוש
                            }}
                        >
                            <img
                                src={template.templateUrl}
                                alt={template.name}
                                width="400"
                                height="550"
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    boxShadow: index === centerIndex ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
                                    transition: "box-shadow 0.3s",
                                }}
                            />
                        </div>
                    ))}

                </div>
            </div>
            {/* חץ ימינה */}
            <button
                onClick={() => scroll("right")}
                style={{
                    position: "absolute",
                    right: 0,
                    zIndex: 1,
                    fontSize: "24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                ▶
            </button>
        </div>
    );
};

export default AllTemplates;
