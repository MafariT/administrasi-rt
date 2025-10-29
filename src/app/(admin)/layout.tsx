import AdminSidebar from "@/components/AdminSidebar";
import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar />
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}