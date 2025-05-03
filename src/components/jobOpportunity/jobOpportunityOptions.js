import React, { useState, useEffect } from "react";

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

  const addTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();

      // Limitar el número de etiquetas a 15
      if (formData.tags.length >= 15) {
        alert("No puedes agregar más de 15 etiquetas.");
        return;
      }

      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }

      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-lg w-96 p-6 border border-gray-300 z-10">
        <h2 className="text-xl font-bold mb-4">
          {isAdding
            ? "Generar nueva convocatoria 💼"
            : "Editar convocatoria 🧾"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título de la convocatoria
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
                <label className="block text-sm font-medium text-gray-700">
                  Modalidad
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
                <label className="block text-sm font-medium text-gray-700">
                  País
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
                <label className="block text-sm font-medium text-gray-700">
                  Región
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
                <label className="block text-sm font-medium text-gray-700">
                  Estado
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
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={checkRegion}
                  className="mt-1 block w-full h-40 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm resize-none "
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Habilidades requeridas (Etiquetas)
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Presione Enter para agregar una etiqueta"
              onKeyDown={addTag}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

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
