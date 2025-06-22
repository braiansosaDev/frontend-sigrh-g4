"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PostulationIndicatorsCards from "./PostulationIndicatorsCards";
import config from "@/config";
import Cookies from "js-cookie";
import { toastAlerts } from "@/utils/toastAlerts";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

export default function PostulationIndicatorsContainer() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [indicators, setIndicators] = useState(null);

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

  const handleFilter = () => {
    if (!startDate || !endDate || startDate > endDate) return;
    fetchIndicators(startDate, endDate);
  };

  const handleExportExcel = async () => {
    if (!indicators) return;
    setLoading(true);
    try {
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

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sheetData, { skipHeader: false });
      XLSX.utils.book_append_sheet(wb, ws, "Indicadores postulaciones");

      if (rawPostulationsRows.length > 0) {
        const ws2 = XLSX.utils.json_to_sheet(rawPostulationsRows, {
          skipHeader: false,
        });
        XLSX.utils.book_append_sheet(wb, ws2, "Datos crudos postulaciones");
      }

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
      </div>
    </div>
  );
}
