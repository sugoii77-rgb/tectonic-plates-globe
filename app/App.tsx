import React, { useState, useEffect } from 'react';
import './index.css';

interface PlateData {
  id: string;
  name: string;
  motion: {
    vector: [number, number];
    rate: number;
  };
  collisions: Array<{
    with: string;
    eqs: Array<{
      year: number;
      place: string;
      Mw: number;
    }>;
  }>;
}

const App: React.FC = () => {
  const [plates, setPlates] = useState<PlateData[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<PlateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlates = async () => {
      try {
        const response = await fetch('/tectonic-plates-globe/data/plates.json');
        const data = await response.json();
        setPlates(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading plates:', error);
        setLoading(false);
      }
    };

    loadPlates();
  }, []);

  const plateColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', 
    '#9467bd', '#8c564b', '#e377c2'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-2xl font-bold mb-2">Tectonic Plates Interactive Globe</h1>
          <p className="text-gray-400">Loading plate data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">
            🌍 Tectonic Plates Interactive Globe
          </h1>
          <p className="text-gray-300">
            Educational tool for learning about the seven major tectonic plates
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Plates List */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-6">
              Seven Major Tectonic Plates
            </h2>
            <div className="space-y-4">
              {plates.map((plate, index) => (
                <button
                  key={plate.id}
                  onClick={() => setSelectedPlate(plate)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPlate?.id === plate.id
                      ? 'border-blue-400 bg-gray-700'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: plateColors[index] }}
                    ></div>
                    <div>
                      <h3 className="font-semibold text-lg">{plate.name} Plate</h3>
                      <p className="text-sm text-gray-400">
                        Movement: {plate.motion.rate} cm/year
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Plate Details */}
          <div>
            {selectedPlate ? (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">
                  {selectedPlate.name} Plate
                </h2>

                {/* Motion Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Plate Motion
                  </h3>
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-sm text-gray-300">
                      <strong>Speed:</strong> {selectedPlate.motion.rate} cm/year
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Direction:</strong> [{selectedPlate.motion.vector[0]}, {selectedPlate.motion.vector[1]}]
                    </p>
                  </div>
                </div>

                {/* Earthquakes */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    Major Earthquakes
                  </h3>
                  <div className="space-y-3">
                    {selectedPlate.collisions.map((collision, colIndex) => (
                      <div key={colIndex} className="bg-gray-700 p-4 rounded">
                        <h4 className="font-medium text-yellow-400 mb-2">
                          Boundary with {collision.with}
                        </h4>
                        <div className="space-y-2">
                          {collision.eqs.map((eq, eqIndex) => (
                            <div key={eqIndex} className="text-sm">
                              <span className="text-red-300 font-medium">
                                M{eq.Mw.toFixed(1)}
                              </span>
                              <span className="text-gray-300 ml-2">
                                {eq.place} ({eq.year})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <h2 className="text-xl font-bold text-gray-400 mb-2">
                  Select a Tectonic Plate
                </h2>
                <p className="text-gray-500">
                  Click on any plate from the list to explore its movement patterns and major earthquakes.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500">
          <p>
            Educational tool for learning about tectonic plates and earthquakes.
          </p>
          <p className="mt-2">
            Data sources: USGS, Peter Bird's Tectonic Plates, GSRM v2.1
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
