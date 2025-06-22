"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PostulationIndicatorsCards from "./PostulationIndicatorsCards";
import config from "@/config";
import Cookies from "js-cookie";
import { toastAlerts } from "@/utils/toastAlerts";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import PostulationSuitabilityCharts from "./PostulationSuitabilityCharts";

export default function PostulationIndicatorsContainer() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredStartDate, setFilteredStartDate] = useState("");
  const [filteredEndDate, setFilteredEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [indicators, setIndicators] = useState(null);
  const [suitabilityData, setSuitabilityData] = useState(null);
  const [statusData, setStatusData] = useState(null);

  const [opportunities, setOpportunities] = useState([]);
  const [jobOpportunitySearch, setJobOpportunitySearch] = useState("");
  const [showJobOpportunityOptions, setShowJobOpportunityOptions] =
    useState(false);
  const [selectedJobOpportunity, setSelectedJobOpportunity] = useState(null);
  const jobOpportunityInputRef = useRef(null);

  const token = Cookies.get("token");

  useEffect(() => {
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
      }
    };
    fetchOpportunities();
  }, [token]);

  // Filtros de opciones para el buscador
  const opportunityOptions = opportunities.map((o) => ({
    label: `${o.title} #${o.id}`,
    value: o.id,
  }));
  const filteredJobOpportunityOptions = jobOpportunitySearch
    ? opportunityOptions.filter((opt) =>
        opt.label.toLowerCase().includes(jobOpportunitySearch.toLowerCase())
      )
    : opportunityOptions;

  // Cerrar menú de opciones al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        jobOpportunityInputRef.current &&
        !jobOpportunityInputRef.current.contains(event.target)
      ) {
        setShowJobOpportunityOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchIndicators = async (from, to, jobOpportunityId) => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from_date = from;
      if (to) params.to_date = to;
      if (jobOpportunityId) params.job_opportunity_id = jobOpportunityId;
      const res = await axios.get(
        `${config.API_URL}/opportunitiesopportunities/indicators-by-date-range`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      setIndicators(res.data);
    } catch (e) {
      toastAlerts.showError("Error al obtener indicadores de postulaciones");
    }
    setLoading(false);
  };

  const fetchSuitabilityData = async (from, to, jobOpportunityId) => {
    try {
      const params = {};
      if (from) params.from_date = from;
      if (to) params.to_date = to;
      if (jobOpportunityId) params.job_opportunity_id = jobOpportunityId;
      const res = await axios.get(
        `${config.API_URL}/postulations/stats/suitability`,
        { headers: { Authorization: `Bearer ${token}` }, params }
      );
      let totalAptosIA = 0,
        totalNoAptosIA = 0;
      if (Array.isArray(res.data)) {
        res.data.forEach((item) => {
          totalAptosIA += item.aptos_ia || 0;
          totalNoAptosIA += item.no_aptos_ia || 0;
        });
      }
      setSuitabilityData([
        { name: "Aptos IA", value: totalAptosIA },
        { name: "No Aptos IA", value: totalNoAptosIA },
      ]);
    } catch (e) {
      toastAlerts.showError("Error al obtener datos de aptitud IA");
    }
  };

  const fetchStatusData = async (from, to, jobOpportunityId) => {
    try {
      const params = {};
      if (from) params.from_date = from;
      if (to) params.to_date = to;
      if (jobOpportunityId) params.job_opportunity_id = jobOpportunityId;
      const res = await axios.get(
        `${config.API_URL}/postulations/stats/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      let totalAptosIA2 = 0,
        totalAceptada = 0,
        totalContratado = 0;
      if (Array.isArray(res.data)) {
        res.data.forEach((item) => {
          totalAptosIA2 += item.aptos_ia || 0;
          totalAceptada += item.aptos_aceptada || 0;
          totalContratado += item.aptos_contratado || 0;
        });
      }
      const aptosIANoAceptadosNiContratados = Math.max(
        totalAptosIA2 - totalAceptada - totalContratado,
        0
      );
      setStatusData([
        {
          name: "Aptos IA no aceptados/contratados",
          value: aptosIANoAceptadosNiContratados,
        },
        { name: "Aceptados", value: totalAceptada },
        { name: "Contratados", value: totalContratado },
      ]);
    } catch (e) {
      toastAlerts.showError("Error al obtener datos de estado IA");
    }
  };

  // Primer carga
  useEffect(() => {
    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-01`;
    const lastDayDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastDay = `${lastDayDate.getFullYear()}-${String(
      lastDayDate.getMonth() + 1
    ).padStart(2, "0")}-${String(lastDayDate.getDate()).padStart(2, "0")}`;
    setStartDate(firstDay);
    setEndDate(lastDay);
    fetchIndicators(firstDay, lastDay, null);
    fetchSuitabilityData(firstDay, lastDay, null);
    fetchStatusData(firstDay, lastDay, null);
  }, []);

  const handleFilter = () => {
    if (
      (!startDate || !endDate || startDate > endDate) &&
      !selectedJobOpportunity
    ) {
      return;
    }
    const jobOpportunityId = selectedJobOpportunity
      ? selectedJobOpportunity.value
      : null;
    fetchIndicators(startDate, endDate, jobOpportunityId);
    fetchSuitabilityData(startDate, endDate, jobOpportunityId);
    fetchStatusData(startDate, endDate, jobOpportunityId);
    setFilteredStartDate(startDate);
    setFilteredEndDate(endDate);
  };

  const handleExportExcel = async () => {
    if (!indicators) return;
    setLoading(true);
    try {
      // Hoja 1: Indicadores principales
      const periodInfo = [
        {
          Periodo: `Desde: ${startDate} Hasta: ${endDate}`,
        },
      ];
      if (selectedJobOpportunity) {
        periodInfo.push({
          "Convocatoria filtrada": `${selectedJobOpportunity.label}`,
        });
      }
      const indicatorsRows = [
        {
          Indicador: "Promedio Aptos",
          Valor: indicators.suitable_average ?? 0,
        },
        {
          Indicador: "Promedio No Aptos",
          Valor: indicators.not_suitable_average ?? 0,
        },
        {
          Indicador: "Promedio Aceptados",
          Valor: indicators.accepted_postulation_average ?? 0,
        },
        {
          Indicador: "Promedio Rechazados",
          Valor: indicators.rejected_postulation_average ?? 0,
        },
        {
          Indicador: "Promedio Contratados",
          Valor: indicators.hired_postulation_average ?? 0,
        },
        {
          Indicador: "Promedio Pendientes",
          Valor: indicators.pending_postulation_average ?? 0,
        },
        {
          Indicador: "Cantidad de Convocatorias",
          Valor: indicators.count_opportunities ?? 0,
        },
        {
          Indicador: "Cantidad de Postulaciones",
          Valor: indicators.count_postulations ?? 0,
        },
      ];
      const sheetData = [...periodInfo, {}, ...indicatorsRows];

      // Hoja 2: Datos crudos postulaciones
      const params = {};
      if (startDate) params.from_date = startDate;
      if (endDate) params.to_date = endDate;
      if (selectedJobOpportunity)
        params.job_opportunity_id = selectedJobOpportunity.value;
      const resRaw = await axios.get(
        `${config.API_URL}/opportunities/opportunities-postulations`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      let rawPostulationsRows = [];
      if (Array.isArray(resRaw.data)) {
        resRaw.data.forEach((op) => {
          if (
            selectedJobOpportunity &&
            String(op.id) !== String(selectedJobOpportunity.value)
          ) {
            return;
          }
          if (Array.isArray(op.postulations)) {
            op.postulations.forEach((post) => {
              rawPostulationsRows.push({
                Convocatoria: `${op.title} #${op.id}`,
                Nombre: post.name,
                Apellido: post.surname,
                Email: post.email,
                Teléfono: post.phone_number,
                País: post.address_country_id,
                "Provincia/Estado": post.address_state_id,
                "Evaluado en": post.evaluated_at,
                Apto: post.evaluated_at
                  ? post.suitable
                    ? "Sí"
                    : "No"
                  : "No evaluado",
                "Estado postulación": post.status,
                Motivo: post.motive,
                "Creado en": post.created_at,
                "Actualizado en": post.updated_at,
                "Convocatoria filtrada":
                  selectedJobOpportunity?.label || "Sin filtro",
              });
            });
          }
        });
      }

      // Nueva hoja: Aptos/No Aptos IA
      const aptosNoAptosSheet = [
        { Periodo: `Desde: ${startDate} Hasta: ${endDate}` },
        selectedJobOpportunity
          ? { "Convocatoria filtrada": selectedJobOpportunity.label }
          : {},
        {},
        ...(suitabilityData || []).map((item) => ({
          Tipo: item.name,
          Cantidad: item.value,
          "Convocatoria filtrada":
            selectedJobOpportunity?.label || "Sin filtro",
        })),
      ];

      // Nueva hoja: Evaluación aptos IA
      const evalAptosIASheet = [
        { Periodo: `Desde: ${startDate} Hasta: ${endDate}` },
        selectedJobOpportunity
          ? { "Convocatoria filtrada": selectedJobOpportunity.label }
          : {},
        {},
        ...(statusData || []).map((item) => ({
          Tipo: item.name,
          Cantidad: item.value,
          "Convocatoria filtrada":
            selectedJobOpportunity?.label || "Sin filtro",
        })),
      ];

      // Generar el Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sheetData, { skipHeader: false });
      XLSX.utils.book_append_sheet(wb, ws, "Indicadores postulaciones");

      if (rawPostulationsRows.length > 0) {
        const ws2 = XLSX.utils.json_to_sheet(rawPostulationsRows, {
          skipHeader: false,
        });
        XLSX.utils.book_append_sheet(wb, ws2, "Datos crudos postulaciones");
      }

      // Hoja: Aptos/No Aptos IA
      const ws3 = XLSX.utils.json_to_sheet(aptosNoAptosSheet, {
        skipHeader: false,
      });
      XLSX.utils.book_append_sheet(wb, ws3, "Aptos y No Aptos");

      // Hoja: Evaluación aptos IA
      const ws4 = XLSX.utils.json_to_sheet(evalAptosIASheet, {
        skipHeader: false,
      });
      XLSX.utils.book_append_sheet(wb, ws4, "Evaluación aptos IA");

      XLSX.writeFile(wb, "indicadores_postulaciones.xlsx");
    } catch (e) {
      toastAlerts.showError("Error al exportar a Excel", e.message);
      console.error("Error al exportar a Excel:", e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Reportes de Postulaciones
        </h1>
        <div className="flex flex-wrap gap-4 items-end mb-6 justify-between">
          <div className="flex flex-wrap gap-4 items-end">
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
            <div className="relative" ref={jobOpportunityInputRef}>
              <label className="block text-xs font-semibold mb-1">
                Convocatoria
              </label>
              <input
                type="text"
                placeholder="Buscar convocatoria"
                className="border border-gray-300 text-gray-500 rounded-full px-2 py-2 w-56 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={jobOpportunitySearch}
                onChange={(e) => {
                  setJobOpportunitySearch(e.target.value);
                  setShowJobOpportunityOptions(true);
                }}
                onFocus={() => setShowJobOpportunityOptions(true)}
                autoComplete="off"
              />
              {showJobOpportunityOptions &&
                filteredJobOpportunityOptions.length > 0 && (
                  <ul
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto"
                    style={{ minWidth: "14rem" }}
                  >
                    {filteredJobOpportunityOptions.map((opt) => (
                      <li
                        key={opt.value}
                        className={`px-3 py-2 cursor-pointer hover:bg-emerald-100 ${
                          selectedJobOpportunity?.value === opt.value
                            ? "bg-emerald-50"
                            : ""
                        }`}
                        onMouseDown={() => {
                          setSelectedJobOpportunity(opt);
                          setJobOpportunitySearch(opt.label);
                          setShowJobOpportunityOptions(false);
                        }}
                      >
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              {selectedJobOpportunity && (
                <button
                  className="absolute right-2 top-8 text-gray-400 hover:text-red-500"
                  title="Quitar filtro"
                  onClick={() => {
                    setSelectedJobOpportunity(null);
                    setJobOpportunitySearch("");
                  }}
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
            {((startDate && endDate && startDate <= endDate) ||
              selectedJobOpportunity) && (
              <button
                onClick={handleFilter}
                className="bg-emerald-600 text-white rounded-full px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Filtrar
              </button>
            )}
          </div>
          <button
            onClick={handleExportExcel}
            className="flex gap-2 items-center border border-green-600 text-green-700 px-3 py-1 rounded hover:bg-green-100"
            disabled={loading || !indicators}
          >
            <FaFileExcel />
            Exportar a Excel
          </button>
        </div>
        <PostulationIndicatorsCards data={indicators} />
        <PostulationSuitabilityCharts
          suitabilityData={suitabilityData}
          statusData={statusData}
        />
      </div>
    </div>
  );
}
