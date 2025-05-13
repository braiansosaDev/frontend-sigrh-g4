"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import SelectStatusChip from "./SelectStatusChip";
import { useCountries } from "@/hooks/useCountries";
import { useStatesCountry } from "@/hooks/useStatesCountry";
import * as XLSX from "xlsx";

export default function PostulationsTable({
  jobOpportunityId,
  filter,
  searchInput,
}) {
  const [postulations, setPostulations] = useState([]);
  const [filteredPostulations, setFilteredPostulations] = useState([]);
  const token = Cookies.get("token");

  // Obtener países y estados desde los hooks
  const { countries } = useCountries();
  const { states } = useStatesCountry();

  // Función para obtener el nombre del país a partir del ID
  const getCountryName = (countryId) => {
    const country = countries.find((c) => c.id === countryId);
    return country ? country.name : "País desconocido";
  };

  // Función para obtener el nombre del estado a partir del ID
  const getStateName = (stateId) => {
    const state = states.find((s) => s.id === stateId);
    return state ? state.name : "Estado desconocido";
  };

  const exportToExcel = () => {
    // Crear una hoja de cálculo a partir de los datos de las postulaciones
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPostulations.map((postulation) => ({
        ID: postulation.id,
        Nombre: postulation.name,
        Apellido: postulation.surname,
        Email: postulation.email,
        Teléfono: postulation.phone_number,
        Ubicación: `${getStateName(
          postulation.address_state_id
        )}, ${getCountryName(postulation.address_country_id)}`,
        Evaluación: postulation.suitable ? "Apta" : "No apta",
        Estado: postulation.status,
        "Habilidades Requeridas":
          postulation.ability_match?.required_words?.join(", ") || "Ninguna",
        "Habilidades Deseables":
          postulation.ability_match?.desired_words?.join(", ") || "Ninguna",
      }))
    );

    // Crear un libro de trabajo y agregar la hoja de cálculo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Postulaciones");

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, "postulaciones.xlsx");
  };

  const fetchPostulations = async () => {
    try {
      const res = await axios.get(
        `${config.API_URL}/postulations?job_opportunity_id=${jobOpportunityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status !== 200)
        throw new Error("Error al traer las postulaciones");
      setPostulations(res.data);
    } catch (e) {
      alert("Ocurrió un error al traer las postulaciones");
    }
  };

  useEffect(() => {
    fetchPostulations();
  }, [jobOpportunityId]);

  const applyFilters = () => {
    let filtered = postulations;

    if (filter === "aptas") {
      filtered = filtered.filter((p) => p.suitable);
    } else if (filter === "no_aptas") {
      filtered = filtered.filter((p) => !p.suitable);
    }

    if (searchInput) {
      filtered = filtered.filter((p) =>
        `${p.name} ${p.surname}`
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
    }

    setFilteredPostulations(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filter, searchInput, postulations]);

  const handleDownloadCV = (cvBase64, fileName) => {
    try {
      const binaryString = atob(cvBase64);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray]);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "cv.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el CV:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Botón para exportar a Excel */}
      {postulations.length > 0 && (
        <div className="mb-4">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
          >
            Exportar a Excel
          </button>
        </div>
      )}

      {/* Contenedor de la tabla con scroll */}
      <div className="overflow-x-auto max-h-[70vh] max-w-[90%] overflow-y-auto rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 top-0 z-10">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                ID
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Nombre
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Apellido
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Teléfono
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Ubicación
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Evaluación
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Habilidades Requeridas
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Habilidades Deseables
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Estado
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                CVs
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPostulations.length > 0 ? (
              filteredPostulations.map((postulation) => (
                <tr
                  key={postulation.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {postulation.id}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {postulation.name}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {postulation.surname}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {postulation.email}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {postulation.phone_number}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {getStateName(postulation.address_state_id)},{" "}
                    {getCountryName(postulation.address_country_id)}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    <span
                      className={`font-semibold ${
                        postulation.status === "pendiente"
                          ? "text-yellow-500"
                          : postulation.suitable
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {postulation.status === "pendiente"
                        ? "Pendiente"
                        : postulation.suitable
                        ? "Apta"
                        : "No apta"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {/* Habilidades requeridas */}
                    {postulation.ability_match?.required_words?.length > 0 ? (
                      <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-w-[200px]">
                        {postulation.ability_match.required_words.map(
                          (word, index) => (
                            <span
                              key={index}
                              className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full text-sm whitespace-nowrap"
                            >
                              {word}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Ninguna</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {/* Habilidades deseables */}
                    {postulation.ability_match?.desired_words?.length > 0 ? (
                      <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-w-[200px]">
                        {postulation.ability_match.desired_words.map(
                          (word, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-3 py-1 font-semibold rounded-full text-sm whitespace-nowrap"
                            >
                              {word}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Ninguna</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700 text-left">
                    <SelectStatusChip
                      value={postulation.status}
                      postulationId={postulation.id}
                      onChange={() => {
                        fetchPostulations();
                      }}
                    />
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    <button
                      onClick={() =>
                        handleDownloadCV(
                          postulation.cv_file,
                          `cv_${postulation.id}.pdf`
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm hover:bg-emerald-600"
                    >
                      Descargar CV
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No se encontraron postulaciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
