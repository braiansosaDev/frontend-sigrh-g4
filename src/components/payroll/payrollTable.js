import React from "react";

const columns = [
  "Día",
  "Fecha",
  "Novedad",
  "Entrada",
  "Salida",
  "Cant. fichadas",
  "Turno",
  "Concepto",
  "Horas",
  "Pagar",
  "Cantidad",
  "Desde",
  "Hasta",
];

export default function PayrollTable({ data, name }) {
  return (
    <div className="overflow-x-auto">
      <div>
        <h2 className="font-semibold mb-4 ml-4">Asistencia de: {name}</h2>
      </div>
      <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 border-b bg-emerald-50 text-emerald-700 text-xs font-semibold text-left"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-400"
              >
                No hay datos compatibles con su búsqueda, revise que los datos
                sean correctos.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-emerald-50">
                <td className="px-3 py-2 border-b">{row.dia}</td>
                <td className="px-3 py-2 border-b">{row.fecha}</td>
                <td className="px-3 py-2 border-b">{row.novedad}</td>
                <td className="px-3 py-2 border-b">{row.entrada}</td>
                <td className="px-3 py-2 border-b">{row.salida}</td>
                <td className="px-3 py-2 border-b">{row.cantFichadas}</td>
                <td className="px-3 py-2 border-b">{row.turno}</td>
                <td className="px-3 py-2 border-b">{row.concepto}</td>
                <td className="px-3 py-2 border-b">{row.horas}</td>
                <td className="px-3 py-2 border-b">{row.pagar}</td>
                <td className="px-3 py-2 border-b">{row.cantidad}</td>
                <td className="px-3 py-2 border-b">{row.desde}</td>
                <td className="px-3 py-2 border-b">{row.hasta}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
