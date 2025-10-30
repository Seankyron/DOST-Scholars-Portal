import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail } from 'lucide-react';

export default function SignupSuccessPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Account Created Successfully!
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <Mail className="h-12 w-12 text-dost-blue mx-auto mb-3" />
          <p className="text-gray-700 mb-2">
            Your account is pending verification by the DOST-SEI admin.
          </p>
          <p className="text-gray-600 text-sm">
            You will receive an email notification once your account has been verified.
            This process usually takes 1-3 business days.
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-600 mb-8">
          <p>✅ Account information submitted</p>
          <p>✅ Verification email sent</p>
          <p>⏳ Waiting for admin approval</p>
        </div>

        <Link href="/login">
          <Button variant="primary" size="lg" className="w-full">
            Go to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}