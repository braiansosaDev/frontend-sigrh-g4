"use client";
import { useEffect, useState } from "react";
import jobs from "@/app/data/jobs";
import AplicarOfertaForm from "./AplicarOfertaForm";

export default function OfertaDetalle({ id }) {
  const [jobDetails, setJobDetails] = useState(null);
  const [formPostularseIsVisible, setFormPostularIsVisible] = useState(false);

  useEffect(() => {
    const jobFinded = jobs.find((job) => job.id == id);
    setJobDetails(jobFinded || null);
  }, [id]);

  const handlePostularse = () => {
    setFormPostularIsVisible(true);
  };

  const handleCancelarPostulacion = () => {
    setFormPostularIsVisible(false);
  };

  if (!jobDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Oferta no encontrada
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-10">
      {formPostularseIsVisible ? (
        <AplicarOfertaForm onCancel={handleCancelarPostulacion} jobDetails={jobDetails} />
      ) : (
        <div className="max-w-2xl mx-auto p-6 border border-cyan-800 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-cyan-800">{jobDetails.title}</h1>
          <p className="text-gray-700 font-medium mt-2">
            {jobDetails.company} - {jobDetails.location}
          </p>
          <p className="mt-4 text-gray-600">{jobDetails.description}</p>
          <h2 className="text-xl font-semibold text-cyan-700 mt-6">Requisitos</h2>
          <ul className="list-disc list-inside text-gray-600">
            {jobDetails.requirements?.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold text-cyan-700 mt-6">Beneficios</h2>
          <ul className="list-disc list-inside text-gray-600">
            {jobDetails.benefits?.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
          <button
            className="w-full px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition mt-4"
            onClick={handlePostularse}
          >
            Postularse
          </button>
        </div>
      )}
    </div>
  );
}
