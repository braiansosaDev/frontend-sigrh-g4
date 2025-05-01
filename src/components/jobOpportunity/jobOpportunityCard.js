export default function JobOpportunityCard({
  title,
  department,
  postDate,
  lastUpdateDate,
  onModify,
  state,
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600">
        Departamento: <span className="font-semibold">{department}</span>
      </p>
      <p className="text-sm text-gray-600">
        Fecha de Publicación: <span className="font-semibold">{postDate}</span>
      </p>
      <p className="text-sm text-gray-600">
        Última Actualización:{" "}
        <span className="font-semibold">{lastUpdateDate}</span>
      </p>
      <p className="text-sm text-gray-600">
        Estado:{" "}
        <span
          className={`text-sm font-semibold ${
            state === "Inactiva" ? "text-red-600" : "text-green-600"
          }`}
        >
          {state}
        </span>{" "}
      </p>

      <button
        onClick={onModify}
        className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
      >
        Modificar
      </button>
    </div>
  );
}
