// src/app/(auth)/layout.tsx
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-auth-gradient">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left Column (Branding) */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 text-white">
          <Image
            src="/dost-logo.png"
            alt="DOST-SEI Logo"
            width={100}
            height={100}
            className="mb-6"
          />
          <h1 className="text-4xl font-bold text-center">
            DOST-SEI CALABARZON
          </h1>
          <p className="text-2xl font-light text-center">
            Scholars Portal
          </p>
        </div>

        {/* Right Column (Form) */}
        <div className="flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Logo for mobile view */}
            <Image
              src="/dost-logo.png"
              alt="DOST-SEI Logo"
              width={70}
              height={70}
              className="mx-auto mb-4 md:hidden"
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}