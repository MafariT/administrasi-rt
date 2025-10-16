export default function HomePageFooter() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-4 text-center">
        <p>&copy; {new Date().getFullYear()} Administrasi RT Online. All Rights Reserved.</p>
      </div>
    </footer>
  );
}