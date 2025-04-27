"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaBriefcase,
  FaRegClock,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token"); // elimina el token
    router.push("sigrh/login"); // redirige al login (o a donde quieras)
  };

  return (
    <>
      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-col justify-between bg-white shadow-md w-64 h-[calc(100vh-4rem)] fixed top-16 left-0 p-4">
        <ul className="space-y-4">
          <li className="hover:bg-emerald-500 hover:text-white rounded-lg p-2 transition-all">
            <Link
              href="/sigrh/employees"
              className="flex items-center space-x-2"
            >
              <FaUsers className="text-2xl" />
              <span>Empleados</span>
            </Link>
          </li>
          <li className="hover:bg-emerald-500 hover:text-white rounded-lg p-2 transition-all">
            <Link
              href="/sigrh/vacancies"
              className="flex items-center space-x-2"
            >
              <FaBriefcase className="text-2xl" />
              <span>Vacantes</span>
            </Link>
          </li>
          <li className="hover:bg-emerald-500 hover:text-white rounded-lg p-2 transition-all">
            <Link
              href="/sigrh/attendance"
              className="flex items-center space-x-2"
            >
              <FaRegClock className="text-2xl" />
              <span>Asistencia</span>
            </Link>
          </li>
        </ul>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
          >
            <FaSignOutAlt className="text-2xl" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Sidebar Mobile (Offcanvas) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        >
          <div
            className="bg-white w-64 h-full p-4 shadow-md"
            onClick={(e) => e.stopPropagation()} // Para no cerrar si hace click adentro
          >
            <ul className="space-y-4">
              <li className="hover:bg-emerald-500 hover:text-white rounded-lg p-2 transition-all">
                <Link
                  href="/sigrh"
                  className="flex items-center space-x-2"
                  onClick={onClose}
                >
                  <FaHome className="text-2xl" />
                  <span>Inicio</span>
                </Link>
              </li>
              <li className="hover:bg-emerald-500 hover:text-white rounded-lg p-2 transition-all">
                <Link
                  href="/sigrh/employees"
                  className="flex items-center space-x-2"
                  onClick={onClose}
                >
                  <FaUsers className="text-2xl" />
                  <span>Empleados</span>
                </Link>
              </li>
              <li className="hover:bg-emerald-500 hover:text-white rounded-lg p-2 transition-all">
                <Link
                  href="/sigrh/vacancies"
                  className="flex items-center space-x-2"
                  onClick={onClose}
                >
                  <FaBriefcase className="text-2xl" />
                  <span>Vacantes</span>
                </Link>
              </li>
              <li className="hover:bg-emerald-500 hover:text-white rounded-lg p-2 transition-all">
                <Link
                  href="/sigrh/attendance"
                  className="flex items-center space-x-2"
                  onClick={onClose}
                >
                  <FaRegClock className="text-2xl" />
                  <span>Asistencia</span>
                </Link>
              </li>
            </ul>
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
              >
                <FaSignOutAlt className="text-2xl" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
