import SIGRHLayout from "@/components/SIGRHLayout/SIGRHLayout";

export const metadata = {
  title: "SIGRH+",
  description: "Aplicación de recursos humanos con IA",
};

export default function Layout({ children }) {
  return <SIGRHLayout>{children}</SIGRHLayout>;
}
