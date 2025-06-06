import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import { useUser } from "@/contexts/userContext";
import LicenseRevision from "./LicenseRevision";

function splitEveryNChars(str, n) {
  //Esto para que el texto quede mejor en la tabla, hago que las palabras largas se dividan en líneas de n caracteres
  if (!str) return "";
  const regex = new RegExp(`.{1,${n}}`, "g");
  return str.match(regex)?.join("\n") ?? str;
}

export default function LicensesTable({ disabled }) {
  const token = Cookies.get("token");
  const [licenses, setLicenses] = useState([]);
  const { user } = useUser();
  const [expandedRows, setExpandedRows] = useState({});
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  const fetchUserLicenses = async () => {
    try {
      const res = await axios.get(
        `${config.API_URL}/leaves/?employee_id=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status !== 200) throw new Error("Error al obtener licencias");
      setLicenses(res.data);
    } catch (error) {
      console.error("Error al traer licenses:", error);
      alert("No se pudieron obtener las licencias");
    }
  };

  useEffect(() => {
    if (user && token) {
      // Esto lo hago para evitar que busque sin user o token
      fetchUserLicenses();
    }
  }, [user, token]);

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

  const handleRevision = (license) => {
    setSelectedLicense(license);
    setRevisionOpen(true);
  };

  const handleSaveRevision = async (updatedLicense) => {
    const payload = {
      file: updatedLicense.file || null,
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
    setRevisionOpen(false);
    setSelectedLicense(null);
  };

  return (
    <>
      <table className="w-full bg-white rounded shadow-sm">
        <thead>
          <tr>
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
          {licenses.length > 0 ? (
            licenses.map((lic) => (
              <tr key={lic.id}>
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
                            disabled={disabled}
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
                <td className="py-2 px-4 border-b">
                  {/** Días hábiles */}
                  {(() => {
                    if (!lic.start_date || !lic.end_date) return "-";
                    const start = new Date(lic.start_date);
                    const end = new Date(lic.end_date);
                    let count = 0;
                    let current = new Date(start);
                    while (current <= end) {
                      const day = current.getDay();
                      if (day !== 0 && day !== 6) count++;
                      current.setDate(current.getDate() + 1);
                    }
                    return count;
                  })()}
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
                    onClick={() => handleRevision(lic)}
                    disabled={disabled}
                  >
                    Revisar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                No realizaste ninguna solicitud de licencia aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LicenseRevision
        open={revisionOpen}
        onClose={() => setRevisionOpen(false)}
        license={selectedLicense}
        onSave={handleSaveRevision}
      />
    </>
  );
}
