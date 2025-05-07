import React, { createContext, useContext, useState } from 'react';

// יצירת ה-Context
const CssContext = createContext<any>(null);

export const useCss = () => useContext(CssContext);

// קומפוננטת ה-Provider
export const CssProvider = ({ children }: { children: React.ReactNode }) => {
  const [cssUrl, setCssUrl] = useState<string>("");

  const loadCSSFromS3 = (url: string) => {
    const existingLink = document.getElementById("dynamic-css");
    if (existingLink) existingLink.remove();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.id = "dynamic-css";
    document.head.appendChild(link);
    setCssUrl(url);
  };

  return (
<CssContext.Provider value={{ cssUrl, setCssUrl, loadCSSFromS3 }}>

      {children}
    </CssContext.Provider>
  );
};
