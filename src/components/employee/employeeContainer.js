"use client";
import EmployeeForm from "@/components/employee/employeeForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import EmployeeWorkHistory from "./employeeWorkHistory";
import EmployeeDocuments from "./employeeDocuments";
import Cookies from "js-cookie";
import config from "@/config";
import axios from "axios";

export default function EmployeeContainer({ id }) {
  const [employeeData, setEmployeeData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Datos Personales", "Historial Laboral", "Documentos"];

  const token = Cookies.get("token");
  const router = useRouter();

  const fetchEmployeeData = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status != 200) throw new Error("Error al traer los empleados");

      setEmployeeData(res.data);
    } catch (e) {
      console.error(e);
      alert("Ocurrió un error al traer los datos del empleado");
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const handleSaveEmployeeForm = async (employeeChangedData) => {
    try {
      const res = await axios.patch(`${config.API_URL}/employees/${id}`, employeeChangedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status != 200) throw new Error("Error al guardar cambios");
    } catch (e) {
      console.error(e);
      alert("Ocurrió un error al guardar los datos del empleado");
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-black">
        <IoMdArrowRoundBack
          onClick={() => router.back()}
          className="cursor-pointer text-black"
        />
        <h1 className="text-2xl font-semibold">Empleado / #{id}</h1>
      </div>

      <div className="mt-4">
        <div className="flex space-x-4 border-b border-gray-300">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-4 text-sm font-semibold rounded-t-md ${
                activeTab === index
                  ? "border-b-2 border-emerald-500 text-emerald-500"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 && <EmployeeForm employeeData={employeeData} onSaveChanges={handleSaveEmployeeForm} />}

        {/* Historial Laboral */}
        {activeTab === 1 && <EmployeeWorkHistory employeeData={employeeData} />}

        {/* Documentos */}
        {activeTab === 2 && <EmployeeDocuments employeeData={employeeData} />}
      </div>
    </div>
  );
}
