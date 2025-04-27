"use client";

import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const routeTitles = {
  "/sigrh/employees": "Empleados",
  "/sigrh/vacancies": "Vacantes",
  "/sigrh/attendance": "Asistencia",
  "/sigrh/login": "Login",
};

export default function Navbar({ onToggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pageTitle = routeTitles[pathname] || "SIGRH+";

  return (
    <nav className="flex items-center bg-white p-4 fixed top-0 left-0 w-full z-20">
      {/* Botón Hamburguesa solo en mobile */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-2xl text-emerald-500"
        >
          <FaBars />
        </button>
        <span className="font-bold text-emerald-500 text-xl hidden md:inline">SIGRH+</span>
      </div>

      {/* Título dinámico */}
      <h1 className="md:hidden font-bold text-emerald-500 text-xl">{pageTitle}</h1>
    </nav>
  );
}
