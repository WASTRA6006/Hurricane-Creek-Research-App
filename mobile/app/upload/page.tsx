'use client'; 

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [writtenNotes, setWrittenNotes] = useState('');
  const [gpsAllowed, setGpsAllowed] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
  const router = useRouter();

  const categories = [
    { value: 'plant', label: 'Plant', emoji: '🌱' },
    { value: 'animal', label: 'Animal', emoji: '🦌' },
    { value: 'fungus', label: 'Fungus', emoji: '🍄' },
    { value: 'landscape', label: 'Landscape', emoji: '🏞️' },
    { value: 'other', label: 'Other', emoji: '📷' }
  ];

  //Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      window.location.href = '/login';
      return;
    }
    const user = JSON.parse(userData);
    setUserId(user.id);
  }, []);

  // Fetch zones
  useEffect(() => {
    fetch(`${getApiUrl()}/api/zones`)
      .then(response => response.json())
      .then(data => {
        setZones(data);
      })
      .catch(error => console.error('Error fetching zones:', error));
  }, []);

  // Check if GPS is enabled on mount
  useEffect(() => {
    const gpsEnabled = localStorage.getItem('gpsEnabled');
    setGpsAllowed(gpsEnabled === 'true');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedZone || !selectedCategory || !selectedImageFile) {
      alert('Please fill in all required fields');
      return;
    }

    // Prevent double submission
    if (uploading) return;

    setUploading(true);

    try {
      // Get fresh GPS coordinates RIGHT NOW if enabled
      let finalLatitude = null;
      let finalLongitude = null;

      const gpsEnabled = localStorage.getItem('gpsEnabled');
      if (gpsEnabled === 'true' && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 5000
            });
          });
          
          finalLatitude = position.coords.latitude;
          finalLongitude = position.coords.longitude;
        } catch (gpsError) {
          console.log('GPS capture failed, uploading without location');
          // Continue upload without GPS
        }
      }

      // Convert image to base64
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      const convertedImageFile = await fileToBase64(selectedImageFile);

      const photoData = {
        user_id: userId,
        zone_id: parseInt(selectedZone),
        category: selectedCategory,
        notes: writtenNotes || null,
        gps_allowed: gpsEnabled === 'true',
        latitude: finalLatitude,
        longitude: finalLongitude,
        image_data: convertedImageFile
      };

      const response = await fetch(`${getApiUrl()}/api/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('✅ Photo uploaded successfully! Your observation has been added to the research site.');
      
      // Reset form
      setSelectedZone('');
      setSelectedCategory('');
      setWrittenNotes('');
      setSelectedImageFile(null);
      setUploading(false);
      
    } catch(error) {
      console.error('Error uploading photo:', error);
      alert('❌ Failed to upload photo. Please check your connection and try again.');
      setUploading(false);
    }
  };
  


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">📸 Upload Photo</h1>
          <p className="text-blue-100">Document your field observations</p>
        </div>

        {/* Back Button */}
        <div className="max-w-3xl mx-auto mb-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
              <span className="text-lg">←</span>
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* GPS Timing Warning - Add this RIGHT AFTER the header, BEFORE the upload form */}
        <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-4 mb-6">
          <p className="font-bold text-amber-900 mb-2">📍 Important: GPS Data Timing</p>
          <p className="text-sm text-amber-800">
            Your GPS location is captured when you <strong>upload the photo</strong>, 
            not when you take it. For accurate location data, upload photos after taking them while 
            still at the research site.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photo <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImageFile(file);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {selectedImageFile ? (
                    <div className="space-y-3">
                      <img 
                        src={URL.createObjectURL(selectedImageFile)}
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600">{selectedImageFile.name}</p>
                      <p className="text-xs text-blue-600 hover:text-blue-700">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="text-6xl mb-3">📷</div>
                      <p className="text-gray-600 font-medium mb-1">Click to select photo</p>
                      <p className="text-sm text-gray-500">or drag and drop</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Zone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone/Habitat <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none mb-3"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
              >
                <option value="">Select a zone...</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
              
              {/* View Map Button - Full Width */}
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>🗺️</span>
                <span>View Site Map</span>
              </button>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observation Notes
              </label>
              <textarea
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                value={writtenNotes}
                onChange={(e) => setWrittenNotes(e.target.value)}
                placeholder="Describe what you observed... (optional)"
                rows={4}
              />
            </div>

            {/* GPS Status */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${gpsAllowed ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">GPS Status</p>
                    <p className="text-sm text-gray-600">
                      {gpsAllowed ? `Location: ${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}` : 'Location services disabled'}
                    </p>
                  </div>
                </div>
              </div>
              {!gpsAllowed && (
                <p className="text-xs text-gray-500 mt-2">
                  Enable GPS in your dashboard to include location data
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={uploading}
              className={`w-full px-6 py-4 rounded-xl font-semibold shadow-lg transition-all ${
                uploading 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload to Research Site'
              )}
            </button>
          </form>
        </div>

      </div>
      {/* Map Modal */}
      {showMap && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMap(false)}
        >
          <div 
            className="relative bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Hurricane Creek Site Map</h3>
              <button 
                onClick={() => setShowMap(false)}
                className="text-white hover:text-gray-200 text-3xl font-light"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <img 
                src="/map.png" 
                alt="Hurricane Creek Site Map" 
                className="w-full h-auto"
              />
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Tip:</strong> Use this map to identify which zone you're currently in before selecting from the dropdown above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}