import SIGRHLayout from "@/components/SIGRHLayout/SIGRHLayout";
import { UserProvider } from "@/contexts/userContext";

export const metadata = {
  title: "SIGRH+",
  description: "Aplicación de recursos humanos con IA",
};

export default function Layout({ children }) {
  return (
    <UserProvider>
      <SIGRHLayout>{children}</SIGRHLayout>
    </UserProvider>
  );
}
