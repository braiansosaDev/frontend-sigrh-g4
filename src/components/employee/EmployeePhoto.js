// components/PhotoUploader.jsx
"use client";

import { useRef } from "react";

export default function EmployeePhoto({ photoBase64, onPhotoChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result);  // result es base64
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {photoBase64 ? (
        <img
          src={photoBase64}
          alt="Foto actual"
          className="w-40 h-40 object-cover rounded-md border border-gray-300"
        />
      ) : (
        <div className="w-40 h-40 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md border border-gray-300">
          Sin foto
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="mt-2 px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600"
      >
        Cambiar foto
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
