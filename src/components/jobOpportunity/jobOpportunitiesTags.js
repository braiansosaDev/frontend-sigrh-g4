import React, { useState } from "react";

export default function JobOpportunitiesTags({ tags, setFormData }) {
  // Etiquetas momentaneas
  const availableTags = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "Java",
    "C#",
    "AWS",
    "Docker",
    "Kubernetes",
  ];

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = [];
      for (const tag of availableTags) {
        //Usé un for para poder controlar el número de sugerencias
        if (
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !tags.includes(tag)
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
        (existingTag) => existingTag.toLowerCase() === tag.toLowerCase()
      )
    ) {
      alert("La etiqueta " + inputValue + " ya existe.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setInputValue(""); //Limpiamos el valor del input
    setSuggestions([]); //Limpiamos las sugerencias
  };

  const handleCreateTag = () => {
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
        (existingTag) => existingTag.toLowerCase() === inputValue.toLowerCase()
      )
    ) {
      alert("La etiqueta " + inputValue + " ya existe.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, inputValue],
    }));

    setInputValue("");
    setSuggestions([]);
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
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
            {tag}
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
                {suggestion}
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
