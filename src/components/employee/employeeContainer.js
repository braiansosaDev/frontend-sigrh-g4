"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Cookies from "js-cookie";
import config from "@/config";
import axios from "axios";
import EmployeeForm from "./EmployeeForm";
import EmployeeWorkHistory from "./EmployeeWorkHistory";
import EmployeeDocuments from "./EmployeeDocuments";
import EmployeeUser from "./EmployeeUser";
import { cleanEmployeePayload } from "@/utils/cleanEmployeePayload";

export default function EmployeeContainer({ id }) {
  const [employeeData, setEmployeeData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    "Datos Personales",
    "Historial Laboral",
    "Documentos",
    "Usuario",
  ];

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
    if (id != "new") {
      fetchEmployeeData();
    }
  }, []);

  const handleSaveEmployeeForm = async (employeeChangedData) => {
    if (id != "new") {
      try {
        const cleanedData = cleanEmployeePayload(employeeChangedData);

        const res = await axios.patch(
          `${config.API_URL}/employees/${id}`,
          cleanedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status != 200) throw new Error("Error al guardar cambios");
        alert("Cambios guardados exitosamente.");
      } catch (e) {
        console.error(e);
        alert("Ocurrió un error al guardar los datos del empleado");
      }
    } else {
      try {
        const cleanedData = cleanEmployeePayload(employeeChangedData);

        const res = await axios.post(
          `${config.API_URL}/employees/register`,
          cleanedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status != 201) throw new Error("Error al guardar cambios");
        router.push(`/sigrh/employees/${res.data.id}`);
        alert("Cambios guardados exitosamente.");
      } catch (e) {
        console.error(e);
        alert("Ocurrió un error al guardar los datos del empleado");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-black">
        <IoMdArrowRoundBack
          onClick={() => router.push("/sigrh/employees")}
          className="cursor-pointer text-black"
        />
        <h1 className="text-2xl font-semibold">
          Empleado / {id == "new" ? "Nuevo" : `# ${id}`}
        </h1>
      </div>

      <div className="mt-4">
        <div className="flex space-x-4 border-b border-gray-300">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                if (id == "new" && index != 0) {
                  alert("Debe cargar y guardar datos personales antes de poder cargar datos secundarios.");
                  return;
                }
                setActiveTab(index)
              }}
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

        {activeTab === 0 && (
          <EmployeeForm
            employeeData={employeeData}
            id={id}
          />
        )}

        {/* Historial Laboral */}
        {activeTab === 1 && <EmployeeWorkHistory employeeData={employeeData} />}

        {/* Documentos */}
        {activeTab === 2 && <EmployeeDocuments employeeData={employeeData} />}

        {/* Usuario */}
        {activeTab === 3 && (
          <EmployeeUser
            employeeData={employeeData}
            id={id}
          />
        )}
      </div>
    </div>
  );
}
