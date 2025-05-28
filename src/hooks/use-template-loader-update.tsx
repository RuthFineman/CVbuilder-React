import { useState, useLayoutEffect } from "react"

export const useTemplateLoaderUpdate = (templateUrl: string) => {
  const [cssLoaded, setCssLoaded] = useState(false)

  useLayoutEffect(() => {
    if (templateUrl && templateUrl.includes("amazonaws")) {
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

  return { cssLoaded }
}
