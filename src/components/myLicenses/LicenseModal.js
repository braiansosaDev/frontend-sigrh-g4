import React, { useRef } from "react";

const mockTiposLicencia = [
  { id: 1, nombre: "Vacaciones" },
  { id: 2, nombre: "Enfermedad" },
  { id: 3, nombre: "Estudio" },
];

export default function LicenseModal({ open, onClose }) {
  const fileInputRef = useRef(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo opaco */}
      <div className="fixed inset-0 bg-black/50"></div>
      {/* Modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md z-10">
        <h2 className="text-xl font-bold text-emerald-700 mb-4">
          Solicitar Licencia
        </h2>
        <form>
          {/* Tipo de licencia */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              📄 Tipo de licencia
            </label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 hover:border-emerald-400">
              <option value="">Seleccionar tipo</option>
              {mockTiposLicencia.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Subida de archivo */}
          <div
            className="mb-4 border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:border-emerald-400"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              // Aquí puedes manejar el archivo arrastrado
              // e.dataTransfer.files[0]
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                // Aquí puedes manejar el archivo seleccionado
                // e.target.files[0]
              }}
            />
            <p className="text-gray-500">
              📎 Adjunte la documentación correspodiente aquí
            </p>
          </div>
          {/* Fechas */}
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">📅 Desde</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 hover:border-emerald-400"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">🗓️ Hasta</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 hover:border-emerald-400"
              />
            </div>
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-red-400 hover:bg-red-500 text-white"
              onClick={onClose}
            >
              Cancelar ❌
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Solicitar ✉️
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
