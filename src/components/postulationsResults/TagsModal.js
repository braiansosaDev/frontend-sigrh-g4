"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import config from "@/config";
import axios from "axios";

export default function TagsModal({
  open,
  onClose,
  abilities,
  title,
  jobOpportunityId,
}) {
  const token = Cookies.get("token");
  const [wantedAbilities, setWantedAbilities] = useState([]);

  const handleClose = () => {
    setWantedAbilities([]);
    onClose();
  };

  const fetchJobOpportunityAbilities = async () => {
    if (!jobOpportunityId || !token) return;

    try {
      const res = await axios.get(
        `${config.API_URL}/opportunities/${jobOpportunityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status !== 200)
        throw new Error("Error al traer las postulaciones");

      if (title == "Habilidades requeridas") {
        setWantedAbilities(
          res.data.required_abilities.map((abil) => abil.name)
        );
      } else if (title == "Habilidades deseables") {
        setWantedAbilities(
          res.data.desirable_abilities.map((abil) => abil.name)
        );
      }
    } catch (error) {
      throw new Error(`Error al obtener habilidades: ${error.message}`);
    }
  };

  useEffect(() => {
    if (open && jobOpportunityId) {
      fetchJobOpportunityAbilities();
    }
  }, [open, jobOpportunityId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md z-10">
        <h2 className="text-lg font-bold ">{title || "Habilidades"}</h2>
        <div className="mb-4">
          <span className="text-m text-emerald-700 font-semibold">
            Encontradas
          </span>{" "}
          -{" "}
          <span className="text-m text-red-700 font-semibold">
            No encontradas
          </span>
        </div>

        <ul className="mb-4">
          {wantedAbilities && wantedAbilities.length > 0 ? (
            wantedAbilities.map((ability, idx) => {
              const match =
                abilities && abilities.includes(ability.toLowerCase());
              return (
                <li
                  key={idx}
                  className={`mb-2 px-3 py-1 rounded-full font-semibold inline-block mr-2 ${
                    match
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-400"
                      : "bg-red-100 text-red-700 border border-red-400"
                  }`}
                >
                  {ability}
                </li>
              );
            })
          ) : (
            <li className="text-gray-500">Ninguna habilidad encontrada</li>
          )}
        </ul>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={handleClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
