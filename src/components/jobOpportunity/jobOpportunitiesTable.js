"use client";

import { FaFilter } from "react-icons/fa";
import React, { useState } from "react";
import JobOpportunityCard from "./jobOpportunityCard";
import JobOpportunityOptions from "./jobOpportunityOptions";

export default function JobOpportunityTable() {
  const [searchTerm, setSearchTerm] = useState(""); // Para guardar lo que se escribe en el buscador
  const [currentPage, setCurrentPage] = useState(0); // Indica la página actual
  const [isAdding, setIsAdding] = useState(false); // Para abrir y cerrar la pantalla de agregar una nueva convocatoria
  const [isEditing, setIsEditing] = useState(false); // Para abrir y cerrar la pantalla de editar una convocatoria

  // Vancantes hardcodeadas para mostrar en la tabla, después hay que cambiarlas por las que vienen de la API
  // Los datos elegidos por tarjeta no son definitivos, solo son para mostrar como cada card
  const jobOpportunities = [
    {
      title: "Ingeniero en sistemas",
      department: "Área de Sistemas",
      postDate: "2025-04-01",
      lastPostDate: "2025-04-10",
      state: "Activa",
    },
    {
      title: "Analista de datos",
      department: "Área de Análisis",
      postDate: "2025-04-02",
      lastPostDate: "2025-04-11",
      state: "Inactiva",
    },
    {
      title: "Diseñador UX/UI",
      department: "Área de Diseño",
      postDate: "2025-04-03",
      lastPostDate: "2025-04-20",
      state: "Activa",
    },
    {
      title: "Gerente de proyectos",
      department: "Área de Gestión",
      postDate: "2025-04-04",
      lastPostDate: "2025-04-18",
      state: "Inactiva",
    },
    {
      title: "Especialista en ciberseguridad",
      department: "Área de Seguridad",
      postDate: "2025-04-05",
      lastPostDate: "2025-05-01",
      state: "Activa",
    },
  ];
  const [filteredjobOportunity, setFilteredjobOportunity] =
    useState(jobOpportunities); // Para guardar las convocatorias que quedaron después de filtrar

  function onModifyjobOpportunity(jobOpportunity) {
    setIsEditing(true); // Abre la pantalla de editar convocatoria
  }

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredjobOportunity.length / itemsPerPage); // Variable para guardar el total de páginas

  // Variable para guardar las convocatorias que se ven en la pantalla
  const currentjobOportunity = filteredjobOportunity.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = jobOpportunities.filter((jobOpportunity) =>
      jobOpportunity.title.toLowerCase().includes(searchTerm)
    );

    setCurrentPage(0); // Para evitar problemas con paginas, volvemos a la primera.

    setFilteredjobOportunity(filtered);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-semibold">Convocatorias</h1>
          <button
            className="px-4 py-2 bg-emerald-500 rounded-full font-semibold text-white mt-2 hover:bg-emerald-600"
            onClick={() => {
              setIsAdding(true);
            }}
          >
            + Agregar
          </button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-6 py-3 border border-gray-300 rounded-full w-80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="🔍︎ Buscar por nombre..."
        />

        <button className="flex items-center gap-2 px-4 py-2 rounded-full text-emerald-500 border-2 border-emerald-500 font-semibold">
          <FaFilter />
          Filtros
        </button>
      </div>

      {/* Para mostrar todas las convocatorias en pantalla */}
      <div className="grid grid-cols-1 gap-4">
        {currentjobOportunity.map((jobOpportunity, index) => (
          <JobOpportunityCard
            key={index}
            title={jobOpportunity.title}
            department={jobOpportunity.department}
            postDate={jobOpportunity.postDate}
            lastUpdateDate={jobOpportunity.lastPostDate}
            state={jobOpportunity.state}
            onModify={onModifyjobOpportunity}
          />
        ))}
      </div>

      {/* Botones para elegir la pagina actual */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded-md ${
            currentPage === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage + 1} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages - 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
        >
          Siguiente
        </button>

        {isAdding && (
          <JobOpportunityOptions
            isAdding={isAdding}
            onClose={() => setIsAdding(false)}
            onSave={() => {
              setIsAdding(false);
            }}
          />
        )}

        {isEditing && (
          <JobOpportunityOptions
            isAdding={isAdding}
            onClose={() => setIsEditing(false)}
            onSave={() => {
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
