import { useState, useEffect } from "react";
import FaceScan from "./faceScan";

export default function FaceRecognitionContainer({ type }) {
  const [step, setStep] = useState("waiting"); // "waiting", "findingFace", "succesful", "error"
  const [empleado, setEmpleado] = useState(null);

  const historialMock = [
    { fecha: "14/05/2025 08:00", tipo: "Entrada" },
    { fecha: "13/05/2025 17:01", tipo: "Salida" },
    { fecha: "13/05/2025 08:00", tipo: "Entrada" },
  ];

  const onFoundFace = () => {
    setStep("succesful");
  };

  const onError = (e) => {
    setStep("error");
  };

  const renderWaiting = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
      <div className="bg-white p-10 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold cursor-default text-gray-800 mb-10">
          Fichada facial
        </h1>
        <div className="text-6xl cursor-default mb-10">📷</div>
        <button
          className="bg-emerald-500 text-white px-6 py-3 cursor-pointer rounded-md text-lg hover:bg-emerald-600"
          onClick={() => {
            setStep("findingFace");
          }}
        >
          Iniciar captura de rostro
        </button>
      </div>
    </div>
  );

  const renderFaceScan = () => (
    <FaceScan onFoundFace={onFoundFace} onError={onError} type={type} />
  );

  const renderSuccesful = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
      <div className="bg-white p-10 rounded-xl shadow-md">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <img
              src="https://via.placeholder.com/100"
              alt="Foto rostro"
              className="rounded-full w-24 h-24"
            />
            <span className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-1">
              ✅
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-emerald-700">
            ¡Fichada exitosa!
          </h2>
          <p className="text-xl font-medium">{empleado?.nombre}</p>
          <p className="text-gray-600">{empleado?.fechaHora}</p>
          <p className="text-gray-800 font-semibold">{empleado?.tipo}</p>
        </div>

        <div className="mt-6 w-full max-w-sm">
          <h3 className="text-left font-semibold mb-2 text-emerald-700">
            Últimas fichadas
          </h3>
          <div className="bg-emerald-50 rounded-lg shadow p-4 text-left">
            {empleado?.historial.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm text-gray-800 border-b py-1 last:border-b-0"
              >
                <span>{item.fecha}</span>
                <span>{item.tipo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
      <div className="bg-white p-10 rounded-xl shadow-md">
        <div className="text-6xl text-red-500 mb-5">❌</div>
        <h2 className="text-2xl font-bold text-gray-800">
          No se pudo reconocer el rostro
        </h2>
        <p className="text-gray-600 mb-5">
          Asegúrate de estar bien posicionado frente a la cámara.
        </p>
      </div>
    </div>
  );

  // Es un useEffect para el cierre automático
  useEffect(() => {
    if (step === "error") {
      const timer = setTimeout(() => {
        setStep("findingFace");
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (step === "succesful") {
      const timer = setTimeout(() => {
        setStep("waiting");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <>
      {step === "waiting" && renderWaiting()}
      {step === "findingFace" && renderFaceScan()}
      {step === "succesful" && renderSuccesful()}
      {step === "error" && renderError()}
    </>
  );
}
