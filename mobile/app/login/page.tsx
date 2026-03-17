'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); //This will prevent page refresh

    if (email === '' || password === '') {
      alert('Missing Required Field');
      return;
    }

    try{
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

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
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Login</h1>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Email</label>
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
      </form>
    </div>
  );
}