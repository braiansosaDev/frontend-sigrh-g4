"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

import {
  FaUsers,
  FaBriefcase,
  FaRegClock,
  FaHome,
  FaSignOutAlt,
  FaChevronRight,
  FaCashRegister,
  FaMoneyBill,
  FaMoneyCheck,
  FaRegMoneyBillAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FaMoneyBillTransfer, FaRegMoneyBill1 } from "react-icons/fa6";

const menuItems = [
  {
    label: "Inicio",
    icon: <FaHome className="text-2xl" />,
    path: "/sigrh",
  },
  {
    label: "Empleados",
    icon: <FaUsers className="text-2xl" />,
    path: "/sigrh/employees",
    submenus: [
      {
        label: "Listado de empleados",
        path: "/sigrh/employees",
        icon: <FaUsers />,
      },
      {
        label: "Puestos de trabajo",
        path: "/sigrh/jobs",
        icon: <FaBriefcase />,
      },
      { label: "Sectores", path: "/sigrh/sectors", icon: <FaUsers /> },
    ],
  },
  {
    label: "Convocatorias",
    icon: <FaBriefcase className="text-2xl" />,
    path: "/sigrh/job_opportunities",
  },
  {
    label: "Asistencia",
    icon: <FaRegClock className="text-2xl" />,
    path: "/sigrh/attendance",
  },
  {
    label: "Nómina",
    icon: <FaMoneyCheck className="text-2xl" />,
    path: "/sigrh/payroll",
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const submenuRef = useRef();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/sigrh/login");
  };

  const handleClickOutside = (e) => {
    if (submenuRef.current && !submenuRef.current.contains(e.target)) {
      setActiveSubMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <div className="relative">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col justify-between bg-white shadow-md w-64 h-[calc(100vh-4rem)] fixed top-16 left-0 p-4 z-20">
        <ul className="space-y-2">
          {menuItems.map((item, idx) => {
            const isParentActive = pathname.startsWith(item.path);
            const hasSubmenus = Array.isArray(item.submenus);

            return (
              <li key={idx} className="relative">
                {!hasSubmenus ? (
                  <Link
                    href={item.path}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-all w-full ${
                      isActive(item.path)
                        ? "bg-emerald-500 text-white"
                        : "hover:bg-emerald-500 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setActiveSubMenu(activeSubMenu === idx ? null : idx)
                      }
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                        isParentActive
                          ? "bg-emerald-500 text-white"
                          : "hover:bg-emerald-500 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <FaChevronRight />
                    </button>

                    {activeSubMenu === idx && (
                      <div
                        ref={submenuRef}
                        className="absolute top-0 left-full w-56 bg-white shadow-lg border border-gray-200 rounded-lg z-30"
                      >
                        <ul className="p-2">
                          {item.submenus.map((sub, subIdx) => (
                            <li key={subIdx}>
                              <Link
                                href={sub.path}
                                className={`flex items-center space-x-2 p-2 rounded-lg transition w-full ${
                                  isActive(sub.path)
                                    ? "bg-emerald-500 text-white"
                                    : "hover:bg-emerald-500 hover:text-white"
                                }`}
                              >
                                {sub.icon && sub.icon}
                                <span>{sub.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
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
  );
}
