export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center text-sm">
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white">Ketentuan Media</a>
          <a href="#" className="hover:text-white">Ketentuan Copyright</a>
        </div>
        <div className="hidden sm:block">
          &copy; {new Date().getFullYear()} RT 012 Puri Kemajuan.
        </div>
      </div>
    </footer>
  )
}