'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const adminKey = localStorage.getItem('adminKey');
    
    if (adminKey) {
      // Admin logged in → go to admin photos
      window.location.href = '/admin/photos';
    } else if (userData) {
      // User logged in → go to dashboard
      window.location.href = '/dashboard';
    } else {
      // Not logged in → go to login
      window.location.href = '/login';
    }
  }, []);

  return <div>Redirecting...</div>;
}