import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <div className="h-20 px-4 flex justify-between items-center bg-cyan-700">
      <Image
        src="/logo-ungs.svg"
        alt="Logo"
        width={200}
        height={200}
        className="h-auto"
      />

      <div className="flex gap-2">
        <Link
          href="/pages/ofertas-admin"
          className="font-bold text-xl text-white hover:underline"
        >
          Admin RRHH
        </Link>

        <Link href="/" className="font-bold text-xl text-white hover:underline">
          Inicio
        </Link>
      </div>
    </div>
  );
}
