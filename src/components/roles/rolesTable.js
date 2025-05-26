"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";
import RoleModal from "./rolesModal";
import { MdVisibility } from "react-icons/md";

export default function RolesTable() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const token = Cookies.get("token");

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch {
      alert("Error al obtener los roles.");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Roles</h1>
      <div className="overflow-x-auto rounded-lg max-h-[70vh] overflow-y-auto">
        <table className="min-w-full bg-white">
         
          <thead className="bg-gray-100 sticky top-0">
  <tr>
    <th className="py-2 px-4 text-left text-sm text-gray-600">ID</th>
    <th className="py-2 px-4 text-left text-sm text-gray-600">Nombre</th>
    <th className="py-2 px-4 text-left text-sm text-gray-600">Acciones</th>
  </tr>
</thead>
<tbody>
  {roles.length > 0 ? (
    roles.map((role) => (
      <tr
        key={role.id}
        className="border-b border-gray-100 hover:bg-gray-50 text-gray-700"
      >
        <td
          className="py-2 px-4 text-sm cursor-pointer"
          onClick={() => setSelectedRole(role)}
        >
          {role.id}
        </td>
        <td
          className="py-2 px-4 text-sm cursor-pointer"
          onClick={() => setSelectedRole(role)}
        >
          {role.name}
        </td>
        <td className="py-2 px-4 text-sm">
          <button
            onClick={() => setSelectedRole(role)}
            className="flex items-center gap-1 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full"
          >
            <MdVisibility /> Ver detalles
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="text-center py-4 text-gray-500">
        No se encontraron roles.
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>

      {selectedRole && (
        <RoleModal
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </div>
  );
}
