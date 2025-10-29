export default function AdminOverviewPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
        <p className="mt-2 text-gray-600">Selamat datang di dashboard admin.</p>
      </div>
      <div>
        <p>Pilih menu di samping untuk melanjutkan.</p>
        {/* We will add stats and quick links here later */}
      </div>
    </div>
  )
}