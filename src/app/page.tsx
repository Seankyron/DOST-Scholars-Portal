// src/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Welcome to the DOST-SEI Scholars Portal</h1>
      <div className="flex gap-4 mt-6">
        <Link href="/login" className="px-4 py-2 text-white bg-blue-600 rounded-md">
          Login
        </Link>
        <Link href="/signup" className="px-4 py-2 bg-gray-200 rounded-md">
          Sign Up
        </Link>
      </div>
    </div>
  );
}