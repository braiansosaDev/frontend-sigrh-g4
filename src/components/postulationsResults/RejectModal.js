"use client";
import React, { useState } from "react";

export default function RejectModal({
  setShowModal,
  setPendingStatus,
  onChange,
  pendingStatus,
  postulation,
}) {
  const [rejectComment, setRejectComment] = useState("");

  const handleSendReject = async () => {
    sendEmail();
    setShowModal(false);
    setRejectComment("");
    setPendingStatus(null);
    onChange();
  };

  const sendEmail = async () => {
    console.log("Enviando email de rechazo...");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md z-10">
        <h2 className="text-lg font-bold mb-2">Motivo de rechazo</h2>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Ingrese el motivo del rechazo..."
          value={rejectComment}
          onChange={(e) => setRejectComment(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => {
              setShowModal(false);
              setRejectComment("");
              setPendingStatus(null);
            }}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
            onClick={handleSendReject}
            disabled={!rejectComment.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
