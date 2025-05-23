"use client"

import { useEffect, useRef, useState } from "react"

interface PDFPreviewProps {
  pdfUrl: string
  title: string
}

export default function PDFPreview({ pdfUrl, title }: PDFPreviewProps) {
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe) {
      iframe.onload = () => {
        setLoading(false)
      }
    }
  }, [])

  return (
    <div className="pdf-preview-container">
      {loading && <div className="pdf-loading">טוען...</div>}
      <iframe 
      ref={iframeRef}
       src={pdfUrl}
        title={`תצוגה מקדימה של ${title}`}
         className="pdf-preview-frame"
         allow="fullscreen"
          />
    </div>
  )
}
