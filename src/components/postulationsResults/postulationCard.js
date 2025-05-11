import { FaDownload } from "react-icons/fa";
import SelectStatusChip from "./SelectStatusChip";
import { MdOutlineFileDownload } from "react-icons/md";

export default function PostulationCard({ postulation, handleDownloadCV, onRefresh }) {
  const { required_words = [], desired_words = [] } = postulation.ability_match || {};

  return (
    <div
      key={postulation.id}
      className="bg-white shadow-md rounded-lg p-4 border border-gray-300 relative"
    >
      <div className="flex justify-between">
        <h2 className="text-lg font-bold text-gray-800">
        Postulación #{postulation.id}
      </h2>
      <SelectStatusChip 
        value={postulation.status}
        postulationId={postulation.id}
        onChange={() => {
          onRefresh()
        }}
      />
      </div>
      
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
            postulation.suitable ? "text-green-600" : "text-red-600"
          }`}
        >
          {postulation.suitable ? "Apta" : "No apta"}
        </span>
      </p>

      <p className="text-sm text-gray-600">
        Habilidades requeridas encontradas:{" "}
        <span className="font-semibold">
          {required_words.length > 0 ? required_words.join(", ") : "Ninguna"}
        </span>
      </p>

      <p className="text-sm text-gray-600">
        Habilidades deseables encontradas:{" "}
        <span className="font-semibold">
          {desired_words.length > 0 ? desired_words.join(", ") : "Ninguna"}
        </span>
      </p>

      <button
        onClick={() =>
          handleDownloadCV(postulation.cv_file, `cv_${postulation.id}.pdf`)
        }
        className="flex items-center gap-2 mt-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm hover:bg-emerald-600"
      >
        <MdOutlineFileDownload className="w-4 h-4" />
        Descargar CV
      </button>

      {/* <button className="absolute right-28 mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600">
        Seleccionar
      </button>

      <button className="absolute right-2 mt-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">
        Rechazar
      </button> */}
    </div>
  );
}
