import React, { useState } from 'react';
import { Users, MapPin, Camera, Plus, Calendar, Award } from 'lucide-react';
import { mockCleanupDrives } from '../data/mockData';
import MapComponent from '../components/Map/MapComponent';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CleanupDrivePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    communityName: '',
    description: '',
    beforeImage: '',
    afterImage: '',
    latitude: 0,
    longitude: 0,
    address: ''
  });

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

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Award points for organizing cleanup drive
    const pointsAwarded = formData.afterImage ? 100 : 50;
    updateUser({ greenPoints: user.greenPoints + pointsAwarded });

    setShowCreateForm(false);
    setFormData({
      communityName: '',
      description: '',
      beforeImage: '',
      afterImage: '',
      latitude: 0,
      longitude: 0,
      address: ''
    });

    navigate('/', {
      state: {
        message: `Cleanup drive ${formData.afterImage ? 'completed' : 'created'} successfully! You earned ${pointsAwarded} Green Points.`
      }
    });
  };

  if (showCreateForm) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Cleanup Drive</h1>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Community Name
              </label>
              <input
                type="text"
                value={formData.communityName}
                onChange={(e) => setFormData(prev => ({ ...prev, communityName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your community or organization name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your cleanup drive..."
                required
              />
            </div>

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
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Select Location on Map</span>
                </button>
              </div>
            </div>

            {/* Map Modal */}
            {showMap && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-4 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Select Cleanup Location</h3>
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
                      showLayers={{ dustbins: false, wasteReports: false, cleanupDrives: true }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click anywhere on the map to select location</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Before Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.beforeImage ? (
                  <div className="space-y-3">
                    <img
                      src={formData.beforeImage}
                      alt="Before cleanup"
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
                        Click to upload before image
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                After Image (Optional - for completion bonus)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.afterImage ? (
                  <div className="space-y-3">
                    <img
                      src={formData.afterImage}
                      alt="After cleanup"
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
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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

            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">Green Points Reward</div>
                  <div className="text-sm text-green-700">
                    {formData.afterImage 
                      ? 'Earn 100 points for completing cleanup drive with after image'
                      : 'Earn 50 points for organizing cleanup drive + 50 bonus points with completion image'
                    }
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.address || !formData.beforeImage}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {formData.afterImage ? 'Submit Completed Drive' : 'Create Cleanup Drive'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Cleanup Drives</h1>
          <p className="text-gray-600 mt-2">Join forces with your community to create cleaner spaces</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Drive</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCleanupDrives.map(drive => (
          <div key={drive.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={drive.beforeImage}
                alt="Cleanup area"
                className="w-full h-48 object-cover"
              />
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                drive.status === 'completed' || drive.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {drive.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">{drive.communityName}</h3>
              </div>

              <div className="flex items-start space-x-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-sm text-gray-600">{drive.address}</p>
              </div>

              <p className="text-gray-700 mb-4">{drive.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Adopted: {new Date(drive.adoptedAt).toLocaleDateString()}</span>
                </div>
                {drive.pointsAwarded > 0 && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Award className="h-4 w-4" />
                    <span>{drive.pointsAwarded} GP</span>
                  </div>
                )}
              </div>

              {drive.afterImage && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">After Cleanup:</p>
                  <img
                    src={drive.afterImage}
                    alt="After cleanup"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}

              {drive.status === 'adopted' && (
                <div className="mt-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                      This area has been adopted for cleanup. Join the community effort!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {mockCleanupDrives.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cleanup drives yet</h3>
          <p className="text-gray-500 mb-4">Be the first to organize a community cleanup drive!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Create First Drive
          </button>
        </div>
      )}
    </div>
  );
};

export default CleanupDrivePage;