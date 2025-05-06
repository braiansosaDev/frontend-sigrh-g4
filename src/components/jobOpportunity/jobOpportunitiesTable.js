"use client";

import { FaFilter } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import JobOpportunityCard from "./jobOpportunityCard";
import JobOpportunityOptions from "./jobOpportunityOptions";
import JobOpportunitiesFilter from "./jobOpportunitiesFilter";
import config from "@/config";
import axios from "axios";
import Cookies from "js-cookie";

export default function JobOpportunityTable() {
  const [searchTerm, setSearchTerm] = useState(""); // Para guardar lo que se escribe en el buscador
  const [currentPage, setCurrentPage] = useState(0); // Indica la página actual
  const [isAdding, setIsAdding] = useState(false); // Para abrir y cerrar la pantalla de agregar una nueva convocatoria
  const [isEditing, setIsEditing] = useState(false); // Para abrir y cerrar la pantalla de editar una convocatoria
  const [isFiltering, setIsFiltering] = useState(false); // Para abrir y cerrar la pantalla de filtros
  const [selectedJobOpportunityTitle, setSelectedJobOpportunityTitle] =
    useState(""); // Para guardar el título de la convocatoria seleccionada
  const token = Cookies.get("token");
  const [workModeFilter, setWorkModeFilter] = useState(""); // Para guardar el filtro de modalidad
  const [countryFilter, setCountryFilter] = useState(""); // Para guardar el filtro de país
  const [stateFilter, setStateFilter] = useState(""); // Para guardar el filtro de estado
  const [searchedWord, setSearchedWord] = useState(""); // Para guardar la palabra que se busca en el buscador

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
  const [filteredjobOportunity, setFilteredjobOportunity] =
    useState(jobOpportunities); // Para guardar las convocatorias que quedaron después de filtrar

  function onModifyjobOpportunity(jobOpportunity) {
    setSelectedJobOpportunityTitle(jobOpportunity.title);
    setIsEditing(true); // Abre la pantalla de editar convocatoria
  }

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredjobOportunity.length / itemsPerPage); // Variable para guardar el total de páginas

  // Variable para guardar las convocatorias que se ven en la pantalla
  const currentjobOportunity = filteredjobOportunity.slice(
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
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const handleFilter = (filters) => {
    setCountryFilter(filters.country || "");
    setWorkModeFilter(filters.modality || "");
    setStateFilter(filters.state || "");

    setIsFiltering(false); // Cierra el modal de filtros
  };

  const showResults = () => {
    const filtered = jobOpportunities.filter(
      (jobOpportunity) =>
        jobOpportunity.title.toLowerCase().includes(searchTerm) &&
        (workModeFilter === "" ||
          jobOpportunity.work_mode === workModeFilter) &&
        (countryFilter === "" || jobOpportunity.country === countryFilter) &&
        (stateFilter === "" || jobOpportunity.state === stateFilter)
    );

    setFilteredjobOportunity(filtered);
    setCurrentPage(0); // Reinicia la paginación al aplicar filtros o búsqueda
  };

  useEffect(() => {
    showResults();
  }, [searchTerm, workModeFilter, countryFilter, stateFilter]);

  const fetchJobOpportunities = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/job_opportunities`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status != 200)
        throw new Error("Error al traer las convocatorias");

      setEmployees(res.data);
    } catch (e) {
      alert("No se pudieron obtener las convocatorias");
    }
  };

  useEffect(() => {
    fetchJobOpportunities();
  }, []);

  const handleSaveJobOpportunityForm = async (jobOpportunityNewData) => {
    try {
      const res = await axios.patch(
        `${config.API_URL}/job_opportunities/${id}`, // Revisar que pasarle en lugar del id
        jobOpportunityNewData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status != 200) throw new Error("Error al guardar cambios");
    } catch (e) {
      console.error(e);
      alert("Ocurrió un error al guardar los datos de la convocatoria");
    }

    setIsEditing(false);
    setIsAdding(false);
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

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-emerald-500 border-2 border-emerald-500 font-semibold"
          onClick={() => setIsFiltering(true)}
        >
          <FaFilter />
          Filtros
        </button>
      </div>

      {/* Para mostrar todas las convocatorias en pantalla */}
      <div className="grid grid-cols-1 gap-4">
        {currentjobOportunity.map((jobOpportunity, index) => (
          <JobOpportunityCard
            key={index}
            jobOpportunity={jobOpportunity}
            onModify={() => onModifyjobOpportunity(jobOpportunity)} // Envolver en una función anónima
          />
        ))}
      </div>

      {filteredjobOportunity.length === 0 && (
        <div className="flex justify-center items-center mt-8 text-gray-500 text-lg">
          No se encontraron convocatorias que coincidan con tu búsqueda.
        </div>
      )}

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
          Página {totalPages != 0 ? currentPage + 1 : currentPage} de{" "}
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

        {isAdding && (
          <JobOpportunityOptions
            isAdding={isAdding}
            onClose={() => setIsAdding(false)}
            onSave={handleSaveJobOpportunityForm}
          />
        )}

        {isEditing && (
          <JobOpportunityOptions
            isAdding={false}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveJobOpportunityForm}
            jobOpportunity={currentjobOportunity.find(
              (job) => job.title === selectedJobOpportunityTitle
            )}
          />
        )}

        {isFiltering && (
          <div className="mb-4">
            <JobOpportunitiesFilter
              onFilter={handleFilter}
              showStateFilter={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
