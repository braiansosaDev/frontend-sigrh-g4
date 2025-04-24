import axios from "axios";
import { useState } from "react";

export default function AplicarOfertaForm({ jobDetails }) {
  const [formData, setFormData] = useState({
    nombre: "",
    anios_experiencia: "",
    nivel_educativo: "",
    habilidades: "",
    idiomas: "",
    expectativa_salarial: "",
    email: "",
  });  
  const [applied, setApplied] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/candidatos",
        formData
      );

      if (response.status == 201) {
        alert(`Postulación enviada para ${jobDetails?.title}`);
        setApplied(true);
      }
    } catch (e) {
      alert("Ocurrio un error al postularse: ", e.message);
    }
  };

  return (
    <div>
      {applied ? (
        <div className="max-w-lg mx-auto p-6 border border-cyan-800 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-cyan-700">
            Gracias por tu postulación
          </h2>
          <p className="text-gray-600">
            Revisaremos tu información y nos pondremos en contacto contigo.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-cyan-700">
            Postularse - {jobDetails.title}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="text-black">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />

            <label className="text-black">Años de experiencia</label>
            <input
              type="number"
              name="anios_experiencia"
              placeholder="Años de experiencia"
              value={formData.anios_experiencia}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />

            <label className="text-black">
              Nivel educativo máximo alcanzado
            </label>
            <select
              name="nivel_educativo"
              value={formData.nivel_educativo || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>
                Seleccione
              </option>
              <option value="secundario">Secundario</option>
              <option value="universitario">Universitario</option>
              <option value="terciario">Terciario</option>
            </select>

            <label className="text-black">Habilidades</label>
            <input
              type="text"
              name="habilidades"
              placeholder="Habilidades separadas por comas"
              value={formData.habilidades}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />

            <label className="text-black">Idiomas</label>
            <input
              type="text"
              name="idiomas"
              placeholder="idiomas separadas por comas"
              value={formData.idiomas}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />

            <label className="text-black">Expectativa salarial</label>
            <input
              type="number"
              name="expectativa_salarial"
              placeholder="Expectativa salarial"
              value={formData.expectativa_salarial}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />

            <label className="text-black">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Tu Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition"
            >
              Enviar Postulación
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg mt-2"
            >
              Volver
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
