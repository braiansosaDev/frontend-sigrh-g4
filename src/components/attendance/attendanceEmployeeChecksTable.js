"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/config";
import axios from "axios";
import Cookies from "js-cookie";
import AttendanceEmployeeChecksFilter from "./attendanceEmployeeChecksFilter";
import AttendanceChecksEventsDetailsModal from "./attendanceChecksEventsDetailsModal";

export default function AttendanceEmployeeChecksTable() {
  const [resumeData, setResumeData] = useState([]);
  const [filters, setFilters] = useState(() => {
    const today = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
    return {
      searchTerm: "",
      startDate: today,
    };
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const token = Cookies.get("token");
  const router = useRouter();

  const fetchAttendanceResume = async () => {
    if (!filters.startDate) return;
    try {
      const res = await axios.get(
        `${config.API_URL}/clock_events/attendance-resume`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { fecha: filters.startDate },
        }
      );
      if (res.status !== 200) throw new Error("Error al traer resumen");
      setResumeData(res.data);
    } catch (e) {
      alert("Ocurrió un error al traer el resumen de asistencia");
    }
  };

  useEffect(() => {
    fetchAttendanceResume();
  }, [filters.startDate]);

  const filteredData = resumeData.filter((item) => {
    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
    return fullName.includes(filters.searchTerm.toLowerCase());
  });

  console.log("Filtered Data:", filteredData);

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-semibold">Resumen de asistencia</h1>
        </div>

        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
          }
          className="px-4 py-2 border border-gray-300 rounded-full w-80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="🔍︎ Buscar por nombre o apellido..."
        />

        <AttendanceEmployeeChecksFilter
          employees={resumeData}
          onApplyFilters={(f) =>
            setFilters((prev) => ({ ...prev, startDate: f.startDate }))
          }
        />
      </div>

      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Legajo ID
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Nombre
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Apellido
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Sector
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Primera entrada
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Última salida
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Total fichadas
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.employee_id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedEmployeeId(item.employee_id);
                    setModalOpen(true);
                  }}
                >
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {item.employee_id}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {item.first_name}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {item.last_name}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {item.job || "Sin sector"}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {item.first_in
                      ? new Date(item.first_in).toLocaleTimeString("es-AR")
                      : "—"}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {item.last_out
                      ? new Date(item.last_out).toLocaleTimeString("es-AR")
                      : "—"}
                  </td>
                  <td className="py-2 px-4 text-sm text-center text-gray-700 flex gap-2">
                    {item.total_events}
                    <button
                      onClick={() => {
                        setSelectedEmployeeId(item.employee_id);
                        setModalOpen(true);
                      }}
                      className="text-emerald-600 text-sm underline hover:text-emerald-800"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AttendanceChecksEventsDetailsModal
        open={modalOpen}
        employeeId={selectedEmployeeId}
        fecha={filters.startDate}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
