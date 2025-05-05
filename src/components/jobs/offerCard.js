"use client";

import { useState } from "react";

export default function OfferCard({ jobOpportunity, onApply }) {
  const [showFullDescription, setShowFullDescription] = useState(false); // Estado para alternar descripción

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-emerald-600 mb-2">
        {jobOpportunity.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {showFullDescription
          ? jobOpportunity.description
          : jobOpportunity.description.length > 250
          ? jobOpportunity.description.substring(0, 250) + "..."
          : jobOpportunity.description}
        {jobOpportunity.description.length > 250 && (
          <button
            onClick={toggleDescription}
            className="text-emerald-500 font-semibold ml-2 hover:underline"
          >
            {showFullDescription ? "Ver menos" : "Ver más"}
          </button>
        )}
      </p>
      <p className="text-sm text-gray-600 mb-2 mt-2">
        🌍 {jobOpportunity.country}/{jobOpportunity.region}
      </p>
      <p className="text-sm text-gray-600 mb-2 mt-2">
        💻 {jobOpportunity.work_mode}
      </p>
      <button
        onClick={() => onApply(jobOpportunity.title)}
        className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors mt-2"
      >
        Postularme
      </button>
    </div>
  );
}
