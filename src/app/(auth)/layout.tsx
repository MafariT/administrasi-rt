export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-start sm:items-center min-h-screen bg-white p-4 sm:p-6">
      {children}
    </div>
  );
}