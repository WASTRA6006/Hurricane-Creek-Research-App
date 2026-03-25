'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

export default function AdminLoginPage() {
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

      if (response.ok) {
        try { 
          const adminCheckResponse = await fetch(`${getApiUrl()}/api/users/adminCheck?email=${encodeURIComponent(email)}`);
          if (!adminCheckResponse.ok) {
            alert('User is not an admin.');
            return;
          }
          const adminData = await response.json();
          localStorage.setItem('adminData', JSON.stringify(adminData));
          router.push('/admin/photos');
        } catch (error) {
          console.error("Error checking admin status:", error);
          alert('Failed to check admin status');
          return;
        }
      }
    } catch (error) {
      console.error("Error logging in admin:", error);
      alert('Failed to log in admin');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👨‍🏫</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Login</h1>
          <p className="text-gray-600">Admin access portal</p>
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
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
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
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white p-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all mt-6"
          >
            Admin Sign In
          </button>

        </form>

        {/* Footer Links */}
        <div className="mt-6 space-y-3 text-center">
          <button
            type="button"
            onClick={() => setForgotPasswordModal(true)}
            className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Forgot password?
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
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
                <p>To reset your admin password:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Contact another administrator via email</li>
                  <li>Request a password reset (use your UNG email as username)</li>
                  <li>Wait for a temporary password</li>
                  <li>Log in with temporary password and update it</li>
                </ol>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}