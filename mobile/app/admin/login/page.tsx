'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [adminKey, setAdminKey] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault(); //This will prevent page refresh

    if (adminKey === '') {
      alert('Missing Required Field');
      return;
    }

    localStorage.setItem('adminKey', adminKey );
    router.push('/admin/photos');
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Admin Key:</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
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