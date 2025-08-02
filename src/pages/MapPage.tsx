import React, { useState } from 'react';
import MapComponent from '../components/Map/MapComponent';
import { MapPin, Navigation, Filter } from 'lucide-react';

const MapPage: React.FC = () => {
  const [showLayers, setShowLayers] = useState({
    dustbins: true,
    wasteReports: true,
    cleanupDrives: true
  });

  const toggleLayer = (layer: keyof typeof showLayers) => {
    setShowLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const centerOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This would be handled by the MapComponent
        },
        (error) => {
          alert('Unable to get your location');
        }
      );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <MapComponent
          height="100%"
          center={[8.5241, 76.9366]}
          zoom={12}
          showLayers={showLayers}
        />
      </div>

      {/* Floating controls */}
      <div className="absolute top-20 right-4 z-[1000] space-y-2">
        <button
          onClick={centerOnUser}
          className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Navigation className="h-5 w-5 text-gray-700" />
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="h-4 w-4 text-gray-700" />
            <span className="text-sm font-medium">Layers</span>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLayers.dustbins}
                onChange={() => toggleLayer('dustbins')}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">Dustbins</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLayers.wasteReports}
                onChange={() => toggleLayer('wasteReports')}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">Waste Reports</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLayers.cleanupDrives}
                onChange={() => toggleLayer('cleanupDrives')}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">Cleanup Drives</span>
            </label>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="absolute bottom-24 md:bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">Map Legend</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Empty Dustbins</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Full Dustbins</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Waste Reports</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Cleanup Drives</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Click on markers for more information and actions. Click anywhere on the map to select a location.
        </p>
      </div>
    </div>
  );
};

export default MapPage;