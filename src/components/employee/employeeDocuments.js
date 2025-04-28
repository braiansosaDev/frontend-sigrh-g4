export default function EmployeeDocuments({ employeeData }) {
  return (
    <div className="mt-4">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Nombre del Documento</th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Extensión</th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Fecha de Creación</th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Acción</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.documents.map((document) => (
            <tr key={document.document_id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <td className="px-4 py-2">{document.name}</td>
              <td className="px-4 py-2">{document.extension}</td>
              <td className="px-4 py-2">{document.creation_date}</td>
              <td className="px-4 py-2">
                <button className="text-emerald-500 hover:underline">
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
