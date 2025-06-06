"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import { useEmployees } from "@/hooks/useEmployees";
import LicenseModal from "./LicenseModal"; // Importa el modal

export default function LicensesTable() {
  const token = Cookies.get("token");
  const [licenses, setLicenses] = useState([]);
  const { employees } = useEmployees();
  const [expandedRows, setExpandedRows] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  function splitEveryNChars(str, n) {
    //Esto para que el texto quede mejor en la tabla, hago que las palabras largas se dividan en líneas de n caracteres
    if (!str) return "";
    const regex = new RegExp(`.{1,${n}}`, "g");
    return str.match(regex)?.join("\n") ?? str;
  }

  function handleManageLicense(license) {
    setSelectedLicense(license);
    setModalOpen(true);
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

  function countBusinessDays(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    let current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      const sunday = 0;
      const saturday = 6;

      if (day !== sunday && day !== saturday) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  const handleToggleReason = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = async (updatedLicense) => {
    const payload = {
      document_status: updatedLicense.document_status,
      request_status: updatedLicense.request_status,
    };

    try {
      const res = await axios.patch(
        `${config.API_URL}/leaves/${updatedLicense.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status !== 200) throw new Error("Error al modificar licencias");
    } catch (error) {
      console.error("Error al modificar licencias:", error);
      alert("No se pudieron obtener las licencias");
    }

    setLicenses((prev) =>
      prev.map((lic) => (lic.id === updatedLicense.id ? updatedLicense : lic))
    );
    setModalOpen(false);
    setSelectedLicense(null);
  };

  return (
    <>
      <table className="w-full bg-white rounded shadow-sm">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left border-b font-semibold">
              Usuario
            </th>
            <th className="py-2 px-4 text-left border-b font-semibold">
              Nombre
            </th>
            <th className="py-2 px-4 text-left border-b font-semibold">
              Fecha Solicitud
            </th>
            <th className="py-2 px-4 text-left border-b font-semibold">
              Motivo
            </th>
            <th className="py-2 px-4 text-left border-b font-semibold">
              Días hábiles
            </th>
            <th className="py-2 px-4 text-left border-b font-semibold">
              Desde
            </th>
            <th className="py-2 px-4 text-left border-b font-semibold">
              Hasta
            </th>
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
                  const emp = employees.find(
                    (emp) => emp.id === lic.employee_id
                  );
                  return emp
                    ? `${emp.first_name} ${emp.last_name}`
                    : "Desconocido";
                })()}
              </td>
              <td className="py-2 px-4 border-b">{lic.request_date}</td>
              <td className="py-2 px-4 border-b align-top">
                {lic.reason && lic.reason.length > 30 ? (
                  <>
                    {!expandedRows[lic.id] ? (
                      <>
                        <div className="whitespace-pre-line break-words">
                          {adaptText(
                            splitEveryNChars(lic.reason.slice(0, 30), 30)
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
                          {adaptText(splitEveryNChars(lic.reason, 30))}
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
                    {adaptText(splitEveryNChars(lic.reason, 30))}
                  </div>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {countBusinessDays(lic.start_date, lic.end_date)}
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
                <button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3 py-1 rounded-full"
                  onClick={() => handleManageLicense(lic)}
                >
                  Gestionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LicenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        license={selectedLicense}
        onSave={handleSave}
      />
    </>
  );
}
