"use client";

import { useState } from "react";
import PayrollTable from "./payrollTable";
import * as XLSX from "xlsx";

const conceptos = [
  "Feriado",
  "Simples convenio básico",
  "Horas extra",
  "Vacaciones",
  "Licencia",
];

const exampleData = [
  {
    dia: "Lunes",
    fecha: "2025-05-22",
    novedad: "Presente",
    entrada: "08:00",
    salida: "17:00",
    cantFichadas: 2,
    turno: "Mañana",
    concepto: "Feriado",
    horas: 8,
    pagar: 1000,
    cantidad: 1,
    desde: "2025-05-22",
    hasta: "2025-05-22",
  },
];

export default function PayrollContainer({ children }) {
  const [search, setSearch] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [concepto, setConcepto] = useState("");
  const [asistencias, setAsistencias] = useState(exampleData);
  const [nombre, setNombre] = useState(search);

  const handleSincronizar = () => {
    setNombre(search);
  };
  const handleProcesar = () => {};
  const handleExportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(asistencias);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Planilla");
    XLSX.writeFile(wb, "planilla.xlsx");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Barra superior de filtros y acciones */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-md border-b">
        <div className="flex flex-wrap items-center gap-4">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar empleado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {/* Fecha inicial */}
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none"
          />

          {/* Fecha final */}
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none"
          />

          {/* Filtro de conceptos */}
          <select
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">Todos los conceptos</option>
            {conceptos.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Botón sincronizar */}
          <button
            onClick={handleSincronizar}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            Sincronizar
          </button>
        </div>

        {/* Botones a la derecha */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleProcesar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            Procesar
          </button>
          <button
            onClick={handleExportarExcel}
            className="bg-emerald-400 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            Exportar a Excel
          </button>
        </div>
      </div>

      <div className="mt-6 flex-grow overflow-auto">
        <PayrollTable data={asistencias} name={nombre} />
      </div>
    </div>
  );
}
