import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-4xl font-bold text-dost-blue">DOST-SEI CALABARZON</div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Scholars Portal</h1>
        </div>

        {/* Auth Content */}
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
