"use client";

import Image from "next/image";
import OfferCard from "./offerCard";
import JobOpportunitiesFilter from "../jobOpportunity/jobOpportunitiesFilter";
import { useState, useEffect, use } from "react";
import PostulationModal from "./postulation";

export default function OffersTable() {
  const jobOpportunities = [
    {
      title: "Ingeniero en sistemas",
      description: "Buscamos un ingeniero ....",
      postDate: "2025-04-01",
      country: "Argentina",
      region: "Buenos Aires",
      state: "Activa",
      work_mode: "Remoto",
      tags: ["Java", "React", "Node.js"],
      postulations_count: 1000,
    },
    {
      title: "Analista de datos",
      description: "Buscamos un analista ....",
      postDate: "2025-04-02",
      country: "España",
      region: "Madrid",
      state: "Inactiva",
      work_mode: "Híbrido",
      tags: ["Python", "SQL", "Excel"],
      postulations_count: 500,
    },
    {
      title: "Diseñador UX/UI",
      description: "Buscamos un diseñador ....",
      postDate: "2025-04-03",
      country: "Brasil",
      region: "Sao Paulo",
      state: "Activa",
      work_mode: "Presencial",
      tags: ["Figma", "Sketch", "Adobe XD"],
      postulations_count: 200,
    },
    {
      title: "Gerente de proyectos",
      description: "Buscamos un gerente ....",
      postDate: "2025-04-04",
      country: "España",
      region: "Barcelona",
      state: "Activa",
      work_mode: "Remoto",
      tags: ["Scrum", "Agile", "Gestión de equipos"],
      postulations_count: 300,
    },
    {
      title: "Especialista en ciberseguridad",
      description: "Buscamos un especialista ....",
      postDate: "2025-04-05",
      country: "Argentina",
      region: "Córdoba",
      state: "Inactiva",
      work_mode: "Híbrido",
      tags: ["Seguridad", "Redes", "Firewall"],
      postulations_count: 150,
    },
  ];

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(3); // Número de tarjetas por página dinámico
  const [selectedJobOpportunityTitle, setSelectedJobOpportunityTitle] =
    useState(""); // Título de la oferta seleccionada
  const [isFiltering, setIsFiltering] = useState(false); // Estado para mostrar el modal de filtros
  const [isPostulating, setIsPostulating] = useState(false); // Estado para mostrar el modal de postulación

  // Estados para los filtros
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  // Actualizar el número de elementos por página según el tamaño de la pantalla
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(6); // Pantallas grandes (3 columnas, 2 filas)
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(4); // Pantallas medianas (2 columnas, 2 filas)
      } else {
        setItemsPerPage(2); // Pantallas pequeñas (1 columna, 2 filas)
      }
    };

    updateItemsPerPage(); // Ajustar al cargar la página
    window.addEventListener("resize", updateItemsPerPage); // Escuchar cambios de tamaño

    return () => {
      window.removeEventListener("resize", updateItemsPerPage); // Limpiar el evento
    };
  }, []);

  // Filtrar las ofertas según el término de búsqueda y los filtros
  const filteredOffers = jobOpportunities.filter(
    (job) =>
      job.state !== "Inactiva" &&
      job.postulations_count < 1000 &&
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (workModeFilter === "" || job.work_mode === workModeFilter) &&
      (countryFilter === "" || job.country === countryFilter) &&
      (stateFilter === "" || job.state === stateFilter)
  );

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage); // Total de páginas

  // Ofertas visibles en la página actual
  const currentOffers = filteredOffers.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reinicia a la primera página al buscar
  };

  const handleFilter = (filters) => {
    setWorkModeFilter(filters.modality || "");
    setCountryFilter(filters.country || "");
    setStateFilter(filters.state || "");
    setIsFiltering(false); // Cierra el modal de filtros
  };

  const handleApply = (jobTitle) => {
    setSelectedJobOpportunityTitle(jobTitle);
    setIsPostulating(true); // Abre el modal de postulación
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Fondo de la página */}
      <Image
        src="/fondo-postulaciones.png"
        alt="Fondo postulaciones"
        fill
        className="object-cover object-center z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Contenedor principal */}
      <div className="relative z-20 p-8">
        {/* Barra de búsqueda y botón de filtros */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-6 py-3 border border-gray-300 rounded-full w-80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="🔍︎ Buscar por título..."
          />
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full text-emerald-500 border-2 border-emerald-500 font-semibold hover:bg-emerald-100"
            onClick={() => setIsFiltering(true)}
          >
            Filtros
          </button>
        </div>

        {/* Contenedor de las tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentOffers.map((job, index) => (
            <OfferCard key={index} jobOpportunity={job} onApply={handleApply} />
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="flex justify-center items-center mt-8 text-gray-500 text-lg">
            No se encontraron ofertas que coincidan con tu búsqueda.
          </div>
        )}

        {/* Controles de paginación */}
        <div className="flex justify-center items-center mt-8 gap-4">
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
            Página {totalPages !== 0 ? currentPage + 1 : currentPage} de{" "}
            {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages - 1 || totalPages === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de filtros */}
      {isFiltering && (
        <JobOpportunitiesFilter
          onFilter={handleFilter}
          showStateFilter={false}
        />
      )}

      {isPostulating && (
        <PostulationModal
          onClose={() => setIsPostulating(false)}
          jobTitle={selectedJobOpportunityTitle}
        ></PostulationModal>
      )}
    </div>
  );
}
