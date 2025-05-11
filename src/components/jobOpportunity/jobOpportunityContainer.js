"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Cookies from "js-cookie";
import config from "@/config";
import axios from "axios";
import JobOpportunityFormData from "./jobOpportunityFormData";
import PostulationsTable from "../postulationsResults/postulationsTable";

export default function JobOpportunityContainer({ jobOpportunityId }) {
  const [opportunityData, setOpportunityData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Detalles", "Postulaciones"];

  const token = Cookies.get("token");
  const router = useRouter();

  const fetchOpportunityData = async () => {
    try {
      const res = await axios.get(
        `${config.API_URL}/opportunities/${jobOpportunityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status != 200) throw new Error("Error al traer los empleados");

      setOpportunityData(res.data);
    } catch (e) {
      console.error(e);
      alert("Ocurrió un error al traer los datos del empleado");
    }
  };

  useEffect(() => {
    fetchOpportunityData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-black">
        <IoMdArrowRoundBack
          onClick={() => router.push("/sigrh/job_opportunities")}
          className="cursor-pointer text-black"
        />
        <h1 className="text-2xl font-semibold">
          Convocatoria /{" "}
          {jobOpportunityId == "new" ? "Nuevo" : `# ${jobOpportunityId}`}
        </h1>
      </div>

      <div className="mt-4">
        <div className="flex space-x-4 border-b border-gray-300">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                if (jobOpportunityId == "new" && index != 0) {
                  alert(
                    "Debe cargar y guardar datos personales antes de poder cargar datos secundarios."
                  );
                  return;
                }
                setActiveTab(index);
              }}
              className={`py-2 px-4 text-sm font-semibold rounded-t-md ${
                activeTab === index
                  ? "border-b-2 border-emerald-500 text-emerald-500"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 && (
          <JobOpportunityFormData jobOpportunity={opportunityData} />
        )}

        {activeTab === 1 && (
          <PostulationsTable jobOpportunityId={opportunityData.id} />
        )}
      </div>
    </div>
  );
}
