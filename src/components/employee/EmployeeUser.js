"use client";

import { useEffect, useState } from "react";
import HasPermission from "../HasPermission";
import { PERMISSIONS } from "@/constants/permissions";
import RelationalInput from "../RelationalInput";

export default function EmployeeUser({ employeeData, onSaveChanges }) {
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    role_id: "",
    role_name: ""
  });
  const [editing, setEditing] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setEditing(true);
  }

  function handleSave() {
    onSaveChanges(formData);
    setEditing(false);
  }

  function handleCancel() {
    setFormData(employeeData);
    setEditing(false);
  }

  useEffect(() => {
    setFormData(employeeData);
  }, [employeeData]);

  const cargos = [
    { job_id: 1, sector_id: 1, name: "Desarrollador Full Stack" },
    { job_id: 2, sector_id: 1, name: "Desarrollador Frontend" },
    { job_id: 3, sector_id: 1, name: "Desarrollador Backend" },
    { job_id: 4, sector_id: 1, name: "Desarrollador Python" },
  ].map((cargo) => ({
    ...cargo,
    label: cargo.name,
    value: cargo.job_id,
  }));

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Usuario</label>
              <input
                name="user_id"
                type="text"
                value={employeeData.user_id}
                onChange={handleChange}
                className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Password</label>
              <input
                name="password"
                type="password"
                value={employeeData.password}
                onChange={handleChange}
                className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Rol</label>

              <RelationalInput
                options={cargos}
                value={cargos.find((c) => c.role_id === employeeData.role_id) || null}
                onChange={(selectedCargo) => {
                  setFormData((prev) => ({
                    ...prev,
                    role_id: selectedCargo ? selectedCargo.role_id : null,
                    role_name: selectedCargo ? selectedCargo.name : "", // Guardás el nombre también
                  }));
                  setEditing(true);
                }}
                verDetalles={() => {
                  const cargo = cargos.find(
                    (c) => c.role_id === employeeData.role_id
                  );
                  if (cargo) {
                    alert(`Detalles del cargo:\n${cargo.name}`);
                  }
                }}
                onCrearNuevo={() => {
                  alert("Abrir modal para crear nuevo cargo");
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="flex justify-start gap-4 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
}
