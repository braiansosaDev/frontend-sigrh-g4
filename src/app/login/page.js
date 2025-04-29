"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import config from "@/config";

export default function LoginPage() {
  const router = useRouter();
  const [legajo, setLegajo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${config.API_URL}/employees/login`,
        {username: legajo, password}
      )

      if (res.status != 200) throw new Error("Login fallido");

      const data = await res.data;
      Cookies.set("token", data.access_token, { expires: 1 });
      router.push("/sigrh");
    } catch (error) {
      console.error(error);
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Imagen: solo visible en escritorio */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-[url('/pattern-sigrh.svg')] bg-cover bg-center" />
      </div>

      {/* Formulario: visible siempre */}
      <div
        className="flex flex-1 items-center justify-center p-8
  bg-[url('/pattern-sigrh.svg')] bg-cover bg-center md:bg-none"
      >
        <div className="w-full max-w-4xl bg-white p-8 rounded-2xl">
          <h2 className="mb-6 text-center text-5xl font-bold text-gray-800">
            SIGRH+
          </h2>
          <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">
            Iniciar sesión
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legajo
              </label>
              <input
                type="number"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
                placeholder="Ingrese su legajo"
                className="w-full rounded-full border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="w-full rounded-full border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-500 p-3 text-white hover:bg-emerald-600 transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
