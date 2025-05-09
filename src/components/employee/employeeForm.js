"use client";

import { useEffect, useState } from "react";
import HasPermission from "../HasPermission";
import { PERMISSIONS } from "@/constants/permissions";
import RelationalInput from "../RelationalInput";
import SelectActiveChip from "./SelectActiveChip";
import { defaultEmployeeForm } from "@/constants/defaultEmployeeForm";
import { useCountries } from "@/hooks/useCountries";
import { useJob } from "@/hooks/useJob";
import { parseOptionsToRelationalInput } from "@/utils/parseOptions";
import { useStatesCountry } from "@/hooks/useStatesCountry";
import EmployeePhoto from "./EmployeePhoto";

export default function EmployeeForm({ employeeData, onSaveChanges }) {
  const [formData, setFormData] = useState(defaultEmployeeForm);
  const [editing, setEditing] = useState(false);
  const {
    countries,
    loading: loadingCountries,
    error: errorCountries,
  } = useCountries();
  const {
    states,
    loading: loadingStatesCountry,
    error: errorStatesCountry,
  } = useStatesCountry();
  const { jobs, loading: loadingJobs, error: errorJobs } = useJob();

  const jobsParsed = parseOptionsToRelationalInput(jobs);
  const countriesParsed = parseOptionsToRelationalInput(countries);
  const statesParsed = parseOptionsToRelationalInput(states);

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
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">Estado</label>
              <SelectActiveChip
                value={employeeData.active ? "activo" : "inactivo"}
                onChange={(newState) =>
                  setFormData((prev) => ({
                    ...prev,
                    active: newState === "active",
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Cargo</label>

              <RelationalInput
                label={"Cargo"}
                options={jobsParsed}
                value={
                  jobsParsed.find((c) => c.value === formData.job_id) || null
                }
                onChange={(selectedCargo) => {
                  setFormData((prev) => ({
                    ...prev,
                    job_id: selectedCargo ? selectedCargo.id : null,
                    job_title: selectedCargo ? selectedCargo.name : "", // Guardás el nombre también
                  }));
                  setEditing(true);
                }}
                verDetalles={() => {
                  const cargo = jobsParsed.find(
                    (c) => c.value === formData.job_id
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
                value={formData.job?.sector?.name}
                className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <EmployeePhoto
            photoBase64={formData.photo}
            onPhotoChange={(newBase64) => {
              setFormData((prev) => ({
                ...prev,
                photo: newBase64,
              }));
              setEditing(true);
            }}
          />
        </div>
        <div className="flex ">
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
              <label className="text-sm whitespace-nowrap text-gray-500">
                Tipo DNI
              </label>
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

          <div className="flex justify-center w-full">
            <div className="flex flex-col ">
              <label className="text-sm text-gray-500">
                Fecha de Nacimiento
              </label>
              <input
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
                className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
              />
            </div>
          </div>
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

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Dirección</label>
          <div className="flex gap-2">
            <input
              name="address_street"
              type="text"
              placeholder="Calle"
              value={formData.address_street}
              onChange={handleChange}
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
            />
            <input
              name="address_city"
              type="text"
              placeholder="Ciudad"
              value={formData.address_city}
              onChange={handleChange}
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
            />
            <input
              name="address_cp"
              type="text"
              placeholder="CP"
              value={formData.address_cp}
              onChange={handleChange}
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-500">Estado/Provincia</label>

            <RelationalInput
              label={"Estado/Provincia"}
              options={statesParsed}
              value={
                statesParsed.find(
                  (c) => c.value === formData.address_state_id
                ) || null
              }
              onChange={(selectedCargo) => {
                setFormData((prev) => ({
                  ...prev,
                  address_state_id: selectedCargo ? selectedCargo.id : null,
                  address_state_name: selectedCargo ? selectedCargo.name : "", // Guardás el nombre también
                }));
                setEditing(true);
              }}
              verDetalles={() => {
                const cargo = statesParsed.find(
                  (c) => c.value === formData.address_state_id
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
            <label className="text-sm text-gray-500">País</label>

            <RelationalInput
              label={"Estado/Provincia"}
              options={statesParsed}
              value={
                statesParsed.find(
                  (c) => c.value === formData.address_country_id
                ) || null
              }
              onChange={(selectedCargo) => {
                setFormData((prev) => ({
                  ...prev,
                  address_country_id: selectedCargo ? selectedCargo.id : null,
                  address_country_name: selectedCargo ? selectedCargo.name : "", // Guardás el nombre también
                }));
                setEditing(true);
              }}
              verDetalles={() => {
                const cargo = statesParsed.find(
                  (c) => c.value === formData.address_country_id
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

        <div className="flex gap-2 justify-between">
          <div className="flex flex-col">
            <label className="text-sm whitespace-nowrap text-gray-500">
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

          <HasPermission permission={PERMISSIONS.VIEW_SALARY}>
            <div className="flex flex-col justify-center ">
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
