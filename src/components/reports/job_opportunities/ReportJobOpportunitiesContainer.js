"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { toastAlerts } from "@/utils/toastAlerts";
import JobOpporrtunitiesBarChart from "./JobOpportunitiesBarChart";
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

  const isValidPeriod = !!startDate && !!endDate && startDate <= endDate;
  const token = Cookies.get("token");

  const handleFilter = async () => {
    if (!isValidPeriod && !type) return;
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.from_date = startDate;

      if (endDate) params.to_date = endDate;

      console.log("params", params);

      const res = await axios.post(
        `${config.API_URL}/opportunities/count-active-inactive`,
        params,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobOpportunitiesData(res.data);
      setFilteredStartDate(startDate);
      setFilteredEndDate(endDate);
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
      setJobOpportunitiesData(res.data);
      setFilteredStartDate(fromDate);
      setFilteredEndDate(untilDate);
    } catch (e) {
      toastAlerts.showError(
        "Error al traer los datos de las convocatorias, recargue la página e intente nuevamente"
      );
      console.error("Error al filtrar convocatorias:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobOpportunitiesData();
  }, [token]);

  const handleExportExcel = () => {
    setLoading(true);
    try {
      const filteredDate = [
        {
          "Período consultado": `Desde: ${
            filteredStartDate || startDate
          } Hasta: ${filteredEndDate || endDate}`,
        },
      ];

      const excelData = [
        {
          Estado: "Convocatorias activas",
          Cantidad: jobOpportunitiesData.active_count || 0,
        },
        {
          Estado: "Convocatorias inactivas",
          Cantidad: jobOpportunitiesData.inactive_count || 0,
        },
      ];

      const dataSheet = [...filteredDate, {}, ...excelData];

      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.json_to_sheet(dataSheet, { skipHeader: false });
      XLSX.utils.book_append_sheet(wb, ws1, "Datos Maestros");
      XLSX.writeFile(wb, "reporte_convocatorias.xlsx");
    } catch (e) {
      toastAlerts.showError("Error al exportar a Excel", e.message);
    }
    setLoading(false);
  };

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
          <div className="w-64"></div>
          {isValidPeriod && (
            <>
              <button
                onClick={handleFilter}
                className="bg-emerald-600 text-white rounded-full px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                disabled={!isValidPeriod || loading}
              >
                Filtrar
              </button>
              <button
                className="ml-auto text-gray-400 border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  fetchJobOpportunitiesData();
                }}
              >
                Limpiar filtros
              </button>
            </>
          )}

          <button
            className={`${
              !isValidPeriod ? "ml-auto" : ""
            } flex gap-2 items-center border border-green-600 text-green-700 px-3 py-1 rounded hover:bg-green-100`}
            onClick={handleExportExcel}
            disabled={loading}
          >
            <FaFileExcel />
            Exportar a Excel
          </button>
        </div>
        {/* Gráfico */}
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
    </div>
  );
}
