"use client";

import ClientOnly from "@/components/ClientOnly";
import AdminContent from "@/components/AdminContent";

export default function AdminPage() {
  return (
    <ClientOnly>
      <AdminContent />
    </ClientOnly>
  );
}
