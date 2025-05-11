import axios from "axios";
import config from "@/config";

const SelectStatusChip = ({ value, postulationId, onChange }) => {
  const getColorClass = (val) => {
    switch (val) {
      case "pendiente":
        return "bg-yellow-200 text-yellow-700 border-yellow-400";
      case "aceptada":
        return "bg-green-200 text-green-700 border-green-400";
      case "no aceptada":
        return "bg-red-200 text-red-700 border-red-400";
      case "contratado":
        return "bg-blue-200 text-blue-700 border-blue-400";
      default:
        return "bg-gray-200 text-gray-600 border-gray-400";
    }
  };

  const handleChange = async (e) => {
    const newValue = e.target.value;

    try {
      const res = await axios.patch(
        `${config.API_URL}/postulations/${postulationId}`,
        { status: newValue }
      );
      console.log("Estado actualizado:", res.data);
      // Aquí podrías agregar un estado local para actualizar visualmente si lo necesitás.
      onChange();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`rounded-full px-3 py-1 text-sm font-semibold border focus:outline-none ${getColorClass(value)}`}
    >
      <option value="pendiente" className="bg-white text-black">Pendiente</option>
      <option value="aceptada" className="bg-white text-black">Aceptada</option>
      <option value="no aceptada" className="bg-white text-black">No aceptada</option>
      <option value="contratado" className="bg-white text-black">Contratado</option>
    </select>
  );
};

export default SelectStatusChip;
