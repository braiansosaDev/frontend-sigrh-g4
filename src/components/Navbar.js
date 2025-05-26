"use client";

import { FaBars } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/userContext";

const routeTitles = {
  "/sigrh/employees": "Empleados",
  "/sigrh/vacancies": "Vacantes",
  "/sigrh/attendance": "Asistencia",
  "/sigrh/login": "Login",
};

export default function Navbar({ onToggleSidebar }) {
  const pathname = usePathname();
  const { user } = useUser();

  const pageTitle = routeTitles[pathname] || "SIGRH+";

  return (
    <nav className="flex justify-between items-center bg-white p-4 fixed top-0 left-0 w-full z-20 border-b border-gray-100">
      {/* Botón Hamburguesa + Título */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-2xl text-emerald-500"
        >
          <FaBars />
        </button>
        <span className="font-bold text-emerald-500 text-xl hidden md:inline">
          SIGRH+
        </span>
      </div>

      {/* Título móvil */}
      <h1 className="md:hidden font-bold text-emerald-500 text-xl">
        {pageTitle}
      </h1>

      {/* Foto de usuario y nombre */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-end">
            <span className="text-sm font-semibold text-emerald-500">
              {user.first_name} {user.last_name}
            </span>
            <div className="flex gap-2 justify-end">
              {user.job?.name && (
                <span className="text-xs text-gray-600">{user.job.name}</span>
              )}
              {user.job?.sector?.name && (
                <span className="text-xs text-gray-400 italic">
                  {" "}
                  / {user.job.sector.name}
                </span>
              )}
            </div>
            {user.role_entity?.description ? (
              <span className="text-xs text-gray-400 italic font-semibold">
                {" "}
                 {user.role_entity?.description} (Rol)
              </span>
            ) : (<span className="text-xs text-gray-400 italic font-semibold">
                Invitado (Rol)
              </span>)}
          </div>
          <img
            src={user.photo}
            alt="Foto de perfil"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        </div>
      )}
    </nav>
  );
}
