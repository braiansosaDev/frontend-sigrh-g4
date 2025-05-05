"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HasPermission from "../HasPermission";
import { PERMISSIONS } from "@/constants/permissions";
import RelationalInput from "../RelationalInput";
import SelectActiveChip from "./SelectActiveChip";

export default function EmployeeForm({ employeeData, onSaveChanges }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    job_id: null,
    job_title: "",
    job_sector_name: "",
    dni: "",
    type_dni: "",
    personal_email: "",
    phone: "",
    address: "",
    birth_date: "",
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
              <label className="text-sm text-gray-500">Nombre</label>
              <input
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Apellido/s</label>
              <input
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Cargo</label>

              <RelationalInput
                label={"Cargo"}
                options={cargos}
                value={cargos.find((c) => c.job_id === formData.job_id) || null}
                onChange={(selectedCargo) => {
                  setFormData((prev) => ({
                    ...prev,
                    job_id: selectedCargo ? selectedCargo.job_id : null,
                    job_title: selectedCargo ? selectedCargo.name : "", // Guardás el nombre también
                  }));
                  setEditing(true);
                }}
                verDetalles={() => {
                  const cargo = cargos.find(
                    (c) => c.job_id === formData.job_id
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

            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Area</label>
              <input
                name="sector_name"
                type="text"
                value={formData.job_sector_name}
                className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">Estado</label>
              <SelectActiveChip
                value={employeeData.active}
                onChange={(newState) =>
                  setFormData((prev) => ({
                    ...prev,
                    active: newState === "active",
                  }))
                }
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Email personal</label>
              <input
                name="personal_email"
                type="personal_email"
                value={formData.personal_email}
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
        </div>

        <div className="flex gap-2">
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
            <label className="text-sm text-gray-500">Tipo DNI</label>
            <select
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
              value={formData.type_dni}
              onChange={handleChange}
            >
              <option value="lc">LC</option>
              <option value="le">LE</option>
              <option value="du">DU</option>
              <option value="li">LI</option>
            </select>
          </div>
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

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Dirección</label>
          <div className="flex gap-2">
          <input
            name="adress_calle"
            type="text"
            placeholder="Calle"
            value={formData.adress_calle}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
          <input
            name="adress_ciudad"
            type="text"
            placeholder="Ciudad"
            value={formData.adress_ciudad}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
          <input
            name="adress_cp"
            type="text"
            placeholder="CP"
            value={formData.adress_cp}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
          </div>
          <input
            name="adress_state_id"
            type="text"
            placeholder="Estado"
            value={formData.adress_state_id}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
          <input
            name="adress_country_id"
            type="text"
            placeholder="Pais"
            value={formData.adress_country_id}
            onChange={handleChange}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Fecha de Nacimiento</label>
            <input
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500">
              Fecha de Contratación
            </label>
            <input
              name="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={handleChange}
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
            />
          </div>
        </div>

        <HasPermission permission={PERMISSIONS.VIEW_SALARY}>
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
        </HasPermission>
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
