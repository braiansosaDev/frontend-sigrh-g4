'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export default function EmployeeForm({ employeeData, onSaveChanges }) {
  const [formData, setFormData] = useState(employeeData);
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
  }, [employeeData])

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Nombre Completo</label>
            <input
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Cargo</label>
            <input
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleChange}
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
            />
          </div>
        </div>

        <Image
          src="/imagen-oficina.png"
          alt="Foto del empleado"
          width={200}
          height={200}
          className="rounded-md object-cover"
        />

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">DNI</label>
          <input
            name="dni"
            type="text"
            value={formData.dni}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Teléfono</label>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Dirección</label>
          <input
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Fecha de Nacimiento</label>
          <input
            name="birth_date"
            type="text"
            value={formData.birth_date}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Fecha de Contratación</label>
          <input
            name="hire_date"
            type="text"
            value={formData.hire_date}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Salario</label>
          <input
            name="salary"
            type="text"
            value={formData.salary}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Contraseña sistema</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Rol</label>
          <input
            disabled
            value={formData.department}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
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
