"use client";

import { useEffect, useState } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import LicenseModal from "./LicenseModal";
import LicensesTable from "./LicensesTable";

export default function LicensesContainer() {
  const [openModal, setOpenModal] = useState(false);

  const steps = [
    {
      selector: "body",
      content:
        "Bienvenido a la sección de licencias. Aquí puedes gestionar todas tus licencias.",
    },
    {
      selector: ".licenses-table",
      content:
        "Esta tabla muestra todas las licencias que has solicitado junto con sus datos.",
    },
    {
      selector: ".solicitar-licencia-btn",
      content:
        "Si necesitas una nueva licencia, debes clickear en este botón de aquí y se abrirá un modal donde puedas cargar tus datos.",
    },
    {
      selector: ".interrogation-button",
      content:
        "Si necesitas ayuda, puedes hacer click en este botón de interrogación para ver esta guía nuevamente.",
    },
    {
      selector: "body",
      content:
        "¡Eso es todo! Ahora puedes gestionar tus licencias de manera eficiente.",
    },
  ];

  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: 12,
          color: "#047857",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.15)",
          padding: "3rem",
        }),
        badge: (base) => ({
          ...base,
          background: "#10b981",
          color: "#fff",
          fontWeight: "bold",
        }),
        dot: (base) => ({
          ...base,
          background: "#10b981",
          border: "1px solid #047857",
        }),
        close: (base) => ({
          ...base,
          padding: 5,
          width: 20,
          height: 20,
          color: "#047857",
        }),
        controls: (base) => ({
          ...base,
          marginTop: 16,
        }),
        arrow: (base) => ({
          ...base,
          padding: 0,
          margin: 10,
          color: "#047857",
        }),
        button: (base) => ({
          ...base,
          background: "#fff",
          color: "#10b981",
          borderRadius: 10,
          fontWeight: "bold",
          border: "2px solid #10b981",
        }),
      }}
    >
      <InnerLicensesContainer
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </TourProvider>
  );
}

function InnerLicensesContainer({ openModal, setOpenModal }) {
  const { setIsOpen, setCurrentStep, isOpen } = useTour();

  useEffect(() => {
    const alreadySeen = localStorage.getItem("seenLicensesTour");
    if (!alreadySeen) {
      setIsOpen(true);
      localStorage.setItem("seenLicensesTour", "true");
    }
  }, [setIsOpen]);

  return (
    <div className="w-full min-h-screen p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800 cursor-default">
            Mis Licencias 📄
          </h1>
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsOpen(true);
            }}
            className="interrogation-button ml-2 flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors"
            title="Ver guía"
            type="button"
            disabled={isOpen}
          >
            <span className="text-white text-xl font-bold">?</span>
          </button>
        </div>
        <button
          className="solicitar-licencia-btn bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-full shadow cursor-pointer"
          onClick={() => setOpenModal(true)}
          disabled={isOpen}
        >
          Solicitar licencia
        </button>
      </div>
      <hr className="border-gray-200 mb-6" />
      <div>
        <div className="licenses-table">
          <LicensesTable disabled={isOpen} />
        </div>
        {openModal && (
          <LicenseModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            disabled={isOpen}
          />
        )}
      </div>
    </div>
  );
}
