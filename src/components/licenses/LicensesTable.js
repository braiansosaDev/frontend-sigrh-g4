"use client";

import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import { useEffect, useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";

const mockLicenses = [
  {
    id: 1,
    motivo: "Vacaciones",
    fechaSolicitud: "2024-06-01",
    desde: "2024-07-01",
    hasta: "2024-07-10",
    estadoDoc: "Presentado",
    estadoAceptacion: "Aprobada",
    observaciones: " - ",
  },
  {
    id: 2,
    motivo: "Enfermedad",
    fechaSolicitud: "2024-06-02",
    desde: "2024-06-05",
    hasta: "2024-06-08",
    estadoDoc: "Pendiente",
    estadoAceptacion: "Pendiente",
    observaciones: " - ",
  },
  {
    id: 3,
    motivo: "Estudio",
    fechaSolicitud: "2024-05-20",
    desde: "2024-06-15",
    hasta: "2024-06-20",
    estadoDoc: "Presentado",
    estadoAceptacion: "Rechazada",
    observaciones: " - ",
  },
];

export default function LicensesTable() {
  const token = Cookies.get("token");
  const [licenses, setLicenses] = useState([]);
  const { employees } = useEmployees();
  const [expandedRows, setExpandedRows] = useState({});

  function splitEveryNChars(str, n) {
    //Esto para que el texto quede mejor en la tabla, hago que las palabras largas se dividan en líneas de n caracteres
    if (!str) return "";
    const regex = new RegExp(`.{1,${n}}`, "g");
    return str.match(regex)?.join("\n") ?? str;
  }

  const fetchLicenses = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/leaves/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 200) throw new Error("Error al obtener licencias");
      setLicenses(res.data);
    } catch (error) {
      console.error("Error al traer licenses:", error);
      alert("No se pudieron obtener las licencias");
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const adaptText = (text) => {
    if (!text) return "";
    text = text.replace(/_/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleToggleReason = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <table className="w-full bg-white rounded shadow-sm">
      <thead>
        <tr>
          <th className="py-2 px-4 text-left border-b font-semibold">
            Usuario
          </th>
          <th className="py-2 px-4 text-left border-b font-semibold">Nombre</th>
          <th className="py-2 px-4 text-left border-b font-semibold">
            Fecha Solicitud
          </th>
          <th className="py-2 px-4 text-left border-b font-semibold">Motivo</th>
          <th className="py-2 px-4 text-left border-b font-semibold">Desde</th>
          <th className="py-2 px-4 text-left border-b font-semibold">Hasta</th>
          <th className="py-2 px-4 text-left border-b font-semibold">
            Estado doc.
          </th>
          <th className="py-2 px-4 text-left border-b font-semibold">
            Estado Aceptación
          </th>
          <th className="py-2 px-4 text-center border-b font-semibold">
            Modificar
          </th>
        </tr>
      </thead>
      <tbody>
        {licenses.map((lic) => (
          <tr key={lic.id}>
            <td className="py-2 px-4 border-b">
              {employees.find((emp) => emp.id === lic.employee_id)?.user_id ||
                "Desconocido"}
            </td>
            <td className="py-2 px-4 border-b">
              {(() => {
                const emp = employees.find((emp) => emp.id === lic.employee_id);
                return emp
                  ? `${emp.first_name} ${emp.last_name}`
                  : "Desconocido";
              })()}
            </td>
            <td className="py-2 px-4 border-b">{lic.request_date}</td>
            <td className="py-2 px-4 border-b align-top">
              {lic.reason && lic.reason.length > 40 ? (
                <>
                  {!expandedRows[lic.id] ? (
                    <>
                      <div className="whitespace-pre-line break-words">
                        {adaptText(
                          splitEveryNChars(lic.reason.slice(0, 40), 40)
                        )}
                        ...
                      </div>
                      <button
                        className="ml-0 mt-1 text-emerald-600 underline text-xs block"
                        onClick={() => handleToggleReason(lic.id)}
                        type="button"
                      >
                        Ver más
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="whitespace-pre-line break-words">
                        {adaptText(splitEveryNChars(lic.reason, 40))}
                      </div>
                      <button
                        className="ml-0 mt-1 text-emerald-600 underline text-xs block"
                        onClick={() => handleToggleReason(lic.id)}
                        type="button"
                      >
                        Ver menos
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="whitespace-pre-line break-words">
                  {adaptText(splitEveryNChars(lic.reason, 40))}
                </div>
              )}
            </td>
            <td className="py-2 px-4 border-b">{lic.start_date}</td>
            <td className="py-2 px-4 border-b">{lic.end_date}</td>
            <td className="py-2 px-4 border-b">
              {adaptText(lic.document_status)}
            </td>
            <td className="py-2 px-4 border-b">
              {adaptText(lic.request_status)}
            </td>
            <td className="py-2 px-4 border-b text-center">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 py-1 rounded-full">
                Modificar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
