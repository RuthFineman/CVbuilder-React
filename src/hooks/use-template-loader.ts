import { useState, useLayoutEffect } from "react"

export const useTemplateLoader = (selectedFileIndex: number | undefined) => {
  const [templateUrl, setTemplateUrl] = useState("")
  const [cssLoaded, setCssLoaded] = useState(false)

  useLayoutEffect(() => {
    if (selectedFileIndex !== undefined) {
      const cssUrl = `https://cvfilebuilder.s3.eu-north-1.amazonaws.com/css-styles/${selectedFileIndex}.css`
      setTemplateUrl(cssUrl)
    }
  }, [selectedFileIndex])

  useLayoutEffect(() => {
    if (templateUrl) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = templateUrl
      link.onload = () => setCssLoaded(true)
      document.head.appendChild(link)

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      }
    }
  }, [templateUrl])

  return { templateUrl, cssLoaded }
}
