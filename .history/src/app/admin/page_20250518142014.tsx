import ClientOnly from "@/Components/ClientOnly";
import AdminContent from "@/Components/AdminContent";

export default function AdminPage() {
  return (
    <ClientOnly>
      <AdminContentdminContent />
    </ClientOnly>
  );
}