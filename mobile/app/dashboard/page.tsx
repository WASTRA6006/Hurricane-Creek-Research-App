'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [memberSince, setMemberSince] = useState('');
  const router = useRouter();
  
  // Load saved GPS preference on mount
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      window.location.href = '/login';
      return;
    }

    const user = JSON.parse(userData);
    setName(user.name);
    setEmail(user.email);
    
    // Format join date if available
    if (user.created_at) {
      const date = new Date(user.created_at);
      setMemberSince(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    }

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
            setGpsEnabled(false);
          }
        );
      } else {
        console.log('Browser does not support geolocation');
        setGpsStatus(false);
      }
    }
    
    localStorage.setItem('gpsEnabled', gpsEnabled.toString());
  }, [gpsEnabled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 p-6">
      
      {/* Header with Gradient */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {name}!</h1>
          <div className="flex items-center gap-4 text-blue-100 text-sm">
            <span>{email}</span>
            {memberSince && (
              <>
                <span>•</span>
                <span>Member since {memberSince}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        
        {/* GPS Status Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-white">
            <h2 className="text-xl font-bold">📍 Location Services</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* GPS Toggle */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
              <div>
                <p className="font-medium text-gray-900">GPS Tracking</p>
                <p className="text-sm text-gray-600">Required for photo geotagging</p>
              </div>
              <label htmlFor="gps-toggle" className="cursor-pointer">
                <input 
                  id="gps-toggle"
                  type="checkbox" 
                  checked={gpsEnabled}
                  onChange={(e) => setGpsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            {/* GPS Status */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Current Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${gpsEnabled && gpsStatus ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <p className="font-medium text-gray-900">
                  {gpsEnabled ? (gpsStatus ? 'GPS Active' : 'Acquiring Location...') : 'GPS Inactive'}
                </p>
              </div>
              {gpsEnabled && gpsStatus && latitude && longitude && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Current Location:</p>
                  <p className="text-sm font-mono text-gray-700">
                    {latitude.toFixed(6)}° N
                  </p>
                  <p className="text-sm font-mono text-gray-700">
                    {longitude.toFixed(6)}° W
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
            <h2 className="text-xl font-bold">⚡ Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <button 
            onClick={() => router.push('/upload')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
          >
            <span>📸 Upload Photo</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button 
            onClick={() => router.push('/my-uploads')}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
          >
            <span>🖼️ My Uploads</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button 
            onClick={() => {
              localStorage.removeItem('userData');
              localStorage.removeItem('gpsEnabled');
              router.push('/');
            }}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
          >
            <span>🚪 Logout</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          </div>
        </div>

        {/* Help & Tips Card - Full Width */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
            <h2 className="text-xl font-bold">💡 Tips & Reminders</h2>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <p className="font-medium text-gray-900 mb-1">📍 Enable GPS</p>
              <p className="text-sm text-gray-600">Turn on location services before uploading to geotag your photos</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <p className="font-medium text-gray-900 mb-1">📝 Add Notes</p>
              <p className="text-sm text-gray-600">Include detailed observations with your photos for better research data</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
              <p className="font-medium text-gray-900 mb-1">🏷️ Select Category</p>
              <p className="text-sm text-gray-600">Choose the appropriate category to help organize research findings</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <p className="font-medium text-gray-900 mb-1">📱 Use in Field</p>
              <p className="text-sm text-gray-600">Add this app to your home screen for quick access during field work</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}