import React, { useState, useRef, useEffect } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";

export default function LicenseRevision({ open, onClose, license, onSave }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();
  const [licensesTypes, setLicensesTypes] = useState([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchLicensesTypes = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/leaves/types`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status !== 200) throw new Error("Error al obtener licencias");
        setLicensesTypes(res.data);
      } catch (error) {
        console.error("Error al traer licenses:", error);
        alert("No se pudieron obtener las licencias");
      }
    };
    fetchLicensesTypes();
  }, [token]);

  useEffect(() => {
    setFile(null);
  }, [license]);

  if (!open || !license) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileBase64 = license.file || null;

    if (file) {
      fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    onSave({
      ...license,
      file: fileBase64,
    });
  };

  const title = "Revisión de Licencia";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo opaco */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      {/* Modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md z-10">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block font-semibold">📂 Tipo de licencia</label>
            <div className="border rounded px-3 py-2 bg-gray-100">
              {licensesTypes.find((type) => type.id === license.leave_type_id)
                ?.type || "Tipo no encontrado"}
            </div>
          </div>
          <div className="mb-3">
            <label className="block font-semibold">📝 Motivo</label>
            <div className="border rounded px-3 py-2 bg-gray-100">
              {license.reason.slice(0, 50)}
              {license.reason.length > 50 ? "..." : ""}
            </div>
          </div>
          <div className="mb-3 flex gap-2">
            <div className="flex-1">
              <label className="block font-semibold">📅 Desde</label>
              <div className="border rounded px-3 py-2 bg-gray-100">
                {license.start_date}
              </div>
            </div>
            <div className="flex-1">
              <label className="block font-semibold">🗓️ Hasta</label>
              <div className="border rounded px-3 py-2 bg-gray-100">
                {license.end_date}
              </div>
            </div>
          </div>
          {/* Campo para cargar PDF (igual que LicenseModal, sin descarga) */}
          <label className="block mb-2 font-semibold">
            {file ? "📄 Agregar documento" : "📄 Editar documento"}
          </label>
          <div
            className="mb-4 border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:border-emerald-400"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) setFile(file);
            }}
          >
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setFile(file);
              }}
            />
            {file ? (
              <div className="mt-2 text-emerald-700 font-medium">
                {file.name}
              </div>
            ) : (
              <p className="text-gray-500">
                🗃️ Adjunte la documentación correspondiente aquí
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
