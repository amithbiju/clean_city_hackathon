import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Upload, CheckCircle } from 'lucide-react';
import MapComponent from '../components/Map/MapComponent';
import { useAuth } from '../contexts/AuthContext';

const ReportWastePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    beforeImage: '',
    afterImage: '',
    cleanupType: 'submit_to_authority' as 'self_clean' | 'submit_to_authority',
    latitude: 0,
    longitude: 0,
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleImageUpload = (type: 'before' | 'after', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          [`${type}Image`]: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address
    }));
    setShowMap(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Award points based on cleanup type
    const pointsAwarded = formData.cleanupType === 'self_clean' 
      ? (formData.afterImage ? 50 : 30)
      : 30;

    updateUser({ greenPoints: user.greenPoints + pointsAwarded });

    setIsSubmitting(false);
    navigate('/', { 
      state: { 
        message: `Waste report submitted successfully! You earned ${pointsAwarded} Green Points.` 
      }
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }));
        },
        (error) => {
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Report Waste Area</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Describe the waste issue..."
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="space-y-3">
              {formData.address && (
                <div className="p-3 bg-gray-50 rounded-md flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{formData.address}</span>
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Use Current Location</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Select on Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Map Modal */}
          {showMap && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-4 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Select Location</h3>
                  <button
                    type="button"
                    onClick={() => setShowMap(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="h-96">
                  <MapComponent
                    height="100%"
                    onLocationSelect={handleLocationSelect}
                    showLayers={{ dustbins: false, wasteReports: false, cleanupDrives: false }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Click anywhere on the map to select location</p>
              </div>
            </div>
          )}

          {/* Before Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Before Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {formData.beforeImage ? (
                <div className="space-y-3">
                  <img
                    src={formData.beforeImage}
                    alt="Before"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, beforeImage: '' }))}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleImageUpload('before', e)}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Cleanup Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value="submit_to_authority"
                  checked={formData.cleanupType === 'submit_to_authority'}
                  onChange={(e) => setFormData(prev => ({ ...prev, cleanupType: e.target.value as any }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <div className="font-medium">Submit to Authorities</div>
                  <div className="text-sm text-gray-500">Report the issue for official cleanup</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value="self_clean"
                  checked={formData.cleanupType === 'self_clean'}
                  onChange={(e) => setFormData(prev => ({ ...prev, cleanupType: e.target.value as any }))}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <div className="font-medium">Self Clean</div>
                  <div className="text-sm text-gray-500">I will clean this area myself</div>
                </div>
              </label>
            </div>
          </div>

          {/* After Image (for self clean) */}
          {formData.cleanupType === 'self_clean' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                After Image (Optional - for bonus points)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.afterImage ? (
                  <div className="space-y-3">
                    <img
                      src={formData.afterImage}
                      alt="After"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, afterImage: '' }))}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        Upload after cleanup image for bonus points
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleImageUpload('after', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Points Info */}
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="text-green-600">🌿</div>
              <div>
                <div className="font-medium text-green-800">Green Points</div>
                <div className="text-sm text-green-700">
                  {formData.cleanupType === 'self_clean' 
                    ? 'Earn 30 points for reporting + 20 bonus points with after image'
                    : 'Earn 30 points for reporting to authorities'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.address || !formData.beforeImage}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportWastePage;