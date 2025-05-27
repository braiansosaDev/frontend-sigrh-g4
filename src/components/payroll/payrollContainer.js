"use client";

import { useEffect, useState, useRef } from "react";
import PayrollTable from "./payrollTable";
import * as XLSX from "xlsx";
import { useEmployees } from "@/hooks/useEmployees";
import config from "@/config";
import axios from "axios";
import Cookies from "js-cookie";

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

// Para agrupar fechas al llamar al back
function groupConsecutiveDates(dates) {
  if (dates.length === 0) return [];
  const groups = [];
  let groupStart = dates[0];
  let prev = new Date(dates[0]);
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      prev = curr;
    } else {
      groups.push({ start: groupStart, end: dates[i - 1] });
      groupStart = dates[i];
      prev = curr;
    }
  }
  groups.push({ start: groupStart, end: dates[dates.length - 1] });
  return groups;
}

export default function PayrollContainer({}) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //const [concepto, setConcepto] = useState("");
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
      if (!selectedEmployee || !startDate || !endDate) {
        return;
      }
      // Primero, obtengo los que ya se procesaron
      const res = await axios.post(
        `${config.API_URL}/payroll/hours`,
        {
          employee_id: selectedEmployee.id,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const processed = res.data;

      console.log("Procesados:", processed);

      if (res.status !== 200) {
        alert("Error al obtener los datos de la planilla");
        return;
      }

      // Segundo, agarramos las fechas que no aparezcan (obs: hay que perfeccionar esto, creo(?)) y luego las envío a procesar si hay alguna sin procesar
      const allDates = [];
      let d = new Date(startDate);
      const end = new Date(endDate);
      while (d <= end) {
        allDates.push(d.toISOString().slice(0, 10));
        d.setDate(d.getDate() + 1);
      }
      const processedDates = processed.map((r) => r.employee_hours.work_date);
      const missingDates = allDates.filter(
        (date) => !processedDates.includes(date)
      );

      if (missingDates.length > 0) {
        const blocks = groupConsecutiveDates(missingDates); //Divido en grupos las fechas faltantes para evitar problemas
        console.log("Bloques faltantes:", blocks);
        for (const block of blocks) {
          await axios.post(
            `${config.API_URL}/payroll/calculate`,
            {
              employee_id: selectedEmployee.id,
              start_date: block.start,
              end_date: block.end,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      // Tercero, ahora si, obtengo la planilla completa
      const res2 = await axios.post(
        `${config.API_URL}/payroll/hours`,
        {
          employee_id: selectedEmployee.id,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Planilla completa:", res2.data);

      if (res2.status !== 200) {
        alert("Error al obtener los datos de la planilla");
        return;
      }

      setPayroll(res2.data);
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

    // Obtiene la fecha de hoy en horario argentino (GMT-3)
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
    // today será "2025-05-26" por ejemplo

    if (endDate > today) {
      alert("No puedes seleccionar una fecha futura.");
      return;
    }

    setSelectedEmployee(employeeFinded);
    fetchPayroll();
  };

  //const handleProcesar = () => {};

  const handleExportarExcel = () => {
    if (payroll.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    // Para que se puedan exportar los datos a Excel
    const excelPayroll = payroll.map((row) => ({
      Día: new Date(row.employee_hours.work_date).toLocaleDateString("es-AR", {
        weekday: "long",
      }),
      Fecha: row.employee_hours.work_date,
      Novedad: row.employee_hours.register_type,
      Entrada: row.employee_hours.first_check_in,
      Salida: row.employee_hours.last_check_out,
      "Cant. fichadas": row.employee_hours.check_count,
      Turno: row.shift?.description || "",
      Concepto: row.concept?.description || "",
      Horas: row.employee_hours.sumary_time,
      Notas: row.employee_hours.notes,
      Pago: row.pay ? "Si" : "No",
    }));

    const ws = XLSX.utils.json_to_sheet(excelPayroll);
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
    <div className="flex flex-col h-screen p-6">
      {/* Barra superior de filtros y acciones */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white py-4">
        <div className="flex flex-wrap items-center gap-4 relative">
          {/* Buscador con sugerencias */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="🔍︎ Buscar empleado..."
              value={search}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={handleBlur}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              autoComplete="off"
            />
            {showSuggestions && search && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-48 overflow-auto shadow">
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
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
          />

          {/* Fecha final */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
          />

          {/* Filtro de conceptos */}
          {/* 
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
          */}

          {/* Botón sincronizar */}
          <button
            onClick={handleSincronizar}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
          >
            Buscar
          </button>
        </div>

        {/* Botones a la derecha */}
        <div className="flex gap-2 ml-auto">
          {/*  
          <button
            onClick={handleProcesar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            Procesar
          </button>
          */}
          <button
            onClick={handleExportarExcel}
            className="bg-emerald-400 hover:bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
          >
            Exportar a Excel
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <PayrollTable data={payroll} employee={selectedEmployee} />
      </div>
    </div>
  );
}
