"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import config from "@/config";
import Cookies from "js-cookie";
import PostulationCard from "./postulationCard";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function PostulationsTable({ jobOpportunityId }) {
  const [postulations, setPostulations] = useState([]); // Lista de todas las postulaciones
  const [filteredPostulations, setFilteredPostulations] = useState([]); // Lista filtrada
  const [filter, setFilter] = useState("all"); // Filtro actual: "all", "aptas", "no_aptas"
  const [loading, setLoading] = useState(false); // Estado de carga
  const token = Cookies.get("token");
  const router = useRouter();

  useEffect(() => {
    fetchPostulations();
  }, []);

  // Obtener las postulaciones desde el backend
  const fetchPostulations = async () => {
    setLoading(true); // Mostrar "Cargando" mientras se obtienen los datos
    try {
      const res = await axios.get(
        `${config.API_URL}/postulations?job_opportunity_id=${jobOpportunityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) throw new Error("Error al obtener postulaciones");

      setPostulations(res.data);
      setFilteredPostulations(res.data); // Inicialmente mostrar todas
    } catch (error) {
      console.error("Error al obtener las postulaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateCVs = () => {
    procesarCVFetch();
  };

  // Obtener las postulaciones desde el backend
  const procesarCVFetch = async () => {
    setLoading(true); // Mostrar "Cargando" mientras se obtienen los datos
    try {
      const res = await axios.get(
        `${config.API_URL}/matcher/${jobOpportunityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) throw new Error("Error al obtener postulaciones");

      fetchPostulations();
    } catch (error) {
      console.error("Error al obtener las postulaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Decodificar el CV desde Base64 y descargarlo
  const handleDownloadCV = (cvBase64, fileName) => {
    try {
      const binaryString = atob(cvBase64); // Decodificar Base64 a binario
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray]); // Crear un Blob con los datos binarios
      const url = URL.createObjectURL(blob); // Crear una URL para el Blob

      // Crear un enlace para descargar el archivo
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "cv.pdf"; // Nombre del archivo
      link.click();

      // Limpiar la URL creada
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el CV:", error);
    }
  };

  // Filtrar las postulaciones según el filtro seleccionado
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "aptas") {
      setFilteredPostulations(postulations.filter((p) => p.is_apt));
    } else if (newFilter === "no_aptas") {
      setFilteredPostulations(postulations.filter((p) => !p.is_apt));
    } else {
      setFilteredPostulations(postulations); // Mostrar todas
    }
  };

  return (
    <div>
      <div className="p-4">
        {/* Contenedor de filtros y botón */}
        <div className="flex justify-between items-center mb-4">
          {/* Botón para evaluar CVs */}
          <button
            onClick={handleEvaluateCVs}
            className="flex items-center gap-2 px-4 py-2 cursor-pointer text-white rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-500 transition-all"
          >
            <FaWandMagicSparkles />
            Evaluar CVs con IA
          </button>

          {/* Barra de filtro */}
          <div className="flex justify-center">
            <div className="bg-gray-200 rounded-full p-1 flex">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                  filter === "all"
                    ? "bg-emerald-500 text-white"
                    : "text-gray-700"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => handleFilterChange("aptas")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                  filter === "aptas"
                    ? "bg-emerald-500 text-white"
                    : "text-gray-700"
                }`}
              >
                Aptas
              </button>
              <button
                onClick={() => handleFilterChange("no_aptas")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                  filter === "no_aptas"
                    ? "bg-emerald-500 text-white"
                    : "text-gray-700"
                }`}
              >
                No Aptas
              </button>
            </div>
          </div>
        </div>

        {/* Mostrar "Cargando" o las tarjetas */}
        {loading ? (
          <div className="flex flex-col gap-2 justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-solid"></div>
            <span className="ml-4 text-emerald-500 font-bold">Cargando...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPostulations.map((postulation) => (
              <PostulationCard
                key={postulation.id}
                postulation={postulation}
                handleDownloadCV={handleDownloadCV}
                onRefresh={() => {
                  fetchPostulations();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
