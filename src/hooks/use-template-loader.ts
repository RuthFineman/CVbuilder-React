import { useState, useLayoutEffect } from "react"

export const useTemplateLoader = (selectedFileIndex: number | undefined) => {
  const [fileUrl, setFileUrl] = useState("")
  const [cssLoaded, setCssLoaded] = useState(false)

  useLayoutEffect(() => {
    if (selectedFileIndex !== undefined) {
      const cssUrl = `https://cvfilebuilder.s3.eu-north-1.amazonaws.com/css-styles/${selectedFileIndex}.css`
      setFileUrl(cssUrl)
    }
  }, [selectedFileIndex])

  useLayoutEffect(() => {
    if (fileUrl) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = fileUrl
      link.onload = () => setCssLoaded(true)
      document.head.appendChild(link)

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      }
    }
  }, [fileUrl])

  return {  cvData: { fileUrl }, cssLoaded }
}
