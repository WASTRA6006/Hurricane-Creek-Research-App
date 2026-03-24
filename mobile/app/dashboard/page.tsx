'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [name, setName] = useState('');
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  // Load saved GPS preference on mount
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      window.location.href = '/login';
      return;
    }

    const user = JSON.parse(userData);
    setName(user.name);

    // Load GPS preference
    const saved = localStorage.getItem('gpsEnabled');
    if (saved === 'true') {
      setGpsEnabled(true);
    }
  }, []);

  // Request GPS when toggle is turned ON
  useEffect(() => {
    if (gpsEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setGpsStatus(true);
            console.log('GPS enabled:', position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.log('GPS denied:', error.message);
            setGpsStatus(false);
            setGpsEnabled(false); // Turn toggle back off if denied
          }
        );
      } else {
        console.log('Browser does not support geolocation');
        setGpsStatus(false);
      }
    }
    
    // Save preference whenever it changes
    localStorage.setItem('gpsEnabled', gpsEnabled.toString());
  }, [gpsEnabled]);


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome, {name}!</p>
      <p>GPS Status: {gpsStatus ? 'Enabled' : 'Disabled'}</p>
        <div>
          {/*GPS Toggle Button*/}
          <label htmlFor="gps-toggle" className="inline-flex items-center cursor-pointer">
            <input 
              id="gps-toggle"
              type="checkbox" 
              checked={gpsEnabled}
              onChange={(e) => setGpsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">Enable GPS</span>
          </label>
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