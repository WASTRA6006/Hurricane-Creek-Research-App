'use client';

import { useState, useEffect } from 'react';

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  
  //Fetch photos from backend API, redirect to login if not logged in or invalid key, set photos state if successful
  const fetchPhotos = async () => {
      const adminKey = localStorage.getItem('adminKey');

      if (!adminKey) {
        console.log('Not logged in, redirecting to login page');
        window.location.href = '/admin/login';
        return;
      }
      
      console.log('Logged in with key:', adminKey);

      try {
        const response = await fetch('http://localhost:3000/api/photos', {
          headers: {
            'x-admin-key': adminKey
          }
        });

        if (response.status === 403) {
          // Invalid admin key
          localStorage.removeItem('adminKey');
          window.location.href = '/admin/login';
          return;
        }

        const data = await response.json();
        setPhotos(data);

      } catch (error) {
        console.error('Error fetching photos:', error);
      }


    };


  //Handle status change for photos, send PATCH request to backend API, refresh photos after successful update
  const handleStatusChange = async (photoId: number, newStatus: string) => {
    const adminKey = localStorage.getItem('adminKey');
    
    if (!adminKey) {
      alert('Not logged in');
      window.location.href = '/admin/login';
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/admin/photos/${photoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        //refresh photos after status change
        fetchPhotos();
      }
    
    } catch (error) {
      console.error('Error updating photo status:', error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin - Photo Review</h1>
        
      <p className="text-gray-600">Photos will be listed here.</p>
        
      <p>Found {photos.length} photos</p>

      <div>
        {photos.map((photo) => (
          <div key={photo.id} className="border p-4 mb-4 rounded">
            <p><strong>Category:</strong> {photo.category}</p>
            <p><strong>Status:</strong> {photo.status}</p>
            <p><strong>Notes:</strong> {photo.notes || 'None'}</p>

            {/* Buttons for status */}
            <div className="mt-4 space-x-2">
              {/* Hide Button */}
              <button 
              onClick={() => handleStatusChange(photo.id, 'hidden')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Hide
              </button>
              {/* Flag Button */}
              <button 
              onClick={() => handleStatusChange(photo.id, 'flagged')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Flag
              </button>
              {/* Activate Button */}
              <button 
              onClick={() => handleStatusChange(photo.id, 'active')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Activate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
