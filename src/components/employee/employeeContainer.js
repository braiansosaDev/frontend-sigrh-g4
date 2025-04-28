"use client";
import EmployeeForm from "@/components/employee/employeeForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import EmployeeWorkHistory from "./employeeWorkHistory";
import EmployeeDocuments from "./employeeDocuments";

export default function EmployeeContainer({ id }) {
  const router = useRouter();

  const employeeData = {
    full_name: "Braian Sosa",
    password: "asd123",
    dni: "43022672",
    phone: "1125277961",
    email: "braianorlandososa@gmail.com",
    department: "Desarrollo",
    nationality: "Argentina",
    address: "Monteagudo 4977, José C. Paz",
    job_title: "Desarrollador Full Stack",
    salary: "150",
    birth_date: "20-10-2024",
    hire_date: "20-10-2024",
    photo: "asd123",
    facial_register: "asd123123123",
    work_history: [
      {
        work_history_id: 1,
        job_title: "Desarrollador Full Stack",
        from_date: "20-03-2022",
        to_date: "20-04-2024",
        company_name: "UNGS",
        notes: "Experiencia",
      },
      {
        work_history_id: 2,
        job_title: "Desarrollador Full Stack",
        from_date: "20-05-2025",
        to_date: "20-06-2026",
        company_name: "IT SOLUTIONS",
        notes: "Experiencia",
      },
    ],
    documents: [
      {
        document_id: 1,
        name: "CV",
        extension: ".pdf",
        creation_date: "20-04-2025",
        file: "asdadadsad123123123",
      },
    ],
  };

  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Datos Personales", "Historial Laboral", "Documentos"];

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

        {activeTab === 0 && <EmployeeForm employeeData={employeeData} />}

        {/* Historial Laboral */}
        {activeTab === 1 && <EmployeeWorkHistory employeeData={employeeData} />}

        {/* Documentos */}
        {activeTab === 2 && <EmployeeDocuments employeeData={employeeData} />}
      </div>
    </div>
  );
}
