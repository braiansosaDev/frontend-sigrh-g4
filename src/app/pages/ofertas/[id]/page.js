import OfertaDetail from "@/app/components/OfertaDetalle";

export default async function DetalleOfertaPage({params}) {
  const {id} = await params;

  return (
    <div className="min-h-screen bg-white p-10">
      <OfertaDetail id={id} />
    </div>
  );
}
