'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['active', 'flagged']);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [zones, setZones] = useState<any[]>([]);
  const [zoneExpanded, setZoneExpanded] = useState<boolean>(true);
  const [categoryExpanded, setCategoryExpanded] = useState<boolean>(true);
  const [statusExpanded, setStatusExpanded] = useState<boolean>(true);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);
  const [activeSearch, setActiveSearch] = useState('');
  const router = useRouter();
  
  //Fetch photos from backend API, redirect to login if not logged in or invalid key, set photos state if successful
  const fetchPhotos = async () => {
      const adminData = localStorage.getItem('adminData');
      if (!adminData) {
        window.location.href = '/admin/login';
        return;
      }
      const admin = JSON.parse(adminData);
      const adminEmail = admin.email;

      try {
        setLoading(true);
        const response = await fetch(`${getApiUrl()}/api/photos`, {
          headers: {
            'x-admin-email': adminEmail
          }
        });

        if (response.status === 403) {
          // Invalid admin key
          localStorage.removeItem('adminData');
          window.location.href = '/admin/login';
          return;
        }

        const data = await response.json();
        setLoading(false);
        setPhotos(data);
        const defaultFiltered = data.filter((photo: any) => 
          photo.status === 'active' || photo.status === 'flagged'
        );
        setFilteredPhotos(defaultFiltered);
        return data;
      } catch (error) {
        console.error('Error fetching photos:', error);
        setLoading(false);
        setPhotos([]); 
      }


    };


  //Handle status change for photos, send PATCH request to backend API, refresh photos after successful update
  const handleStatusChange = async (photoId: number, newStatus: string) => {
    const adminData = localStorage.getItem('adminData');
    if (!adminData) {
      window.location.href = '/admin/login';
      return;
    }
    const admin = JSON.parse(adminData);
    const adminEmail = admin.email;

    try {
      const response = await fetch(`${getApiUrl()}/api/admin/photos/${photoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const freshPhotos = await fetchPhotos();
        
        if (!freshPhotos) return;
        
        // Apply filters to fresh data
        let filtered = freshPhotos;
        
        if (activeSearch) {
          filtered = filtered.filter((photo: any) => 
            (photo.uploader_name && photo.uploader_name.toLowerCase().includes(activeSearch.toLowerCase())) ||
            (photo.notes && photo.notes.toLowerCase().includes(activeSearch.toLowerCase()))
          );
        }
        
        if (selectedZones.length > 0) {
          filtered = filtered.filter((photo: any) => selectedZones.includes(photo.zone_id));
        }
        if (selectedCategories.length > 0) {
          filtered = filtered.filter((photo: any) => selectedCategories.includes(photo.category));
        }
        if (selectedStatuses.length > 0) {
          filtered = filtered.filter((photo: any) => selectedStatuses.includes(photo.status));
        }
        
        setFilteredPhotos(filtered);
      }
    
    } catch (error) {
      console.error('Error updating photo status:', error);
    }
  };

  const handlePrevious = () => {
    // Implement logic to fetch previous photo
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    }
    if (currentIndex === 0) {
      setSelectedPhoto(photos[photos.length - 1]);
    }
  }

  const handleNext = () => {
    // Implement logic to fetch next photo
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto.id);
    if (currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
    }
    if (currentIndex === photos.length - 1) {
      setSelectedPhoto(photos[0]);
    }
  }

  const handleApplyFilters = () => {
    let filtered = photos;
    
    if (activeSearch) {
      filtered = filtered.filter(photo => 
        (photo.uploader_name && photo.uploader_name.toLowerCase().includes(activeSearch.toLowerCase())) ||
        (photo.notes && photo.notes.toLowerCase().includes(activeSearch.toLowerCase()))
      );
    }

    if (selectedZones.length > 0) {
      filtered = filtered.filter(photo => selectedZones.includes(photo.zone_id));
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(photo => selectedCategories.includes(photo.category));
    }
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(photo => selectedStatuses.includes(photo.status));
    }
    
    setFilteredPhotos(filtered);
  };

const handleClearFilters = () => {
  setSelectedZones([]);
  setSelectedCategories([]);
  setSelectedStatuses(['active', 'flagged']);
  
  let filtered = photos;
  
  if (activeSearch) {
    filtered = filtered.filter(photo => 
      (photo.uploader_name && photo.uploader_name.toLowerCase().includes(activeSearch.toLowerCase())) ||
      (photo.notes && photo.notes.toLowerCase().includes(activeSearch.toLowerCase()))
    );
  }
  
  filtered = filtered.filter((photo: any) => 
    photo.status === 'active' || photo.status === 'flagged'
  );
  
  setFilteredPhotos(filtered);
};

const handleSearch = () => {
  setActiveSearch(searchText);
  
  let filtered = photos;
  
  if (searchText) {
    filtered = filtered.filter(photo => 
      (photo.uploader_name && photo.uploader_name.toLowerCase().includes(searchText.toLowerCase())) ||
      (photo.notes && photo.notes.toLowerCase().includes(searchText.toLowerCase()))
    );
  }

  if (selectedStatuses.length > 0) {
    filtered = filtered.filter(photo => selectedStatuses.includes(photo.status));
  }
  
  setFilteredPhotos(filtered);
};

  const SkeletonCard = () => (
  <div className="border-2 border-slate-300 rounded-lg overflow-hidden animate-pulse">
    {/* Image placeholder */}
    <div className="w-full aspect-[4/3] bg-slate-300"></div>
    
    {/* Divider */}
    <div className="h-1 bg-slate-200"></div>
    
    {/* Content placeholder */}
    <div className="p-4 space-y-3 bg-white">
      <div className="h-4 bg-slate-200 rounded"></div>
      <div className="h-4 bg-slate-200 rounded"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    </div>
    
    {/* Button placeholders */}
    <div className="p-3 flex gap-2 bg-slate-50">
      <div className="flex-1 h-8 bg-slate-200 rounded"></div>
      <div className="flex-1 h-8 bg-slate-200 rounded"></div>
      <div className="flex-1 h-8 bg-slate-200 rounded"></div>
    </div>
  </div>
  );

  //Redirect user if not logged in
  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (!adminData) {
      window.location.href = '/admin/login';
      return;
    }
    
    // If logged in, fetch photos
    fetchPhotos();
  }, []);

  // Fetch zones from backend on component mount
  useEffect(() => {
    fetch(`${getApiUrl()}/api/zones`)
      .then(response => response.json())
      .then(data => {
        console.log('Zones fetched:', data);
        setZones(data);
      })
      .catch(error => console.error('Error fetching zones:', error));
  }, []);
  
  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
  if (selectedPhoto) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  }, [selectedPhoto]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  return (
    // Page background - subtle gradient (less white)
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 p-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">📸 Photo Gallery</h1>
          <p className="text-emerald-100">Review and manage submitted research photos</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <button 
          onClick={() => router.push('/')}
          className="group flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
            <span className="text-lg">←</span>
          </div>
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      {/* Main content container*/}
      <div className="border-2 border-gray-200 rounded-xl p-6 bg-white shadow-lg">
        {/*Search and Filter*/}
        <div className="relative mb-6 bg-white border-2 border-slate-300 rounded-xl p-6 shadow-sm flex items-center gap-2">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="bg-neutral text-white px-3 py-2 rounded-md text-[17px] font-medium hover:bg-neutral-dark transition-colors shadow-sm flex items-center gap-1 justify-center">
            ☰ Filters {filtersOpen ? '▲' : '▼'}
          </button>
          {filtersOpen && (
            <div className="absolute top-full left-0 mt-2 text-white bg-neutral border-2 border-slate-100 rounded-lg shadow-2xl z-50 p-6 w-96">
              {/* Zone Filters */}
              <div className="mb-4">
                <div 
                onClick={() => setZoneExpanded(!zoneExpanded)}
                className="flex justify-between items-center cursor-pointer hover:bg-slate-400 p-2 rounded">
                <h3 className="font-semibold text-white">Zone</h3>
                <span>{zoneExpanded ? '▲' : '▼'}</span>
                </div>
              
                {/* Checkboxes */}
                {zoneExpanded && (
                  <div className="mt-2 space-y-2">
                    {zones.map((zone) => (
                      <label key={zone.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedZones.includes(zone.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedZones([...selectedZones, zone.id]);
                            } else {
                              setSelectedZones(selectedZones.filter(id => id !== zone.id));
                            }
                          }}
                          className="..."
                        />
                        <span>{zone.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filters */}
              <div className="mb-4">
                <div 
                onClick={() => setCategoryExpanded(!categoryExpanded)}
                className="flex justify-between items-center cursor-pointer hover:bg-slate-400 p-2 rounded">
                <h3 className="font-semibold text-white">Category</h3>
                <span>{categoryExpanded ? '▲' : '▼'}</span>
                </div>
              
                {/* Checkboxes */}
                {categoryExpanded && (
                  <div className="mt-2 space-y-2">
                    {[
                      { value: 'plant', label: '🌱 Plant' },
                      { value: 'animal', label: '🦌 Animal' },
                      { value: 'fungus', label: '🍄 Fungus' },
                      { value: 'landscape', label: '🏞️ Landscape' },
                      { value: 'other', label: '📷 Other' }
                    ].map((category) => (
                      <label key={category.value} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedCategories.includes(category.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category.value]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(cat => cat !== category.value));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span>{category.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filters */}
              <div className="mb-4">
                <div 
                onClick={() => setStatusExpanded(!statusExpanded)}
                className="flex justify-between items-center cursor-pointer hover:bg-slate-400 p-2 rounded">
                <h3 className="font-semibold text-white">Status</h3>
                <span>{statusExpanded ? '▲' : '▼'}</span>
                </div>
              
                {/* Checkboxes */}
                {statusExpanded && (
                  <div className="mt-2 space-y-2">
                    {['active', 'hidden', 'flagged'].map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStatuses([...selectedStatuses, status]);
                            } else {
                              setSelectedStatuses(selectedStatuses.filter(st => st !== status));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-300">
                <button 
                  onClick={handleApplyFilters}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={handleClearFilters}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by uploader..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full border-2 border-gray-200 rounded-xl p-3 pr-12 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none text-sm md:text-base"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
              🔎
            </div>
          </div>
        </div>

        {/*Gallery*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            // Show 25 skeleton cards
            Array.from({ length: 25 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
          filteredPhotos.map((photo) => (
            
            // Photo card
            <div 
              key={photo.id} 
              className={`border-2 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-slate-50 to-white opacity-0 animate-fadeIn ${
                photo.status === 'flagged' 
                  ? 'border-amber-500 hover:border-amber-600' 
                  : 'border-slate-300 hover:border-primary/50'
              }`}
            >
              {/* Image container - maintains 4:3 aspect ratio */}
              <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer relative" onClick={() => setSelectedPhoto(photo)}>
                <img 
                  src={photo.image_url} 
                  alt={photo.category}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {photo.status === 'flagged' && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md">
                    FLAGGED
                  </div>
                )}
              </div>
              
              {/* Divider - using config colors */}
              <div className="h-1 bg-gradient-to-r from-slate-200 via-primary-light/30 to-slate-200"></div>
              
              {/* Info section - all text same size */}
              <div className="p-4 space-y-2.5 bg-white">
                <p className="text-base">
                  <strong className="text-slate-700 font-semibold">Zone:</strong> 
                  <span className="text-slate-600 ml-2">{zones.find(z => z.id === photo.zone_id)?.name || photo.zone_id}</span>
                </p>

                <p className="text-base">
                  <strong className="text-slate-700 font-semibold">Category:</strong> 
                  <span className="text-slate-600 ml-2">{photo.category}</span>
                </p>
                
                <p className="text-base">
                  <strong className="text-slate-700 font-semibold">Status:</strong> 
                  <span className="text-slate-600 ml-2">{photo.status}</span>
                </p>
                
                {/* ADD GPS DATA */}
                <p className="text-base">
                  <strong className="text-slate-700 font-semibold">GPS:</strong> 
                  <span className="text-slate-600 ml-2">
                    {photo.gps_allowed ? 
                    `${Number(photo.latitude)?.toFixed(4)}, ${Number(photo.longitude)?.toFixed(4)}` : 
                    'Not allowed'}
                  </span>
                </p>
                
                {/* Notes */}
                <div className="text-base">
                  <strong className="text-slate-700 font-semibold">Notes:</strong>
                  <p className="text-slate-600 mt-1 line-clamp-2">
                    {photo.notes || 'None'}
                  </p>
                </div>
                
                <p className="text-sm text-slate-500 pt-2 border-t border-slate-200">
                  By: {photo.uploader_name || 'Unknown'}
                </p>
                <p className="text-xs text-slate-400">
                  {photo.created_at ? new Date(photo.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>

              {/* Divider */}
              <div className="h-0.5 bg-slate-200"></div>

              {/* Buttons */}
              <div className="p-3 flex gap-2 bg-slate-50">
                <button 
                  onClick={() => handleStatusChange(photo.id, 'hidden')}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Hide
                </button>
                <button 
                  onClick={() => handleStatusChange(photo.id, 'flagged')}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Flag
                </button>
                <button 
                  onClick={() => handleStatusChange(photo.id, 'active')}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Activate
                </button>
              </div>
            </div>
            //End of Photo Card
          )))}
        </div>
          {!loading && filteredPhotos.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-xl font-semibold">No photos found</p>
              <p className="mt-2">Try adjusting your filters or search</p>
            </div>
          )}
          {selectedPhoto && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden" onClick={() => setSelectedPhoto(null)}>
              <div className="relative bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setSelectedPhoto(null)} className="absolute top-6 right-6 text-2xl text-slate-700 font-bold rounded-full w-12 h-12 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 shadow-lg hover:scale-110 transition-all">
                  ✕
                </button>
                <button onClick={handlePrevious} className="absolute bottom-1/2 left-6 transform -translate-y-1/2 text-3xl text-slate-700 font-bold rounded-full w-12 h-12 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 shadow-lg hover:scale-110 transition-all">
                  ←
                </button>
                <button onClick={handleNext} className="absolute bottom-1/2 right-6 transform -translate-y-1/2 text-3xl text-slate-700 font-bold rounded-full w-12 h-12 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 shadow-lg hover:scale-110 transition-all">
                  →
                </button>
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.category}
                  className="w-full h-auto object-contain max-h-[70vh]"
                />
                <div className="p-6 overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-4">Photo Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Category</p>
                      <p className="text-base text-slate-800">{selectedPhoto.category}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Zone</p>
                      <p className="text-base text-slate-800">{zones.find(z => z.id === selectedPhoto.zone_id)?.name || selectedPhoto.zone_id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Status</p>
                      <p className="text-base text-slate-800">{selectedPhoto.status}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-500">GPS</p>
                      <p className="text-base text-slate-800">
                        {selectedPhoto.gps_allowed ? 
                          `${selectedPhoto.latitude}, ${selectedPhoto.longitude}` : 
                          'Not allowed'}
                      </p>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-slate-500">Notes</p>
                      <p className="text-base text-slate-800">{selectedPhoto.notes || 'None'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Uploaded By</p>
                      <p className="text-base text-slate-800">{selectedPhoto.uploader_name || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Uploaded</p>
                      <p className="text-base text-slate-800">
                        {selectedPhoto.created_at ? new Date(selectedPhoto.created_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div> 
              </div>
            </div> 
          )}
      </div>
    </div>
  );
}
