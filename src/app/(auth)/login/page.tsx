'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Check user role and redirect accordingly
      const { data: scholarData } = await supabase
        .from('scholars')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (scholarData) {
        router.push('/scholar/dashboard');
      } else {
        // Check if admin
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('email', formData.email)
          .single();

        if (adminData) {
          router.push('/admin/dashboard');
        } else {
          setErrorMessage('Account not found. Please contact support.');
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">SIGN IN</h2>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email / Scholar ID"
          type="text"
          placeholder="Enter your email or scholar ID"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
          />
          <Link
            href="/forgot-password"
            className="text-sm text-dost-blue hover:underline"
          >
            Forgot Password
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          SIGN IN
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-dost-blue font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
