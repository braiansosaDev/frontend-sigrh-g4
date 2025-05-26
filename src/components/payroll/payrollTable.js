import React from "react";

const columns = [
  "Id",
  "Fecha",
  "Concepto",
  "Turno",
  "Cant. Fichadas",
  "Notas",
  "register_type",
  "Primer check in",
  "Último check out",
  "Tiempo trabajado",
  "Pagar?",
  "Salario diario",
];

export default function PayrollTable({ data, employee }) {
  return (
    <div className="overflow-x-auto">
      {employee ? (
        <div>
          <h2 className="font-semibold mb-4 ml-4">
            {" "}
            Asistencia de {employee.first_name + " " + employee.last_name}
          </h2>
        </div>
      ) : null}
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="py-2 px-4 text-left text-sm font-medium text-gray-600"
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
                <td className="px-3 py-2 border-b">{row.employee_hours.id}</td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.work_date}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.concept.description}
                </td>
                <td className="px-3 py-2 border-b">{row.shift.description}</td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.check_count}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.notes}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.register_type}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.first_check_in}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.last_check_out}
                </td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.time_worked}
                </td>
                <td className="px-3 py-2 border-b">{row.employee_hours.pay}</td>
                <td className="px-3 py-2 border-b">
                  {row.employee_hours.daily_salary}
                </td>
                <td className="px-3 py-2 border-b">{row.hasta}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
