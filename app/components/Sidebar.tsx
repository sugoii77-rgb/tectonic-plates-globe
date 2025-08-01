import React, { useEffect, useState } from 'react';
import { usePlateContext } from '../context/PlateContext';
import { PlateMeta, CollisionEQ } from '../types/plate';

const Sidebar: React.FC = () => {
  const { selectedPlateId } = usePlateContext();
  const [platesMeta, setPlatesMeta] = useState<PlateMeta[]>([]);
  const [expandedCollisions, setExpandedCollisions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadPlatesMeta = async () => {
      try {
        const response = await fetch('/data/plates.json');
        const data = await response.json();
        setPlatesMeta(data);
      } catch (error) {
        console.error('Error loading plates metadata:', error);
      }
    };

    loadPlatesMeta();
  }, []);

  const selectedPlate = platesMeta.find(plate => plate.id === selectedPlateId);

  const toggleCollision = (collisionId: string) => {
    const newExpanded = new Set(expandedCollisions);
    if (newExpanded.has(collisionId)) {
      newExpanded.delete(collisionId);
    } else {
      newExpanded.add(collisionId);
    }
    setExpandedCollisions(newExpanded);
  };

  const formatMagnitude = (mw: number): string => {
    return `M${mw.toFixed(1)}`;
  };

  const MotionArrow: React.FC<{ vector: [number, number]; rate: number }> = ({ vector, rate }) => {
    const [dx, dy] = vector;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return (
      <div className="flex items-center space-x-2">
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-blue-400">
          <g transform={`rotate(${angle} 12 12)`}>
            <path
              d="M4 12 L20 12 M16 8 L20 12 L16 16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        <span className="text-sm text-gray-300">
          {rate.toFixed(1)} cm/year
        </span>
      </div>
    );
  };

  if (!selectedPlate) {
    return (
      <div className="w-80 bg-gray-900 text-white p-6 overflow-y-auto h-full border-l border-gray-700">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Tectonic Plates Explorer</h2>
          <p className="text-gray-400 mb-6">
            Click on any plate on the globe to explore its movement patterns and major earthquakes.
          </p>
          <div className="text-sm text-gray-500">
            <p>Learn about:</p>
            <ul className="mt-2 space-y-1">
              <li>• Plate motion vectors</li>
              <li>• Collision boundaries</li>
              <li>• Historic mega-earthquakes</li>
              <li>• Tectonic processes</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-900 text-white p-6 overflow-y-auto h-full border-l border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">
        {selectedPlate.name} Plate
      </h2>

      {/* Motion Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-green-400">
          Plate Motion
        </h3>
        <MotionArrow 
          vector={selectedPlate.motion.vector} 
          rate={selectedPlate.motion.rate} 
        />
        <p className="text-xs text-gray-400 mt-2">
          Direction and speed of plate movement
        </p>
      </div>

      {/* Collisions Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-red-400">
          Plate Boundaries & Major Earthquakes
        </h3>
        
        {selectedPlate.collisions.length === 0 ? (
          <p className="text-gray-400 text-sm">No major collision data available</p>
        ) : (
          <div className="space-y-3">
            {selectedPlate.collisions.map((collision, index) => (
              <div key={`${selectedPlate.id}-${collision.with}-${index}`} className="border border-gray-600 rounded-lg">
                <button
                  onClick={() => toggleCollision(`${selectedPlate.id}-${collision.with}-${index}`)}
                  className="w-full p-3 text-left bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Boundary with {collision.with}
                    </span>
                    <span className="text-gray-400">
                      {expandedCollisions.has(`${selectedPlate.id}-${collision.with}-${index}`) ? '−' : '+'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {collision.eqs.length} major earthquake{collision.eqs.length !== 1 ? 's' : ''}
                  </div>
                </button>
                
                {expandedCollisions.has(`${selectedPlate.id}-${collision.with}-${index}`) && (
                  <div className="p-3 bg-gray-850">
                    <div className="space-y-2">
                      {collision.eqs.map((eq: CollisionEQ, eqIndex: number) => (
                        <div 
                          key={`${selectedPlate.id}-${collision.with}-${index}-${eqIndex}`}
                          className="bg-gray-700 p-3 rounded border-l-4 border-red-500"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-red-300">
                                {formatMagnitude(eq.Mw)}
                              </div>
                              <div className="text-sm text-gray-300 mt-1">
                                {eq.place}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {eq.year}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="text-xs text-gray-500 mt-8 pt-4 border-t border-gray-700">
        <p>
          Data shows major earthquakes (M≥7.0) at plate boundaries. 
          Plate motion vectors indicate average annual movement.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
