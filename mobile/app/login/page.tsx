'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === '' || password === '') {
      alert('Missing Required Field');
      return;
    }

    try {
      const response = await fetch(`${getApiUrl()}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      localStorage.setItem('userData', JSON.stringify(userData));
      router.push('/dashboard');
    } catch (error) {
      console.error("Error logging in user:", error);
      alert('Failed to log in user');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-6">

    {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => router.push('/')}
          className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
            <span className="text-lg">←</span>
          </div>
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Login</h1>
          <p className="text-gray-600">Access your research account</p>
        </div>
        
        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UNG Email
            </label>
            <input
              type="email"
              placeholder="JOSMTH1234@ung.edu"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all mt-6"
          >
            Sign In
          </button>

        </form>

        {/* Footer Links */}
        <div className="mt-6 space-y-3 text-center">
          <button
            type="button"
            onClick={() => setForgotPasswordModal(true)}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Forgot password?
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {forgotPasswordModal && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setForgotPasswordModal(false)}
          >
            <div 
              className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setForgotPasswordModal(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Password</h2>
              <div className="text-gray-600 space-y-3">
                <p>To reset your password:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Contact an administrator via email</li>
                  <li>Request a password reset (use your UNG email as username)</li>
                  <li>Wait for a temporary password (timing depends on admin availability)</li>
                  <li>Log in with the temporary password and change it</li>
                </ol>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}