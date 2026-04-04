import React, { useState } from 'react';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';

const AutoModePanel: React.FC = () => {
  const { startAutoGeneration, isGenerating } = useMusicGenerator();
  const [city, setCity] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const fetchCityFromGeolocation = async () => {
    try {
      setIsLoadingLocation(true);
      setGeoError(null);

      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err)
        );
      });

      // Use reverse geocoding API to get city name from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}`
      );
      const data = await response.json();
      const cityName = data.address?.city || data.address?.town || data.address?.county || 'Unknown';
      setCity(cityName);
    } catch (err) {
      const errorMsg =
        err instanceof GeolocationPositionError
          ? err.message
          : 'Failed to get your location';
      setGeoError(errorMsg);
      setCity('');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAutoVibe = async () => {
    if (!city) {
      setGeoError('Please select a location first');
      return;
    }
    await startAutoGeneration(city);
  };

  return (
    <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-semibold">Auto Vibe Generation</h2>

      {/* Location Selection */}
      <div className="space-y-3">
        <label className="text-sm text-gray-300 block">Your Location</label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city or auto-detect..."
            disabled={isGenerating || isLoadingLocation}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={fetchCityFromGeolocation}
            disabled={isGenerating || isLoadingLocation}
            className={`px-4 py-2 rounded-lg transition-all ${
              isGenerating || isLoadingLocation
                ? 'bg-gray-600/50 cursor-not-allowed opacity-50'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isLoadingLocation ? '...' : '📍'}
          </button>
        </div>

        {geoError && (
          <p className="text-sm text-red-400">{geoError}</p>
        )}
        {city && !geoError && (
          <p className="text-sm text-green-400">✓ {city}</p>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleAutoVibe}
        disabled={isGenerating || !city}
        className={`w-full py-3 px-4 font-semibold rounded-lg transition-all ${
          isGenerating || !city
            ? 'bg-purple-600/50 cursor-not-allowed opacity-75'
            : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500'
        }`}
      >
        {isGenerating ? '⏳ Generating...' : '▶ Launch Auto Vibe'}
      </button>
    </div>
  );
};

export default AutoModePanel;
