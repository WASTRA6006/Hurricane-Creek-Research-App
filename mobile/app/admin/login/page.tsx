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
      e.preventDefault(); //This will prevent page refresh

    if (email === '' || password === '') {
      alert('Missing Required Field');
      return;
    }

    try{
      const response = await fetch(`${getApiUrl()}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

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
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">UNG Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded font-medium"
        >
          Login
        </button>

        <button
        type="button"
        className="w-full bg-blue-600 text-white p-2 rounded font-medium"
        onClick={() => router.push('/register')}
        >
          Register
        </button>

        <button
        type="button"
        className="text-sm text-blue-600 hover:underline cursor-pointer"
        onClick={() => setForgotPasswordModal(true)}
        >
          Forgot Password?
        </button>
        {forgotPasswordModal && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setForgotPasswordModal(false)}
          >
            <div 
              className="relative bg-white rounded-xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setForgotPasswordModal(false)} 
                className="absolute top-4 right-4 text-2xl text-slate-700 hover:text-slate-900"
              >
                ✕
              </button>
              
              <h2 className="text-xl font-bold mb-4">So, you forgot your password?</h2>
              <p className="text-slate-700">
                Here are the steps to reset your password:
                <ol className="list-decimal list-inside mt-2">
                  <li>Email another administrator to request a password reset. Your username should be the same as your UNG email.</li>
                  <li>The administrator will then send you a temporary password. Time periods for this process depend entirely on administrator availability.</li>
                  <li>Use the temporary password to log in and change your password.</li>
                </ol>
              </p>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}