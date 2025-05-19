"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "@/config";
import Cookies from "js-cookie";

export default function AttendanceChecksEventsDetailsModal({ open, employeeId, fecha, onClose }) {
  const [fichadas, setFichadas] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    if (!open || !employeeId || !fecha) return;

    const fetchFichadas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${config.API_URL}/clock_events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtradas = res.data.filter(
          (f) =>
            f.employee.id === employeeId &&
            f.event_date.startsWith(fecha)
        );
        setFichadas(filtradas);
      } catch (err) {
        alert("Error al traer las fichadas");
      } finally {
        setLoading(false);
      }
    };

    fetchFichadas();
  }, [open, employeeId, fecha]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Fichadas del día</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Cargando...</p>
        ) : fichadas.length > 0 ? (
          <ul className="space-y-2 max-h-[300px] overflow-y-auto">
            {fichadas.map((f) => (
              <li
                key={f.id}
                className="border p-2 rounded text-sm flex justify-between"
              >
                <span>{new Date(f.event_date).toLocaleTimeString("es-AR")}</span>
                <span
                  className={
                    f.event_type === "in"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {f.event_type === "in" ? "Entrada" : "Salida"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Sin fichadas encontradas</p>
        )}
      </div>
    </div>
  );
}
