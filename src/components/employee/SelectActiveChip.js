const SelectActiveChip = ({ value, onChange }) => {
    const getColorClass = (val) => {
      switch (val) {
        case "activo":
          return "bg-green-100 text-green-800 border-green-300";
        case "inactivo":
          return "bg-red-100 text-red-800 border-red-300";
        default:
          return "bg-gray-100 text-gray-800 border-gray-300";
      }
    };
  
    return (
      <select
        value={value}
        onChange={onChange}
        className={`rounded-full px-3 py-1 text-sm font-semibold border ${getColorClass(
          value
        )} focus:outline-none`}
      >
        <option value="activo" className="bg-white text-black">Activo</option>
        <option value="inactivo" className="bg-white text-black">Inactivo</option>
      </select>
    );
  };

export default SelectActiveChip;
  