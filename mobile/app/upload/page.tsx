'use client'; 

import { useState, useEffect } from 'react';

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

  //Check if user is logged in, if not redirect to login page
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      window.location.href = '/login';
      return;
    }
    const user = JSON.parse(userData);
    setUserId(user.id);
  }, []);

  // Fetch zones from backend on component mount
  useEffect(() => {
    fetch('http://localhost:3000/api/zones')
      .then(response => response.json())
      .then(data => {
        console.log('Zones fetched:', data);
        setZones(data);
      })
      .catch(error => console.error('Error fetching zones:', error));
  }, []);

  // Attempt to get GPS coordinates on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setGpsAllowed(true);  
          console.log('GPS enabled:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('GPS denied or unavailable:', error.message);
          setGpsAllowed(false);
        }
      );
    } else {
      console.log('Browser does not support geolocation');
      setGpsAllowed(false);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //This will prevent page refresh
    
    if (!selectedZone || !selectedCategory || !selectedImageFile) {
      alert('Missing Required Field(s)');
      return;
    }

    // Function to convert file to base64
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
      gps_allowed: gpsAllowed,
      latitude: latitude,
      longitude: longitude,
      image_data: convertedImageFile
    };

    console.log('Sending to backend:', photoData);

    try{
      const response = await fetch('http://localhost:3000/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoData), //Replace with actual image upload handling later, for now just sending JSON data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Photo uploaded successfully:', result);
      alert('Photo uploaded successfully!');

      //Clear Form
      setSelectedZone('');
      setSelectedCategory('');
      setWrittenNotes('');
      setGpsAllowed(false);
      setLatitude(null);
      setLongitude(null);
      setSelectedImageFile(null);
    }catch(error){
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    }

  };
  
  // Form Display
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Upload Photo</h1>
      
      <p>Zone: {selectedZone}</p>
      <p>Category: {selectedCategory}</p>
      <p>Notes: {writtenNotes}</p>
      <p>GPS: {gpsAllowed ? `${latitude}, ${longitude}` : 'Not enabled'}</p>
      <p>Image file: {selectedImageFile ? selectedImageFile.name : 'None'}</p>
      
      <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Zone:</label>
          <select 
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedZone}
            onChange={(event) => setSelectedZone(event.target.value)}
          >
            <option value="">Select a zone...</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Category:</label>
          <select 
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">Select a category...</option>
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="wildlife">Wildlife</option>
            <option value="macro">Macro</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Image:</label>
          <input
            className="w-full border border-gray-300 p-2 rounded"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedImageFile(file);
              }
            }}
          />
        </div>

        {selectedImageFile && (
          <div className="mt-2">
            <img 
              src={URL.createObjectURL(selectedImageFile)}
              alt="Preview" 
              className="max-w-xs rounded border"
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Notes:</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            value={writtenNotes}
            onChange={(e) => setWrittenNotes(e.target.value)}
            placeholder="Enter any notes about the photo..."
            rows={4}
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={gpsAllowed}
              onChange={(e) => setGpsAllowed(e.target.checked)}
            />
            <span>Include GPS coordinates</span>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Upload Photo
        </button>
      </form>
    </div>
  );
}