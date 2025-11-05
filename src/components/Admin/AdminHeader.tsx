interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export default function AdminHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-6 mb-8">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  )
}