"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import config from "@/config";

export default function JobOpportunityLogs({ jobOpportunityId }) {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (!open || !jobOpportunityId) return;

    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/logs`, {
          params: {
            entity: "CONVOCATORIA",
            entity_id: jobOpportunityId,
          },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs", err);
      }
    };

    fetchLogs();
  }, [open, jobOpportunityId]);

  const filteredLogs = useMemo(() => {
    let result = [...logs];

    if (search) {
      result = result.filter((log) =>
        log.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (employeeFilter !== "all") {
      result = result.filter(
        (log) => String(log.employee?.id) === employeeFilter
      );
    }

    if (sortOrder === "desc") {
      result.sort((a, b) => new Date(b.date_change) - new Date(a.date_change));
    } else {
      result.sort((a, b) => new Date(a.date_change) - new Date(b.date_change));
    }

    return result;
  }, [logs, search, employeeFilter, sortOrder]);

  const uniqueEmployees = useMemo(() => {
    const seen = new Set();
    return logs
      .map((log) => log.employee)
      .filter((emp) => emp && !seen.has(emp.id) && seen.add(emp.id));
  }, [logs]);

  if (!open) return null;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-xl w-full flex flex-col">
        {/* Filtros (sin scroll) */}
        <div className="px-4 py-2 border-b border-gray-300 bg-gray-50 flex flex-col gap-2 text-sm">
          <div className="flex gap-2 items-center justify-between">
            <input
              type="text"
              placeholder="Buscar descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 px-3 py-1 rounded w-full"
            />

            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded text-sm w-full"
            >
              <option value="all">Todos los usuarios</option>
              {uniqueEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded text-sm"
            >
              <option value="desc">Más recientes</option>
              <option value="asc">Más antiguos</option>
            </select>
          </div>
        </div>

        {/* Body con scroll solo aquí */}
        <div className="overflow-y-auto px-4 py-3 flex-1 max-h-[60vh]">
          <ul className="space-y-2">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <li
                  key={log.id}
                  className="border-b border-gray-200 pb-2 text-sm text-gray-700"
                >
                  <div className="mb-1">
                    <span className="font-medium">📝 Descripción:</span>{" "}
                    {log.description}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <div>
                      👤 <strong>Usuario:</strong>{" "}
                      {log?.employee
                        ? `${log.employee.first_name} ${log.employee.last_name}`
                        : `ID ${log.user_id}`}
                    </div>
                    <div>
                      🕒 <strong>Fecha:</strong>{" "}
                      {new Date(log.date_change).toLocaleString("es-AR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">Sin cambios registrados.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
