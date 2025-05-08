"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";

export default function OfferCard({ jobOpportunity, onApply }) {
  const [showFullDescription, setShowFullDescription] = useState(false); // Estado para alternar descripción

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const token = Cookies.get("token");

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

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
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-xl hover:scale-102 transition-transform transition-shadow">
      <h3 className="text-lg font-semibold text-emerald-600 mb-2 cursor-default">
        {jobOpportunity.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 cursor-default">
        {showFullDescription
          ? jobOpportunity.description
          : jobOpportunity.description.length > 250
          ? jobOpportunity.description.substring(0, 250) + "..."
          : jobOpportunity.description}
        {jobOpportunity.description.length > 250 && (
          <button
            onClick={toggleDescription}
            className="text-emerald-500 font-semibold ml-2 hover:underline"
          >
            {showFullDescription ? "Ver menos" : "Ver más"}
          </button>
        )}
      </p>
      <p className="text-sm text-gray-600 mb-2 mt-2 cursor-default">
        🌍{" "}
        <span className="font-semibold">
          {(() => {
            const state = states.find(
              (state) => state.id === jobOpportunity.state_id
            );
            if (state) {
              const country = countries.find(
                (country) => country.id === state.country_id
              );
              return `${state?.name || "País desconocido"}, ${
                country?.name || "Estado desconocido"
              }`;
            }
            return "Zona desconocida";
          })()}
        </span>
      </p>
      <p className="text-sm text-gray-600 mb-2 mt-2 cursor-default">
        💻 {jobOpportunity.work_mode}
      </p>
      <button
        onClick={() => onApply(jobOpportunity.title)}
        className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors mt-2 cursor-pointer"
      >
        Postularme
      </button>
    </div>
  );
}
