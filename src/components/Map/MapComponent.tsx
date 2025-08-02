import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dustbin, WasteReport, CleanupDrive } from "../../types";
import {
  mockDustbins,
  mockWasteReports,
  mockCleanupDrives,
} from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import { Trash2, AlertTriangle, Users } from "lucide-react";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const dustbinEmptyIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6h18l-1.5 14H4.5L3 6zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <circle cx="12" cy="13" r="2" fill="#22C55E"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const dustbinFilledIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6h18l-1.5 14H4.5L3 6zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <circle cx="12" cy="13" r="2" fill="#EF4444"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const wasteReportIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(
      `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
    </svg>
  `.trim()
    ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const cleanupDriveIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(
      `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    `.trim()
    ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapComponentProps {
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
  showLayers?: {
    dustbins?: boolean;
    wasteReports?: boolean;
    cleanupDrives?: boolean;
  };
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [8.5241, 76.9366],
  zoom = 13,
  height = "400px",
  showLayers = { dustbins: true, wasteReports: true, cleanupDrives: true },
  onLocationSelect,
}) => {
  const { user, updateUser } = useAuth();
  const [dustbins, setDustbins] = useState<Dustbin[]>(mockDustbins);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  const toggleDustbinStatus = (dustbinId: string) => {
    if (!user) return;

    setDustbins((prev) =>
      prev.map((dustbin) => {
        if (dustbin.id === dustbinId) {
          const newStatus = dustbin.status === "empty" ? "filled" : "empty";
          // Award points for reporting filled dustbin
          if (newStatus === "filled") {
            updateUser({ greenPoints: user.greenPoints + 10 });
          }
          return {
            ...dustbin,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
            updatedBy: user.id,
          };
        }
        return dustbin;
      })
    );
  };

  // Component to handle map clicks
  const MapClickHandler: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (!onLocationSelect) return;

      const handleClick = async (e: any) => {
        const { lat, lng } = e.latlng;

        // Reverse geocoding (mock implementation)
        const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        onLocationSelect(lat, lng, address);
      };

      map.on("click", handleClick);

      return () => {
        map.off("click", handleClick);
      };
    }, [map]);

    return null;
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={userLocation || center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dustbin markers */}
        {showLayers.dustbins &&
          dustbins.map((dustbin) => (
            <Marker
              key={dustbin.id}
              position={[dustbin.latitude, dustbin.longitude]}
              icon={
                dustbin.status === "empty"
                  ? dustbinEmptyIcon
                  : dustbinFilledIcon
              }
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trash2 className="h-4 w-4" />
                    <strong>Dustbin</strong>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {dustbin.address}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dustbin.status === "empty"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dustbin.status === "empty" ? "Empty" : "Full"}
                    </span>
                    <button
                      onClick={() => toggleDustbinStatus(dustbin.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      disabled={!user}
                    >
                      Update Status
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last updated:{" "}
                    {new Date(dustbin.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Waste report markers */}
        {showLayers.wasteReports &&
          mockWasteReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={wasteReportIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <strong>Waste Report</strong>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.address}</p>
                  <p className="text-sm mb-2">{report.description}</p>
                  <div className="mb-2">
                    <img
                      src={report.beforeImage}
                      alt="Waste report"
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === "completed" ||
                      report.status === "self_cleaned"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status.replace("_", " ").toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Points awarded: {report.pointsAwarded}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Cleanup drive markers */}
        {showLayers.cleanupDrives &&
          mockCleanupDrives.map((drive) => (
            <Marker
              key={drive.id}
              position={[drive.latitude, drive.longitude]}
              icon={cleanupDriveIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <strong>Cleanup Drive</strong>
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {drive.communityName}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{drive.address}</p>
                  <p className="text-sm mb-2">{drive.description}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      drive.status === "completed" ||
                      drive.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {drive.status.toUpperCase()}
                  </span>
                  {drive.pointsAwarded > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Points awarded: {drive.pointsAwarded}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
