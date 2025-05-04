import React, { useState, useEffect } from "react";
import JobOpportunitiesTags from "./jobOpportunitiesTags";

export default function JobOpportunityOptions({
  isAdding,
  onClose,
  onSave,
  jobOpportunity,
}) {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    postDate: "",
    state: "Activa",
    work_mode: "Remoto",
    country: "Argentina",
    region: "",
    description: "",
    tags: [],
  });

  // Regiones para los países (momentaneamente para probar el front)
  const regionsByCountry = {
    Argentina: ["Buenos Aires", "Córdoba", "Mendoza", "Formosa"],
    Brasil: ["Sao Paulo", "Río de Janeiro", "Bahía"],
    España: ["Madrid", "Barcelona", "Valencia"],
  };

  // Actualiza el estado inicial con los valores de jobOpportunity si está disponible
  useEffect(() => {
    if (jobOpportunity) {
      setFormData({
        title: jobOpportunity.title || "",
        country: jobOpportunity.country || "Argentina",
        region: jobOpportunity.region || "",
        work_mode: jobOpportunity.work_mode || "Remoto",
        description: jobOpportunity.description || "",
        state: jobOpportunity.state || "Activa",
        tags: jobOpportunity.tags || [],
      });
    }
  }, [jobOpportunity]);

  const checkRegion = (e) => {
    const { name, value } = e.target;

    // Revisa si el país ha cambiado y limpia la región
    if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        region: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica si el botón "Guardar" fue el que disparó el evento
    if (e.nativeEvent.submitter?.name !== "saveButton") {
      return;
    }

    if (formData.tags.length === 0) {
      return alert("Debes agregar al menos una etiqueta.");
    }
    if (formData.title.length > 75) {
      return alert("El título no puede tener más de 75 caracteres.");
    }
    if (formData.description.length > 1000) {
      return alert("La descripción no puede tener más de 1000 caracteres.");
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-lg w-2/3 h-auto overflow-y-auto p-8 border border-gray-300 z-10">
        <h2 className="text-xl font-bold mb-4">
          {isAdding
            ? "Generar nueva convocatoria 💼"
            : "Editar convocatoria 💼"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  📂 Título convocatoria
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={checkRegion}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                  disabled={!isAdding}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  🌐 Modalidad
                </label>
                <select
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={checkRegion}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
                  <option value="Remoto">Remoto</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  🗺️ País
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={checkRegion}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
                  <option value="Argentina">Argentina</option>
                  <option value="Brasil">Brasil</option>
                  <option value="España">España</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  🗻 Región
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={checkRegion}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Seleccione una región
                  </option>
                  {regionsByCountry[formData.country]?.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  🛑 Estado
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={checkRegion}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  📃 Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={checkRegion}
                  className="mt-1 block w-full h-47 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm resize-none "
                  required
                />
              </div>
            </div>
          </div>
          <JobOpportunitiesTags
            tags={formData.tags}
            setFormData={setFormData}
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              name="saveButton"
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
