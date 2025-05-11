export default function PostulationCard({ postulation, handleDownloadCV }) {
  return (
    <div
      key={postulation.id}
      className="bg-white shadow-md rounded-lg p-4 border border-gray-300 relative"
    >
      <h2 className="text-lg font-bold text-gray-800">
        Postulación #{postulation.id}
      </h2>
      <h3>
        Nombre completo:{" "}
        <span className="font-semibold">
          {postulation.name} {postulation.surname}
        </span>
      </h3>
      <p className="text-sm text-gray-600">
        Estado:{" "}
        <span
          className={`font-semibold ${
            postulation.is_apt ? "text-green-600" : "text-red-600"
          }`}
        >
          {postulation.is_apt ? "Apta" : "No apta"}
        </span>
      </p>
      <p className="text-sm text-gray-600">
        Habilidades encontradas:{" "}
        <span className="font-semibold">React, Node.js</span>{" "}
        {/* Hardcodeado */}
      </p>
      <button
        onClick={() =>
          handleDownloadCV(postulation.cv_file, `cv_${postulation.id}.pdf`)
        }
        className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600"
      >
        Descargar CV
      </button>
      <button className="absolute right-28 mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600">
        Seleccionar
      </button>
      <button className="absolute right-2 mt-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">
        Rechazar
      </button>
    </div>
  );
}
