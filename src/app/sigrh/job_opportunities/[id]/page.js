import PostulationsTable from "@/components/postulationsResults/postulationsTable";

export default function VacanciesPage({ params }) {
  const { id } = params;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ml-4 mt-4 text-center">
        Postulaciones de la convocatoria #{id}
      </h1>
      <PostulationsTable jobOpportunityId={id} />
    </div>
  );
}
