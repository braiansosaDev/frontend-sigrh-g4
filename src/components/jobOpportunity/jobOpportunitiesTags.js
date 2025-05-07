import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "@/config";

export default function JobOpportunitiesTags({ tags, setFormData }) {
  const [availableTags, setAvailableTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const token = Cookies.get("token");

  const fetchAvailableTags = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/abilities/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status != 200) throw new Error("Error al traer las habilidades");

      setAvailableTags(res.data);
    } catch (e) {
      alert("No se pudieron obtener las habilidades");
    }
  };

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const create_ability = async (ability) => {
    try {
      const res = await axios.post(
        `${config.API_URL}/abilities/create`,
        { name: ability, description: "" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status !== 201) throw new Error("Error al crear la habilidad");

      return res.data; // Devuelve el objeto creado
    } catch (e) {
      alert("No se pudo crear la habilidad");
      return null; // Devuelve null en caso de error
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = [];
      for (const tag of availableTags) {
        if (
          tag.name.toLowerCase().includes(value.toLowerCase()) &&
          !tags.some(
            (existingTag) =>
              existingTag.name.toLowerCase() === tag.name.toLowerCase()
          )
        ) {
          filteredSuggestions.push(tag);
        }
        if (filteredSuggestions.length === 2) {
          break; // A las 2 sugerencias, sale del bucle
        }
      }
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddTag = (tag) => {
    if (tags.length >= 15) {
      alert("No puedes agregar más de 15 etiquetas.");
      return;
    }
    if (
      tags.some(
        (existingTag) =>
          existingTag.name.toLowerCase() === tag.name.toLowerCase()
      )
    ) {
      alert("La etiqueta ya existe.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      job_opportunity_abilities: [...prev.job_opportunity_abilities, tag],
    }));

    setInputValue(""); // Limpiar el valor del input
    setSuggestions([]); // Limpiar las sugerencias
  };

  const handleCreateTag = async () => {
    if (tags.length >= 15) {
      alert("No puedes agregar más de 15 etiquetas.");
      return;
    }
    if (inputValue.length >= 50) {
      alert("La etiqueta no puede tener más de 50 caracteres.");
      return;
    }
    if (
      tags.some(
        (existingTag) =>
          existingTag.name.toLowerCase() === inputValue.toLowerCase()
      )
    ) {
      alert("La etiqueta " + inputValue + " ya existe.");
      return;
    }

    const newTag = await create_ability(inputValue); // Espera el objeto creado
    if (newTag) {
      setFormData((prev) => ({
        ...prev,
        job_opportunity_abilities: [
          ...prev.job_opportunity_abilities,
          { id: newTag.id, name: newTag.name, description: newTag.description },
        ],
      }));
    }

    setInputValue("");
    setSuggestions([]);
  };
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      job_opportunity_abilities: prev.job_opportunity_abilities.filter(
        (tag) => tag.id !== tagToRemove.id
      ),
    }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
        📋 Habilidades requeridas (Etiquetas)
      </label>
      <div className="mt-1 flex gap-2 overflow-x-auto whitespace-nowrap p-3 border border-gray-300 rounded-md">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="relative mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Escribe para buscar o crear una etiqueta"
          className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto w-full">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleAddTag(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-emerald-100"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
        {inputValue && suggestions.length === 0 && (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full">
            <button
              onClick={handleCreateTag}
              className="w-full px-4 py-2 text-left cursor-pointer hover:bg-emerald-100"
            >
              Crear etiqueta: <strong>{inputValue}</strong>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
