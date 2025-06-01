"use client";
import { useState, useRef } from "react";

export default function SettingsContainer() {
  const [companyName, setCompanyName] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const MAX_LOGO_MB = 1;
  const MAX_LOGO_WIDTH = 600;
  const MAX_LOGO_HEIGHT = 150;

  const FAVICON_SIZE = 64; // recomendado: 32x32, 64x64

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      alert(`El logo no puede superar ${MAX_LOGO_MB}MB`);
      logoInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        if (img.width > MAX_LOGO_WIDTH || img.height > MAX_LOGO_HEIGHT) {
          alert(`El logo debe tener máx ${MAX_LOGO_WIDTH}px x ${MAX_LOGO_HEIGHT}px`);
          logoInputRef.current.value = "";
        } else {
          setLogoPreview(reader.result);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        if (
          img.width !== FAVICON_SIZE ||
          img.height !== FAVICON_SIZE
        ) {
          alert(`El favicon debe ser exactamente ${FAVICON_SIZE}x${FAVICON_SIZE}px`);
          faviconInputRef.current.value = "";
        } else {
          setFaviconPreview(reader.result);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!companyName || !logoPreview || !faviconPreview) {
      alert("Completá todos los campos");
      return;
    }

    const payload = {
      company_name: companyName,
      logo_base64: logoPreview.split(",")[1],
      favicon_base64: faviconPreview.split(",")[1],
    };

    console.log("Payload listo para guardar:", payload);
    // Podés usar axios o fetch para enviarlo a tu backend
  };

  return (
    <div className=" p-6 bg-white rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold">Configuración del sistema</h2>

      <label className="block">
        Nombre de la empresa
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </label>

      <label className="block">
        Logo (máx {MAX_LOGO_MB}MB, hasta {MAX_LOGO_WIDTH}x{MAX_LOGO_HEIGHT}px)
        <input
          type="file"
          accept="image/png"
          ref={logoInputRef}
          onChange={handleLogoChange}
          className="mt-1"
        />
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Preview Logo"
            className="mt-2 max-h-32 object-contain border p-1"
          />
        )}
      </label>

      <label className="block">
        Favicon ({FAVICON_SIZE}x{FAVICON_SIZE}px)
        <input
          type="file"
          accept="image/png,image/x-icon"
          ref={faviconInputRef}
          onChange={handleFaviconChange}
          className="mt-1"
        />
        {faviconPreview && (
          <img
            src={faviconPreview}
            alt="Preview Favicon"
            className="mt-2 w-16 h-16 border p-1"
          />
        )}
      </label>

      <button
        onClick={handleSubmit}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        Guardar configuración
      </button>
    </div>
  );
}
