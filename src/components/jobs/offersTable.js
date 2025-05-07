"use client";

import Image from "next/image";
import OfferCard from "./offerCard";
import JobOpportunitiesFilter from "../jobOpportunity/jobOpportunitiesFilter";
import { useState, useEffect, use } from "react";
import PostulationModal from "./postulation";
import Link from "next/link";

export default function OffersTable() {
  const jobOpportunities = [
    {
      title: "Ingeniero en sistemas",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-05",
      country: "Argentina",
      region: "Córdoba",
      state: "Inactiva",
      work_mode: "Híbrido",
      tags: ["Seguridad", "Redes", "Firewall"],
      postulations_count: 150,
    },
    {
      title: "Desarrollador Frontend",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-06",
      country: "Argentina",
      region: "Buenos Aires",
      state: "Activa",
      work_mode: "Remoto",
      tags: ["JavaScript", "React", "CSS"],
      postulations_count: 400,
    },
    {
      title: "Desarrollador Backend",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-07",
      country: "Brasil",
      region: "Rio de Janeiro",
      state: "Activa",
      work_mode: "Híbrido",
      tags: ["Node.js", "Express", "MongoDB"],
      postulations_count: 600,
    },
    {
      title: "Ingeniero de datos",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-08",
      country: "España",
      region: "Madrid",
      state: "Activa",
      work_mode: "Remoto",
      tags: ["Python", "Spark", "Hadoop"],
      postulations_count: 700,
    },
    {
      title: "Arquitecto de software",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-09",
      country: "España",
      region: "Valencia",
      state: "Activa",
      work_mode: "Híbrido",
      tags: ["Java", "Microservicios", "Arquitectura"],
      postulations_count: 800,
    },
    {
      title: "Tester de software",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-10",
      country: "Argentina",
      region: "Formosa",
      state: "Activa",
      work_mode: "Remoto",
      tags: ["Pruebas", "Automatización", "Selenium"],
      postulations_count: 900,
    },
    {
      title: "Ingeniero en sistemas",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-11",
      country: "España",
      region: "Barcelona",
      state: "Activa",
      work_mode: "Remoto",
      tags: ["Linux", "Windows", "Redes"],
      postulations_count: 400,
    },
    {
      title: "Diseñador UX/UI",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-12",
      country: "Brasil",
      region: "Bahía",
      state: "Activa",
      work_mode: "Híbrido",
      tags: ["Figma", "Sketch", "Adobe XD"],
      postulations_count: 200,
    },
    {
      title: "Diseñador UX/UI",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula ex eu ante scelerisque, eu gravida neque sollicitudin. Duis sagittis sem eu lacus fringilla, non pellentesque nisl ultrices. Aenean lacinia, magna eget porttitor efficitur, nisi ligula aliquet nunc, at aliquet purus erat in erat. Fusce fermentum, mauris at finibus porttitor, metus ipsum malesuada libero, ut consequat mi massa ut justo. Nulla facilisi. Morbi venenatis tortor sed tellus mollis, at varius est blandit. Etiam tempus, dui non varius scelerisque, libero ligula accumsan odio, ac auctor eros elit id est. Quisque eget est id metus maximus convallis. Nam pharetra nisl eget sem consectetur, nec elementum magna congue. Suspendisse potenti. Integer nec sem eget lorem lacinia suscipit. Curabitur ut aliquet nulla. Duis et bibendum lacus. Maecenas sed purus risus. Donec euismod libero nec mi sollicitudin, vel vulputate libem aliquet ut yer bademtur sed lorem dolor neque giuja gretta purus erat binola ferramen.",
      postDate: "2025-04-13",
      country: "Argentina",
      region: "Mendoza",
      state: "Activa",
      work_mode: "Remoto",
      tags: ["Java", "React", "Node.js"],
      postulations_count: 700,
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
        setItemsPerPage(6);
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(2);
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
        <h1 className="lg:hidden text-2xl text-center font-bold text-emerald-600 mb-4 bg-emerald-50 px-4 py-2 rounded-full shadow-md">
          <Link href="/..">SIGRH</Link>
        </h1>
        {/* Barra de búsqueda y título */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
          {/* Título "SIGRH" para pantallas grandes */}
          <h1 className="hidden lg:block text-2xl font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-md mb-4 lg:mb-0 hover:scale-102 transition-transform">
            <Link href="/..">SIGRH</Link>
          </h1>

          {/* Buscador y botón de filtros para pantallas pequeñas */}
          <div className="flex justify-between items-center w-full lg:hidden">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-6 py-3 border bg-emerald-500 placeholder-emerald-50 border-emerald-600 rounded-full w-3/4 text-sm text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="🔍︎ Buscar por título..."
            />
            <button
              className="ml-4 cursor-pointer border border-emerald-700 flex items-center gap-2 px-4 py-2 rounded-full text-emerald-50 border-2 border-emerald-500 font-semibold bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setIsFiltering(true)}
            >
              Filtros
            </button>
          </div>

          {/* Buscador centrado para pantallas grandes */}
          <div className="hidden lg:flex justify-center w-full lg:w-auto bg-e">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-6 py-3 border bg-emerald-500 text-emerald-50 placeholder-emerald-50 border-emerald-700 rounded-full w-full lg:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:scale-102 hover:scale-102 transition-transform"
              placeholder="🔍︎ Buscar por título..."
            />
          </div>

          {/* Botón de filtros para pantallas grandes */}
          <button
            className="hidden cursor-pointer lg:flex items-center border border-emerald-700 gap-2 px-4 py-2 rounded-full text-emerald-50 border-2 font-semibold bg-emerald-500 hover:bg-emerald-600 hover:scale-102 transition-transform"
            onClick={() => setIsFiltering(true)}
          >
            Filtros
          </button>
        </div>

        {/* Contenedor de las tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 2xl:mt-30">
          {currentOffers.map((job, index) => (
            <OfferCard key={index} jobOpportunity={job} onApply={handleApply} />
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="flex justify-center items-center mt-8 text-gray-500 text-2xl">
            No se encontraron ofertas que coincidan con tu búsqueda.
          </div>
        )}

        {/* Controles de paginación */}
        <div className="flex justify-center items-center mt-8 gap-4 2xl:mt-30">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-md hover:scale-105 transition-transform ${
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
            className={`px-4 py-2 rounded-md hover:scale-105 transition-transform ${
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
