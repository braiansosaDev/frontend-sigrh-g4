"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SystemConfigContext = createContext();

export function SystemConfigProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadMockConfig();
  }, []);

  async function loadMockConfig() {
    const logoBase64 = await getBase64FromPublic("/gottert-navbar.png");
    const faviconBase64 = await getBase64FromPublic("/favicon_test.ico");

    const mockConfig = {
      company_name: "Gottert S.A.",
      logo_base64: logoBase64,
      favicon_base64: faviconBase64,
      primary_color: "#1d4ed8",
      secondary_color: "#93c5fd",
      language: "es",
      date_format: "DD/MM/YYYY",
      features: {
        showPayroll: true,
        showDashboard: true,
      },
    };

    // Convertir a data URLs
    mockConfig.logo_url = `data:image/png;base64,${logoBase64}`;
    mockConfig.favicon_url = `data:image/x-icon;base64,${faviconBase64}`;

    // // Aplicar efectos globales
    // const originalTitle = document.title.trim();
    // const companyName = mockConfig.company_name;
    // const hasCompanyInTitle = originalTitle.includes(companyName);

    // document.title = hasCompanyInTitle
    //   ? originalTitle
    //   : originalTitle
    //   ? `${originalTitle} | ${companyName}`
    //   : companyName;

    // document.documentElement.style.setProperty(
    //   "--primary",
    //   mockConfig.primary_color
    // );
    // document.documentElement.style.setProperty(
    //   "--secondary",
    //   mockConfig.secondary_color
    // );

    // // Favicon
    // const existing = document.querySelector("link[rel~='icon']");
    // if (existing) {
    //   existing.href = mockConfig.favicon_url;
    // } else {
    //   const link = document.createElement("link");
    //   link.rel = "icon";
    //   link.href = mockConfig.favicon_url;
    //   document.head.appendChild(link);
    // }

    setConfig(mockConfig);
  }

  // Función auxiliar para cargar imágenes de /public como base64
  async function getBase64FromPublic(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1]; // remove data:mime;base64,
        resolve(base64data);
      };
      reader.readAsDataURL(blob);
    });
  }

  return (
    <SystemConfigContext.Provider value={config}>
      {children}
    </SystemConfigContext.Provider>
  );
}

export function useSystemConfig() {
  return useContext(SystemConfigContext);
}
