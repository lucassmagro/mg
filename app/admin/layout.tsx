import type { Metadata } from "next";
import AdminTopbar from "@/components/admin/AdminTopbar";

export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-50">
      <AdminTopbar />
      {children}
    </div>
  );
}
