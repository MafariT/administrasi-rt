import AdminNavbar from "@/components/Admin/AdminNavbar";
import AdminSidebar from "@/components/Admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto py-10 px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <AdminSidebar />
          <div className="flex-grow">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}