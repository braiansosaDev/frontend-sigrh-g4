import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import { useUser } from "@/contexts/userContext";

function splitEveryNChars(str, n) {
  //Esto para que el texto quede mejor en la tabla, hago que las palabras largas se dividan en líneas de n caracteres
  if (!str) return "";
  const regex = new RegExp(`.{1,${n}}`, "g");
  return str.match(regex)?.join("\n") ?? str;
}

export default function LicensesTable() {
  const token = Cookies.get("token");
  const [licenses, setLicenses] = useState([]);
  const { user } = useUser();
  const [expandedRows, setExpandedRows] = useState({});

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

  return (
    <table className="w-full bg-white rounded shadow-sm">
      <thead>
        <tr>
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
          ))
        ) : (
          <tr>
            <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
              No realizaste ninguna solicitud de licencia aún.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
