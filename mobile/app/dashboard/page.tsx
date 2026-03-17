'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [name, setName] = useState('');
  const [gpsStatus, setGpsStatus] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  //Check if user is logged in, if not redirect to login page
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      window.location.href = '/login';
    }

    //Get user name from local storage
    const user = JSON.parse(userData!);
    setName(user.name);

    //Check if GPS is enabled and get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsStatus(true);
      }, (error) => {
        console.error("Error getting location:", error);
        setGpsStatus(false);
      });
    }

  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome, {name}!</p>
      <p>GPS Status: {gpsStatus ? 'Enabled' : 'Disabled'}</p>
        <div>
          {/* Upload Photo Button */}
          <button type="button" className="w-full bg-blue-500 text-white px-4 py-3 rounded font-medium" onClick={() => window.location.href = '/upload'}>
            Upload Photo
          </button>
          {/* My Uploads Link */}
          <button type="button" className="w-full bg-gray-500 text-white px-4 py-2 rounded" onClick={() => window.location.href = '/placeholder'}>
            My Uploads
          </button>
          {/* Logout Button */}
          <button type="button" className="w-full bg-red-500 text-white px-4 py-2 rounded" onClick={() => {
            localStorage.removeItem('userData');
            window.location.href = '/login';
          }}>
            Logout
          </button>
        </div>
    </div>
  );
}