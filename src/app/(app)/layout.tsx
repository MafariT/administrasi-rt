import Navbar from "@/components/Navbar";
import StatusBanner from "@/components/StatusBanner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <StatusBanner />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}