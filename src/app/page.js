import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      {/* Imagen de fondo */}
      <Image
        src="/imagen-oficina.png"
        alt="Fondo Imagen Oficina"
        fill
        className="object-cover object-center z-0"
        priority
      />

      {/* Capa oscura encima */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenido */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
        <h2 className="text-white text-sm uppercase tracking-widest mb-2">ÚNETE A NUESTRO EQUIPO</h2>
        <h1 className="text-white font-bold text-3xl sm:text-5xl leading-tight mb-6">
          La fabulosa adrenalina de <br className="hidden sm:block" /> trabajar con nosotros
        </h1>

        <Link href={'/jobs'}>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mb-8 transition"
        >
          Ver oportunidades
        </button>
        </Link>
       

        {/* Buscador */}
        <div className="flex w-full max-w-md bg-white rounded-lg overflow-hidden shadow-md">
          <input
            type="text"
            className="flex-grow p-3 text-gray-700 focus:outline-none"
            placeholder="Busca tu oportunidad 🔍︎"
          />
        </div>
      </div>
    </div>
  );
}
