import Image from "next/image";

export default function EmployeeForm({ employeeData }) {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Nombre Completo</label>
            <input
              type="text"
              defaultValue={employeeData.full_name}
              className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Cargo</label>
            <input
              type="text"
              defaultValue={employeeData.job_title}
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
            type="text"
            defaultValue={employeeData.dni}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Email</label>
          <input
            type="email"
            defaultValue={employeeData.email}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Teléfono</label>
          <input
            type="text"
            defaultValue={employeeData.phone}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Dirección</label>
          <input
            type="text"
            defaultValue={employeeData.address}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Fecha de Nacimiento</label>
          <input
            type="text"
            defaultValue={employeeData.birth_date}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Fecha de Contratación</label>
          <input
            type="text"
            defaultValue={employeeData.hire_date}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Contraseña sistema</label>
          <input
            type="password"
            defaultValue={employeeData.password}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Rol</label>
          <input
            disabled
            defaultValue={employeeData.password}
            className="bg-transparent text-black focus:outline-none hover:border-b hover:border-emerald-500 pb-1"
          />
        </div>
      </div>
    </div>
  );
}
