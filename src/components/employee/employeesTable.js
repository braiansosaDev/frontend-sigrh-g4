"use client";
import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Importamos useRouter de Next.js
import config from "@/config";
import axios from "axios";
import Cookies from "js-cookie";

export default function EmployeesTable() {
  const [employees, setEmployees] = useState([]);
  const token = Cookies.get("token");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status != 200) throw new Error("Error al traer los empleados");

      setEmployees(res.data);
    } catch (e) {
      alert("Ocurrió un error al traer los empleados");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const router = useRouter(); // Hook de Next.js para navegación

  const handleRowClick = (id) => {
    // Redirige a la página de detalle del empleado
    router.push(`/sigrh/employees/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-semibold">Empleados</h1>
          <button 
            onClick={() => {router.push("employees/new")}}
            className="px-4 py-2 bg-emerald-500 rounded-full font-semibold cursor-pointer text-white mt-2"
          >
            + Agregar
          </button>
        </div>

        <input
          type="text"
          className="px-6 py-3 border border-gray-300 rounded-full w-80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="🔍︎ Buscar por nombre..."
        />

        {/* Botón de Filtros */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-full text-emerald-500 border-2 border-emerald-500 font-semibold">
          <FaFilter />
          Filtros
        </button>
      </div>

      {/* Tabla de empleados */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Legajo ID
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Nombre
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Puesto
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Fecha de Contratación
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(employee.id)} // Llamamos a la función al hacer clic
              >
                <td className="py-2 px-4 text-sm text-gray-700">
                  {employee.id}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {employee.full_name}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {employee.job_title}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {employee.hire_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
