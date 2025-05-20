import ClientOnly from "@/Components/ClientOnly";
import AdminContent from "@/components/AdminContent";

export default function AdminPage() {
  return (
    <ClientOnly>
      <AdminContent />
    </ClientOnly>
  );
}