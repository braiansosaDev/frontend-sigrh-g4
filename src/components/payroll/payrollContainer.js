"use client";

import { useEffect, useState, useRef } from "react";
import PayrollTable from "./payrollTable";
import * as XLSX from "xlsx";
import { useEmployees } from "@/hooks/useEmployees";
import config from "@/config";
import axios from "axios";
import Cookies from "js-cookie";

const conceptos = [
  "Feriado",
  "Simples convenio básico",
  "Horas extra",
  "Vacaciones",
  "Licencia",
];

function stringSimilarity(a, b) {
  // Para encontrar coincidencias exactas
  if (a.toLowerCase() === b.toLowerCase()) return 1;
  // Coincidencias parciales
  if (b && a.toLowerCase().includes(b.toLowerCase())) return 0.8;
  // Por caracteres en común
  let matches = 0;
  for (let char of b.toLowerCase()) {
    if (a.toLowerCase().includes(char)) {
      matches++;
    } else {
      return 0;
    }
  }
  return (matches / Math.max(a.length, 1)) * 0.5;
}

export default function PayrollContainer({}) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [concepto, setConcepto] = useState("");
  const { employees, loading, error } = useEmployees();
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEmployeeFinded, setIsEmployeeFinded] = useState(false);
  const [payroll, setPayroll] = useState([]);
  const inputRef = useRef();
  const token = Cookies.get("token");

  const fetchPayroll = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/employee_hours/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status != 200) {
        throw new Error("No se pudieron obtener los empleados");
      }
      setPayroll(response.data);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al traer los datos de la planilla");
    }
  };

  useEffect(() => {
    if (!selectedEmployee) return;
    fetchPayroll();
  }, [selectedEmployee]);

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      setSelectedEmployee(null);
      return;
    }
    const scored = employees
      .map((emp) => ({
        ...emp,
        score: stringSimilarity(
          emp.first_name + " " + emp.last_name + " #" + emp.user_id || "",
          search
        ),
      }))
      .filter((emp) => emp.score > 0)
      .sort((a, b) => b.score - a.score);

    setSuggestions(scored);

    if (
      suggestions[0]?.first_name +
        " " +
        suggestions[0]?.last_name +
        " #" +
        suggestions[0]?.user_id ===
      search
    ) {
      setIsEmployeeFinded(true);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, employees]);

  const handleSincronizar = () => {
    const employeeFinded = employees.find(
      (emp) =>
        emp.first_name + " " + emp.last_name + " #" + emp.user_id === search
    );
    if (!employeeFinded) {
      alert(
        "No se encontró al empleado solicitado, revise el nombre y user id (recuerde, la estructura es: nombre apellido #user_id) puede guiarse con las sugerencias."
      );
      return;
    }

    if (!startDate || !endDate) {
      alert("Por favor, seleccione un rango de fechas.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("La fecha inicial no puede ser mayor a la fecha final.");
      return;
    }

    setSelectedEmployee(employeeFinded);
  };

  const handleProcesar = () => {};

  const handleExportarExcel = () => {
    if (payroll.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(payroll);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Planilla");
    XLSX.writeFile(wb, "planilla.xlsx");
  };

  const handleSelectSuggestion = (emp) => {
    setSearch(emp.first_name + " " + emp.last_name + " #" + emp.user_id);
    setIsEmployeeFinded(true);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setSelectedEmployee(null);
    setIsEmployeeFinded(false);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100); // Permite click en sugerencia
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Barra superior de filtros y acciones */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-md border-b">
        <div className="flex flex-wrap items-center gap-4 relative">
          {/* Buscador con sugerencias */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar empleado..."
              value={search}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={handleBlur}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              autoComplete="off"
            />
            {showSuggestions && search && (
              <div className="absolute z-10 bg-white border rounded w-full mt-1 max-h-48 overflow-auto shadow">
                {suggestions.length === 0 && !isEmployeeFinded ? (
                  <div className="px-3 py-2 text-gray-400 select-none">
                    No se encontraron empleados.
                  </div>
                ) : (
                  suggestions.map((emp, idx) => (
                    <div
                      key={emp.id || idx}
                      className="px-3 py-2 hover:bg-emerald-100 cursor-pointer"
                      onMouseDown={() => handleSelectSuggestion(emp)}
                    >
                      {emp.first_name} {emp.last_name} {"#" + emp.user_id}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Fecha inicial */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none"
          />

          {/* Fecha final */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
            Buscar
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
        <PayrollTable data={payroll} employee={selectedEmployee} />
      </div>
    </div>
  );
}
