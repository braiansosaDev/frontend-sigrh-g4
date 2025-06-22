"use client";

import React, { useState, useEffect } from "react";
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

  const token = Cookies.get("token");

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
    fetchIndicators(firstDay, lastDay);
    fetchSuitabilityData(firstDay, lastDay);
    fetchStatusData(firstDay, lastDay);
  }, []);

  const fetchIndicators = async (from, to) => {
    setLoading(true);
    try {
      const params = { from_date: from, to_date: to };
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

  const fetchSuitabilityData = async (from, to) => {
    const params = { from_date: from, to_date: to };
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
  };

  const fetchStatusData = async (from, to) => {
    const params = { from_date: from, to_date: to };
    const res = await axios.get(`${config.API_URL}/postulations/stats/status`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
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
  };

  const handleFilter = () => {
    if (!startDate || !endDate || startDate > endDate) return;
    fetchIndicators(startDate, endDate);
    fetchSuitabilityData(startDate, endDate);
    fetchStatusData(startDate, endDate);
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
      const params = { from_date: startDate, to_date: endDate };
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
              });
            });
          }
        });
      }

      // Nueva hoja: Aptos/No Aptos IA
      const aptosNoAptosSheet = [
        { Periodo: `Desde: ${startDate} Hasta: ${endDate}` },
        {},
        ...(suitabilityData || []).map((item) => ({
          Tipo: item.name,
          Cantidad: item.value,
        })),
      ];

      // Nueva hoja: Evaluación aptos IA
      const evalAptosIASheet = [
        { Periodo: `Desde: ${startDate} Hasta: ${endDate}` },
        {},
        ...(statusData || []).map((item) => ({
          Tipo: item.name,
          Cantidad: item.value,
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
            {startDate && endDate && (
              <button
                onClick={handleFilter}
                className="bg-emerald-600 text-white rounded-full px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                disabled={loading || startDate > endDate}
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
        ></PostulationSuitabilityCharts>
      </div>
    </div>
  );
}
