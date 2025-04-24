"use client";

import jobs from "@/app/data/jobs";
import { useState } from "react";
import AplicantesOfertaTable from "./AplicantesOfertaTable";

export default function ListadoOfertas() {
  const [selectedOferta, setSelectedOferta] = useState({});

  return (
    <div>
      {selectedOferta ? (
        <AplicantesOfertaTable />
      ) : (
        <div>
          <h1 className="text-4xl font-bold text-cyan-800 mb-6">
            Ofertas de Trabajo
          </h1>
          <div className="grid gap-6">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="p-6 border border-cyan-800 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-cyan-700">
                    {job.title}
                  </h2>
                  {job.active ? (
                    <div className="rounded-full ml-2 flex justify-center items-center bg-green-100 py-0.5 px-2.5 border border-transparent text-sm text-green-800 transition-all shadow-sm">
                      Abierta
                    </div>
                  ) : (
                    <div className="rounded-full ml-2 flex justify-center items-center bg-red-100 py-0.5 px-2.5 border border-transparent text-sm text-red-800 transition-all shadow-sm">
                      Cerrada
                    </div>
                  )}
                </div>
                <p className="text-gray-700 font-medium">
                  {job.company} - {job.location}
                </p>
                <p className="mt-2 text-gray-600">{job.description}</p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={!job.active}
                    onClick={() => setSelectedOferta(job)}
                    className="mt-4 px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition"
                  >
                    Ver postulantes
                  </button>
                  <button
                    disabled={!job.active}
                    className="mt-4 px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-900 transition"
                  >
                    Editar
                  </button>
                  <button
                    disabled={!job.active}
                    className="mt-4 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
