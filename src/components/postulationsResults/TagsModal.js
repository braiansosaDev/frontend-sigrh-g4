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
        <h2 className="text-lg font-bold mb-4">{title || "Habilidades"}</h2>
        <div className="max-h-72 overflow-y-auto mb-4">
          <table className="w-full border-none bg-blue-200">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left font-semibold border-b">
                  Habilidad
                </th>
                <th className="py-2 px-4 text-center font-semibold border-b">
                  ¿Encontrada?
                </th>
              </tr>
            </thead>
            <tbody>
              {wantedAbilities && wantedAbilities.length > 0 ? (
                wantedAbilities.map((ability, idx) => {
                  const match =
                    abilities && abilities.includes(ability.toLowerCase());
                  return (
                    <tr key={idx}>
                      <td
                        className={`${
                          match ? "bg-emerald-300" : "bg-red-300"
                        } py-2 px-4 border-b font-semibold cursor-default`}
                      >
                        {ability}
                      </td>
                      <td
                        className={`${
                          match ? "bg-emerald-300" : "bg-red-300"
                        } py-2 px-4 border-b text-center cursor-default`}
                      >
                        {match ? "✅" : "❌"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="py-2 px-4 text-center text-gray-500"
                  >
                    Ninguna habilidad encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
