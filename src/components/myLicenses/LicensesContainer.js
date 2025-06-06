"use client";

import { useEffect, useState } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import LicenseModal from "./LicenseModal";
import LicensesTable from "./LicensesTable";

export default function LicensesContainer() {
  const [openModal, setOpenModal] = useState(false);

  const steps = [
    {
      content:
        "Bienvenido a la sección de licencias. Aquí puedes gestionar todas tus licencias.",
    },
    {
      selector: ".licenses-table",
      content: "Esta tabla muestra todas las licencias que has solicitado.",
    },
    {
      selector: ".solicitar-licencia-btn",
      content:
        "Si necesitas una nueva licencia, haz clic aquí para solicitarla.",
    },
  ];

  return (
    <TourProvider
      steps={steps}
      styles={{
        maskWrapper: (base) => ({
          ...base,
          backgroundColor: "rgba(16, 185, 129, 0.3)",
        }),
        popover: (base) => ({
          ...base,
          borderRadius: 12,
          background: "#fff",
          color: "#047857",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.15)",
          fontFamily: "inherit",
          padding: "1.5rem",
        }),
        badge: (base) => ({
          ...base,
          background: "#10b981",
          color: "#fff",
        }),
        close: (base) => ({
          ...base,
          color: "#10b981",
        }),
        dot: (base, state) => ({
          ...base,
          background: state.active ? "#10b981" : "#d1fae5",
        }),
        controls: (base) => ({
          ...base,
          marginTop: 16,
        }),
        button: (base, { primary }) => ({
          ...base,
          background: primary ? "#10b981" : "#fff",
          color: primary ? "#fff" : "#10b981",
          border: "1px solid #10b981",
          borderRadius: 8,
          padding: "0.5rem 1.2rem",
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
  const { setIsOpen } = useTour();

  useEffect(() => {
    const alreadySeen = false; //localStorage.getItem("seenLicensesTour");
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
            onClick={() => setIsOpen(true)}
            className="ml-2 flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors"
            title="Ver guía"
            type="button"
          >
            <span className="text-white text-xl font-bold">?</span>
          </button>
        </div>
        <button
          className="solicitar-licencia-btn bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-full shadow cursor-pointer"
          onClick={() => setOpenModal(true)}
        >
          Solicitar licencia
        </button>
      </div>
      <hr className="border-gray-200 mb-6" />
      <div>
        <div className="licenses-table">
          <LicensesTable />
        </div>
        {openModal && (
          <LicenseModal open={openModal} onClose={() => setOpenModal(false)} />
        )}
      </div>
    </div>
  );
}
