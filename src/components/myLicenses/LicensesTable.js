import React from "react";

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
        {mockLicenses.map((lic) => (
          <tr key={lic.id}>
            <td className="py-2 px-4 border-b">{lic.fechaSolicitud}</td>
            <td className="py-2 px-4 border-b">{lic.motivo}</td>
            <td className="py-2 px-4 border-b">{lic.desde}</td>
            <td className="py-2 px-4 border-b">{lic.hasta}</td>
            <td className="py-2 px-4 border-b">{lic.estadoDoc}</td>
            <td className="py-2 px-4 border-b">{lic.estadoAceptacion}</td>
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
