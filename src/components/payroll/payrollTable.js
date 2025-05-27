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
  "Notas",
  "Pago",
];

export default function PayrollTable({ data, employee }) {
  //Para hacer la primera letra mayúscula
  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="overflow-auto h-[70vh]">
      {/* {employee ? (
        <div>
          <h2 className="font-semibold mb-4 ml-4">
            {" "}
            Asistencia de {employee.first_name + " " + employee.last_name}
          </h2>
        </div>
      ) : null} */}
      <table className="min-w-full table-fixed border border-gray-200 bg-white rounded-lg shadow">
        <thead className="sticky top-0">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 border-b bg-emerald-50 text-emerald-700 text-xs font-semibold text-center"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-400"
              >
                {employee
                  ? "No hay resultados para la búsqueda."
                  : "Ingrese los campos de búsqueda y haga clic en buscar para ver los resultados."}
              </td>
            </tr>
          ) : (
            data?.map((row, idx) => (
              <tr key={idx} className="hover:bg-emerald-50">
                <td className="px-3 py-2 border-b">
                  {capitalize(
                    new Date(
                      row.employee_hours.work_date + "T00:00:00"
                    ).toLocaleDateString("es-AR", { weekday: "long" })
                  )}
                </td>
                <td className="px-3 py-2 border-b whitespace-nowrap">
                  {row.employee_hours.work_date}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.register_type}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.first_check_in
                    ? new Date(
                        `1970-01-01T${row.employee_hours.first_check_in}`
                      ).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : ""}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.last_check_out
                    ? new Date(
                        `1970-01-01T${row.employee_hours.last_check_out}`
                      ).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : ""}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.check_count}
                </td>
                <td className="px-3 py-2 border-b">{row.shift.description}</td>
                <td className="px-3 py-2 border-b">
                  {row.concept.description}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.sumary_time}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.notes}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.pay ? "Si" : "No"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
