"use client";
import { useState, useRef } from "react";
import { FaFileUpload } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function SettingsContainer() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const MAX_LOGO_MB = 1;
  const MAX_LOGO_WIDTH = 1024;
  const MAX_LOGO_HEIGHT = 300;
  const FAVICON_SIZE = 32;

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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
          alert(
            `El logo debe tener máx ${MAX_LOGO_WIDTH}px x ${MAX_LOGO_HEIGHT}px`
          );
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
        if (img.width !== FAVICON_SIZE || img.height !== FAVICON_SIZE) {
          alert(
            `El favicon debe ser exactamente ${FAVICON_SIZE}x${FAVICON_SIZE}px`
          );
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
    if (!companyName || !logoPreview || !faviconPreview || !email || !phone) {
      alert("Completá todos los campos");
      return;
    }

    if (!isValidEmail(email)) {
      alert("El email no es válido");
      return;
    }

    const payload = {
      company_name: companyName,
      email,
      phone,
      logo_base64: logoPreview.split(",")[1],
      favicon_base64: faviconPreview.split(",")[1],
    };

    console.log("Payload listo para guardar:", payload);
    // axios.post('/api/settings', payload)...
  };

  return (
    <div className="p-6 bg-white rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold">Configuración del sistema</h2>

      <label className="block text-gray-600">
        Nombre de la empresa
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
        />
      </label>

      <label className="block text-gray-600">
        Email de contacto
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
        />
      </label>

      <label className="block text-gray-600">
        Teléfono de contacto
        <PhoneInput
          country={"ar"}
          value={phone}
          onChange={setPhone}
          inputClass="!w-full !border !border-gray-300 !rounded"
          containerClass="mt-1"
        />
      </label>

      {/* LOGO */}
      <div className="grid grid-cols-2">
        <label className="block text-gray-600">
          Logo (máx {MAX_LOGO_MB}MB, hasta {MAX_LOGO_WIDTH}x{MAX_LOGO_HEIGHT}px)
          <div className="mt-2">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              <FaFileUpload />
              Subir logo
            </button>
            <input
              type="file"
              accept="image/png"
              ref={logoInputRef}
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Preview Logo"
              className="mt-2 max-h-32 object-contain border border-gray-300 p-1"
            />
          )}
        </label>

        {/* FAVICON */}
        <label className="block text-gray-600">
          Favicon ({FAVICON_SIZE}x{FAVICON_SIZE}px)
          <div className="mt-2">
            <button
              type="button"
              onClick={() => faviconInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              <FaFileUpload />
              Subir favicon
            </button>
            <input
              type="file"
              accept="image/png,image/x-icon"
              ref={faviconInputRef}
              onChange={handleFaviconChange}
              className="hidden"
            />
          </div>
          {faviconPreview && (
            <img
              src={faviconPreview}
              alt="Preview Favicon"
              className="mt-2 w-16 h-16 border border-gray-300 p-1"
            />
          )}
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        Guardar configuración
      </button>
    </div>
  );
}
