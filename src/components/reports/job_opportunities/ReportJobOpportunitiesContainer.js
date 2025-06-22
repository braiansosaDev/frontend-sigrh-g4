"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { toastAlerts } from "@/utils/toastAlerts";
import JobOpporrtunitiesBarChart from "./JobOpportunitiesBarChart";
import JobOpportunitiesPieChart from "./JobOpportunitiesPieChart";
import { FaFileExcel } from "react-icons/fa";
import config from "@/config";
import Cookies from "js-cookie";

export default function JobOpportunitiesDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobOpportunitiesData, setJobOpportunitiesData] = useState();
  const [filteredStartDate, setFilteredStartDate] = useState("");
  const [filteredEndDate, setFilteredEndDate] = useState("");
  const [rejectedData, setRejectedData] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOpportunity, setFilteredOpportunity] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef(null);

  const isValidPeriod = !!startDate && !!endDate && startDate <= endDate;
  const token = Cookies.get("token");

  // Generar opciones para el autocompletado
  const opportunityOptions = opportunities.map((o) => `${o.title} #${o.id}`);

  // Filtrar opciones según lo que escribe el usuario
  const filteredOptions = searchTerm
    ? opportunityOptions.filter((opt) =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : opportunityOptions;

  // Habilitar botón si hay periodo válido o convocatoria seleccionada
  const canFilter = isValidPeriod || opportunityOptions.includes(searchTerm);

  const handleFilter = async () => {
    if (!canFilter) return;
    setLoading(true);
    try {
      // Si no hay fechas, usar el primer y último día del mes actual
      let from = startDate;
      let to = endDate;
      if (!startDate || !endDate) {
        const now = new Date();
        const firstDay = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-01`;
        const lastDayDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const lastDay = `${lastDayDate.getFullYear()}-${String(
          lastDayDate.getMonth() + 1
        ).padStart(2, "0")}-${String(lastDayDate.getDate()).padStart(2, "0")}`;
        from = from || firstDay;
        to = to || lastDay;
      }

      const params = {};
      if (from) params.from_date = from;
      if (to) params.to_date = to;

      let selected = null;
      if (opportunityOptions.includes(searchTerm)) {
        const match = searchTerm.match(/^(.*) #(\d+)$/);
        if (match) {
          selected = [parseInt(match[2]), match[1]];
          setFilteredOpportunity(selected);
          params.opportunity_id = match[2];
        }
      } else {
        setFilteredOpportunity(null);
      }

      const res = await axios.post(
        `${config.API_URL}/opportunities/count-active-inactive`,
        params,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resRejected = await axios.get(
        `${config.API_URL}/opportunities/opportunities/rejected-postulations-count-by-dates?from_date=${params.from_date || ""}&to_date=${params.to_date || ""}${params.opportunity_id ? `&opportunity_id=${params.opportunity_id}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobOpportunitiesData(res.data);
      setFilteredStartDate(from);
      setFilteredEndDate(to);
      setRejectedData(resRejected.data);
    } catch (e) {
      toastAlerts.showError(
        "Error al filtrar convocatorias, recargue la página e intente nuevamente"
      );
      console.error("Error al filtrar convocatorias:", e);
    }
    setLoading(false);
  };

  const fetchJobOpportunitiesData = async () => {
    //Este método es para la primera vez que se carga el componente
    setLoading(true);
    try {
      // Si no hay fechas, va a buscar el mes actual
      const now = new Date();
      const firstDay = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-01`;
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const lastDayStr = `${lastDay.getFullYear()}-${String(
        lastDay.getMonth() + 1
      ).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;

      const fromDate = firstDay;
      const untilDate = lastDayStr;

      const params = {
        from_date: fromDate,
        to_date: untilDate,
      };

      console.log("params", params);

      const res = await axios.post(
        `${config.API_URL}/opportunities/count-active-inactive`,
        params,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resRejected = await axios.get(
        `${config.API_URL}/opportunities/opportunities/rejected-postulations-count-by-dates?from_date=${params.from_date}&to_date=${params.to_date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobOpportunitiesData(res.data);
      setFilteredStartDate(fromDate);
      setFilteredEndDate(untilDate);
      setRejectedData(resRejected.data);
    } catch (e) {
      toastAlerts.showError(
        "Error al traer los datos de las convocatorias, recargue la página e intente nuevamente"
      );
      console.error("Error al filtrar convocatorias:", e);
    }
    setLoading(false);
  };

  const fetchOpportunities = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/opportunities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunities(res.data);
    } catch (e) {
      toastAlerts.showError(
        "Error al traer las convocatorias, recargue la página e intente nuevamente"
      );
      console.error("Error al traer las convocatorias:", e);
    }
  };

  useEffect(() => {
    fetchJobOpportunitiesData();
    fetchOpportunities();
  }, [token]);

  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const periodInfo = [
        {
          Period: `From: ${
            filteredStartDate || startDate
          } To: ${filteredEndDate || endDate}`,
        },
      ];

      const statusData = [
        {
          Status: "Active opportunities",
          Count: jobOpportunitiesData.active_count || 0,
        },
        {
          Status: "Inactive opportunities",
          Count: jobOpportunitiesData.inactive_count || 0,
        },
      ];

      const statusSheet = [...periodInfo, {}, ...statusData];

      let motives = {};
      let motivesHeader = [
        {
          Period: `From: ${
            filteredStartDate || startDate
          } To: ${filteredEndDate || endDate}`,
        },
      ];
      if (
        filteredOpportunity &&
        filteredOpportunity[0] &&
        Array.isArray(rejectedData)
      ) {
        motivesHeader.push({
          Opportunity: `${filteredOpportunity[1]} #${filteredOpportunity[0]}`,
        });
        const selected = rejectedData.find(
          (item) =>
            String(item.opportunity_id) === String(filteredOpportunity[0])
        );
        if (selected) motives = selected.motivos;
      } else if (Array.isArray(rejectedData)) {
        rejectedData.forEach((item) => {
          Object.entries(item.motivos).forEach(([motive, count]) => {
            motives[motive] = (motives[motive] || 0) + count;
          });
        });
      }

      const motivesRows = Object.entries(motives).map(([motive, count]) => ({
        Motive: motive,
        Count: count,
      }));

      const params = {
        from_date: filteredStartDate || startDate,
        to_date: filteredEndDate || endDate,
      };
      const resRaw = await axios.get(
        `${config.API_URL}/opportunities/opportunities-postulations`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      let rawMotivesRows = [];
      if (Array.isArray(resRaw.data)) {
        resRaw.data.forEach((op) => {
          if (
            filteredOpportunity &&
            filteredOpportunity[0] &&
            String(op.id) !== String(filteredOpportunity[0])
          ) {
            return;
          }
          if (Array.isArray(op.postulations)) {
            op.postulations.forEach((post) => {
              rawMotivesRows.push({
                Opportunity: `${op.title} #${op.id}`,
                Name: post.name,
                Surname: post.surname,
                Email: post.email,
                "Application status": post.status,
                Motive: post.motive,
                "Evaluated at": post.evaluated_at,
                "Created at": post.created_at,
              });
            });
          }
        });
      }

      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.json_to_sheet(statusSheet, { skipHeader: false });
      XLSX.utils.book_append_sheet(wb, ws1, "Activos e Inactivos");

      if (motivesRows.length > 0) {
        const motivesSheet = [...motivesHeader, {}, ...motivesRows];
        const ws2 = XLSX.utils.json_to_sheet(motivesSheet, {
          skipHeader: false,
        });
        XLSX.utils.book_append_sheet(wb, ws2, "Motivos rechazo");
      }

      if (rawMotivesRows.length > 0) {
        const ws3 = XLSX.utils.json_to_sheet(rawMotivesRows, {
          skipHeader: false,
        });
        XLSX.utils.book_append_sheet(wb, ws3, "Motivos en crudo");
      }

      XLSX.writeFile(wb, "reporte_convocatorias.xlsx");
    } catch (e) {
      toastAlerts.showError("Error exporting to Excel", e.message);
    }
    setLoading(false);
  };

  const handleSelectOption = (option) => {
    setSearchTerm(option);
    setShowOptions(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      //Esto es para cerrar el menu cuando se hace click fuera del input
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 background-white">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Reporte de Convocatorias
        </h1>
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-end mb-6">
          <div>
            <label className="block text-xs font-semibold mb-1">
              Fecha desde
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 text-gray-500 rounded px-2 py-2 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Fecha hasta
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 text-gray-500 rounded px-2 py-2 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          {/* Barra de búsqueda de convocatoria y botón filtrar juntos */}
          <div className="flex items-end gap-2">
            <div className="relative" ref={inputRef}>
              <label className="block text-xs font-semibold mb-1">
                Convocatoria
              </label>
              <input
                type="text"
                placeholder="Buscar convocatoria"
                className="border border-gray-300 text-gray-500 rounded-full px-2 py-2 w-56 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowOptions(true);
                }}
                onFocus={() => setShowOptions(true)}
                autoComplete="off"
              />
              {/* Menú personalizado */}
              {showOptions && filteredOptions.length > 0 && (
                <ul
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto"
                  style={{ minWidth: "14rem" }}
                >
                  {filteredOptions.map((opt) => (
                    <li
                      key={opt}
                      className={`px-3 py-2 cursor-pointer hover:bg-emerald-100 ${
                        opt === searchTerm ? "bg-emerald-50" : ""
                      }`}
                      onMouseDown={() => handleSelectOption(opt)}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {canFilter && (
              <button
                onClick={handleFilter}
                className="bg-emerald-600 text-white rounded-full px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                disabled={loading}
              >
                Filtrar
              </button>
            )}
          </div>
          <div className="w-64"></div>
          {(isValidPeriod || searchTerm) && (
            <button
              className="ml-auto text-gray-400 border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSearchTerm("");
                setFilteredEndDate("");
                setFilteredStartDate("");
                setFilteredOpportunity("");
                fetchJobOpportunitiesData();
              }}
            >
              Limpiar filtros
            </button>
          )}
          <button
            className={`${
              !isValidPeriod && !searchTerm ? "ml-auto" : ""
            } flex gap-2 items-center border border-green-600 text-green-700 px-3 py-1 rounded hover:bg-green-100`}
            onClick={handleExportExcel}
            disabled={loading}
          >
            <FaFileExcel />
            Exportar a Excel
          </button>
        </div>
        {/* Gráficos en grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 flex">
            {jobOpportunitiesData ? (
              <JobOpporrtunitiesBarChart
                data={jobOpportunitiesData}
                fromDate={filteredStartDate}
                toDate={filteredEndDate}
              />
            ) : (
              <div className="w-full h-80 bg-white rounded shadow p-10 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  {loading
                    ? "Cargando datos..."
                    : "No se encontraron convocatorias para el período seleccionado."}
                </div>
              </div>
            )}
          </div>
          <div className="col-span-2 flex">
            {rejectedData &&
            Array.isArray(rejectedData) &&
            rejectedData.length > 0 ? (
              <JobOpportunitiesPieChart
                data={rejectedData}
                fromDate={filteredStartDate}
                toDate={filteredEndDate}
                filteredOpportunity={filteredOpportunity}
              />
            ) : (
              <div className="w-full h-80 bg-white rounded shadow p-10 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  {loading
                    ? "Cargando datos..."
                    : "No se encontraron motivos de rechazo para el período seleccionado."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
