export default function EmployeeWorkHistory({ employeeData }) {
  return (
    <div className="mt-4">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              Título de Trabajo
            </th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              Compañía
            </th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              Fecha de Inicio
            </th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              Fecha de Fin
            </th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              Notas
            </th>
          </tr>
        </thead>
        <tbody>
          {employeeData?.work_history?.map((history) => (
            <tr
              key={history.work_history_id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-2">{history.job_title}</td>
              <td className="px-4 py-2">{history.company_name}</td>
              <td className="px-4 py-2">{history.from_date}</td>
              <td className="px-4 py-2">{history.to_date}</td>
              <td className="px-4 py-2">{history.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
