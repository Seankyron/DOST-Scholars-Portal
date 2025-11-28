'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { GlobalLoader } from '@/components/shared/GlobalLoader';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    identifier: '', // This can be email or Scholar ID
    password: '',
    rememberMe: false,
  });

  const [errorMessage, setErrorMessage] = useState(searchParams.get('message') || '');
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true); // Show splash screen

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // SUCCESS: Redirect
      if (result.redirectTo) {
        window.location.href = result.redirectTo;
      } else {
        throw new Error('An unexpected error occurred.');
      }

    } catch (error: any) {
      setErrorMessage(error.message || 'An unknown error occurred.');
      setIsLoading(false); 
    } 
  };

  return (
    <>
    <GlobalLoader isLoading={isLoading} message="Authenticating" />
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-dost-title mb-2">Sign In</h2>
      </div>

      {errorMessage && (
        <div className={`mb-6 p-4 rounded-lg ${errorMessage.includes('Email verified') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${errorMessage.includes('Email verified') ? 'text-green-700' : 'text-red-600'}`}>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email / Scholar ID"
          type="text"
          placeholder="Enter your email or scholar ID"
          value={formData.identifier}
          onChange={(e) =>
            setFormData({ ...formData, identifier: e.target.value })
          }
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData({ ...formData, rememberMe: e.target.checked })
            }
          />
          <Link
            href="/forgot-password"
            className="text-sm text-dost-title hover:underline"
          >
            Forgot Password
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
        >
          SIGN IN
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-dost-title font-medium hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}