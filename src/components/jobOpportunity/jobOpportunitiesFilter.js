import React, { useState, useEffect } from "react";

export default function JobOpportunitiesFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    modality: "",
    country: "",
    state: "",
  });

  useEffect(() => {
    const savedFilters = localStorage.getItem("jobFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters)); // Restaura los filtros guardados
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("jobFilters", JSON.stringify(filters)); // Guarda los filtros en localStorage
    onFilter(filters); // Envía los filtros al componente padre
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-lg w-96 p-6 border border-gray-300 z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              🌐 Modalidad
            </label>
            <select
              name="modality"
              value={filters.modality}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="">Todas</option>
              <option value="Remoto">Remoto</option>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              🗺️ País
            </label>
            <select
              name="country"
              value={filters.country}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="">Todos</option>
              <option value="Argentina">Argentina</option>
              <option value="Brasil">Brasil</option>
              <option value="España">España</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              🛑 Estado
            </label>
            <select
              name="state"
              value={filters.state}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="">Todas</option>
              <option value="Activa">Activas</option>
              <option value="Inactiva">Inactivas</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
