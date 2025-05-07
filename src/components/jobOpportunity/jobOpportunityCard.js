import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";

export default function JobOpportunityCard({ jobOpportunity, onModify }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const token = Cookies.get("token");

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

      if (res.status != 200) throw new Error("Error al traer los estados");

      setStates(res.data);
    } catch (e) {
      alert("Ocurrió un error al traer los estados");
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2 relative border border-gray-300">
      {/* Botón Modificar en la esquina superior derecha */}
      <button
        onClick={() => onModify(jobOpportunity)} // Pasar la convocatoria directamente
        className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white rounded-md text-s hover:bg-emerald-600"
      >
        Modificar
      </button>

      <h2 className="text-lg font-bold text-gray-800">
        {jobOpportunity.title}
      </h2>
      <p className="text-sm text-gray-600">
        Descripción:{" "}
        <span className="font-semibold">
          {jobOpportunity.description.length > 100
            ? jobOpportunity.description.substring(0, 200) + "..."
            : jobOpportunity.description}
        </span>
      </p>
      <p className="text-sm text-gray-600">
        Zona:{" "}
        <span className="font-semibold">
          {states[jobOpportunity.state_id]
            ? `${
                countries.find(
                  (country) =>
                    country.id === states[jobOpportunity.state_id].country_id
                )?.name || "País desconocido"
              }/${
                states[jobOpportunity.state_id]?.name || "Estado desconocido"
              }`
            : "Zona desconocida"}
        </span>
      </p>
      <p className="text-sm text-gray-600">
        Modalidad:{" "}
        <span className="font-semibold">{jobOpportunity.work_mode}</span>
      </p>
      <p className="text-sm text-gray-600">
        Estado:{" "}
        <span
          className={`text-sm font-semibold ${
            jobOpportunity.state === "Inactiva"
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {jobOpportunity.status}
        </span>{" "}
      </p>
      <button
        onClick={() => {}}
        className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
      >
        Ver postulados
      </button>
    </div>
  );
}
