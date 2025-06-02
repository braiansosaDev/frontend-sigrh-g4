import LicensesTable from "./LicensesTable";

export default function LicensesContainer() {
  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-4 mt-6">
        <h1 className="text-2xl font-bold text-gray-800 cursor-default">
          Licencias 📄
        </h1>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-full shadow cursor-pointer">
          Filtros
        </button>
      </div>
      <hr className="border-gray-200 mb-6" />
      <div className="min-h-[200px] bg-white rounded shadow-sm flex items-center justify-center">
        <LicensesTable />
      </div>
    </div>
  );
}
