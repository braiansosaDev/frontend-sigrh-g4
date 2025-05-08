import React, { useState, useEffect } from "react";
import JobOpportunitiesTags from "./jobOpportunitiesTags";
import Cookies from "js-cookie";
import config from "@/config";
import axios from "axios";

export default function JobOpportunityOptions({
  isAdding,
  onClose,
  onSave,
  jobOpportunity,
}) {
  const token = Cookies.get("token");

  const [formData, setFormData] = useState({
    status: "",
    work_mode: "",
    title: "",
    description: "",
    country_id: "",
    state_id: "",
    job_opportunity_abilities: [],
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [statesAreLoaded, setStatesAreLoaded] = useState(false);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/countries/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status != 200) throw new Error("Error al traer los países");

      setCountries(res.data);
    } catch (e) {
      alert("Ocurrió un error al traer los países");
    }
  };

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/states/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) throw new Error("Error al traer los estados");

      const groupedStates = mapStatesToCountries(res.data);
      setStates(groupedStates);
      setStatesAreLoaded(true);
    } catch (e) {
      alert("Ocurrió un error al traer los estados");
    }
  };

  const mapStatesToCountries = (states) => {
    const groupedStates = {};

    states.forEach((state) => {
      const countryId = state.country_id;
      if (!groupedStates[countryId]) {
        groupedStates[countryId] = [];
      }
      groupedStates[countryId].push(state);
    });

    return groupedStates;
  };

  useEffect(() => {
    if (jobOpportunity) {
      var countryId = "";
      if (statesAreLoaded) {
        const state = Object.values(states)
          .flat()
          .find((state) => state.id === jobOpportunity.state_id);
        countryId = state ? state.country_id : "";
      } else {
        console.log("No hay estados disponibles para asignar el país.");
      }

      setFormData({
        status: jobOpportunity.status || "activo",
        work_mode: jobOpportunity.work_mode || "remoto",
        title: jobOpportunity.title || "",
        description: jobOpportunity.description || "",
        country_id: countryId ? countryId : "",
        state_id: jobOpportunity.state_id || "",
        job_opportunity_abilities:
          jobOpportunity.job_opportunity_abilities || [],
      });
    }
  }, [jobOpportunity, states]);

  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []); // Cambia la dependencia a un array vacío

  const checkRegion = (e) => {
    const { name, value } = e.target;

    if (name === "country_id") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        state_id: "",
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

    if (formData.job_opportunity_abilities.length === 0) {
      return alert("Debes agregar al menos una etiqueta.");
    }
    if (formData.title.length > 75) {
      return alert("El título no puede tener más de 75 caracteres.");
    }
    if (formData.description.length > 1000) {
      return alert("La descripción no puede tener más de 1000 caracteres.");
    }

    if (isAdding) {
      onSave(formData);
    } else {
      onSave(formData, jobOpportunity.id);
    }

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
                  <option value="remoto">Remoto</option>
                  <option value="presencial">Presencial</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  🗺️ País
                </label>
                <select
                  name="country_id"
                  value={formData.country_id}
                  onChange={checkRegion}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Seleccione un país
                  </option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                  🗻 Región
                </label>
                <select
                  name="state_id"
                  value={formData.state_id}
                  onChange={checkRegion}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Seleccione una región
                  </option>
                  {states[formData.country_id]?.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
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
                  name="status"
                  value={formData.status}
                  onChange={checkRegion}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
                  <option value="activo">Activa</option>
                  <option value="no_activo">Inactiva</option>
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
            tags={formData.job_opportunity_abilities}
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
