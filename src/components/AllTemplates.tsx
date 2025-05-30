import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import '../styles/AllTemplates.css'

const AllTemplates = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL
    const [files, setFiles] = useState<{ id: number; name: string; templateUrl: string; inUse: boolean }[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [centerIndex, setCenterIndex] = useState<number | null>(null)
    
    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return
            const container = scrollRef.current
            const center = container.scrollLeft + container.offsetWidth / 2
            let closestIndex = 0
            let closestDistance = Number.POSITIVE_INFINITY
            Array.from(container.children).forEach((child, i) => {
                const rect = (child as HTMLElement).getBoundingClientRect()
                const childCenter = rect.left + rect.width / 2
                const distance = Math.abs(childCenter - window.innerWidth / 2)

                if (distance < closestDistance) {
                    closestDistance = distance
                    closestIndex = i
                }
            })
            setCenterIndex(closestIndex)
        }
        const container = scrollRef.current
        container?.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => container?.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true)
                setError(null)
                const token = localStorage.getItem("token")
                const response = await axios.get(`${baseUrl}/api/Template/files`, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                })
                if (Array.isArray(response.data)) {
                    setFiles(response.data)
                }
            } catch (error) {
                console.error("Error fetching files:", error)
                setError("אירעה שגיאה בעת טעינת התבניות.")
            } finally {
                setLoading(false)
            }
        }
        fetchFiles()
    }, [baseUrl])

    const handleFileClick = async (index: number) => {
        try {
            const token = localStorage.getItem("token")
            const template = files[index]
            const { data } = await axios.get(`${baseUrl}/api/Template/${template.id}`, {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            })
            navigate(`/create-cv`, { state: { selectedFileIndex: index, fileUrl: data } })
        } catch (error) {
            console.error("Error fetching selected file:", error)
        }
    }

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 300
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            })
        }
    }

    const renderTemplates = () => (
        <div ref={scrollRef} className="templates-gallery">
            {files.map((template, index) => (
                <div
                    key={template.id}
                    onClick={() => handleFileClick(index)}
                    className={`template-card ${index === centerIndex ? "center" : ""} ${!template.inUse ? "disabled" : ""}`}
                >
                    <img
                        src={template.templateUrl || "/placeholder.svg"}
                        alt={template.name}
                        width="400"
                        height="550"
                        className="template-image"
                    />
                </div>
            ))}
        </div>
    )

    return (
        <div className="all-templates-container">
            <div className="geometric-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>

            <h2 className="templates-title">בחר תבנית</h2>

            {loading ? (
             <div className="loading-container">
             <div className="loading-spinner"></div>
             <p>טוען תבנית...</p>
           </div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="gallery-container">
                    <button className="scroll-arrow left" onClick={() => scroll("left")}>
                        <div className="arrow-icon arrow-left"></div>
                    </button>

                    {renderTemplates()}

                    <button className="scroll-arrow right" onClick={() => scroll("right")}>
                        <div className="arrow-icon arrow-right"></div>
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllTemplates
