"use client";

import { useState } from "react";

export default function PostulationModal({ onClose, jobTitle }) {
  const [step, setStep] = useState(1); // Controla la etapa del proceso
  const [email, setEmail] = useState(""); // Almacena el correo del postulante
  const [cvFile, setCvFile] = useState(null); // Almacena el archivo del CV

  const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar email
    if (!emailRegex.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return false;
    }

    // Falta la validación del email con el backend

    return true;
  };

  const validateCv = (file) => {
    const allowedExtensions = ["doc", "docx", "pdf"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert("El archivo debe ser un .doc, .docx o .pdf.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo no debe exceder los 5 MB.");
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await validateEmail(email);
      if (!isValid) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!cvFile) {
        alert("Por favor, sube tu CV antes de continuar.");
        return;
      }
      const isValid = validateCv(cvFile);
      if (!isValid) {
        return;
      }
      setStep(3);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Postularse a: {jobTitle}
            </h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingresa tu correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="ejemplo@correo.com"
            />
            <button
              onClick={handleNext}
              className="mt-4 w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Sube tu CV
            </h2>
            <div
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 cursor-pointer"
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  setCvFile(file);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {cvFile ? (
                <span>{cvFile.name}</span>
              ) : (
                <span>Arrastra tu archivo aquí o haz clic para subirlo</span>
              )}
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              id="cv-upload"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="cv-upload"
              className="mt-2 inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300"
            >
              Seleccionar archivo
            </label>
            <button
              onClick={handleNext}
              className="mt-4 w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Enviar
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirmación
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro de enviar tu CV para la oferta "{jobTitle}"?
            </p>
            <button
              onClick={() => setStep(4)}
              className="w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Confirmar y Enviar
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ¡CV enviado con éxito!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Nos pondremos en contacto contigo pronto.
            </p>
          </div>
        )}

        <div className="flex justify-center items-center mb-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
