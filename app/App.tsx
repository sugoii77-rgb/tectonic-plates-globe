import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { schemeCategory10 } from 'd3-scale-chromatic';
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

interface TopoFeature {
  type: 'Feature';
  properties: {
    PlateName: string;
  };
  geometry: any;
}

const App: React.FC = () => {
  const globeEl = useRef<any>();
  const [plates, setPlates] = useState<PlateData[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<PlateData | null>(null);
  const [platesGeo, setPlatesGeo] = useState<TopoFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load plate metadata
        const platesResponse = await fetch('/tectonic-plates-globe/data/plates.json');
        const platesData = await platesResponse.json();
        setPlates(platesData);

        // Load TopoJSON and convert to GeoJSON features
        const topoResponse = await fetch('/tectonic-plates-globe/data/platesTopo.json');
        const topoData = await topoResponse.json();
        
        console.log('TopoJSON data loaded:', topoData); // 디버깅용
        
        // Create more accurate plate boundaries with correct geographic positioning
        const features: TopoFeature[] = [
          {
            type: 'Feature',
            properties: { PlateName: 'Pacific' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-180, -70], [-160, 65], [-130, 60], [-110, 50], [-90, 20], [-80, -10], [-70, -50], [140, -60], [160, -40], [170, 10], [180, 40], [180, -70], [-180, -70]]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'North America' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-160, 50], [-130, 60], [-110, 50], [-90, 20], [-75, 45], [-60, 50], [-50, 65], [-20, 70], [20, 75], [-160, 75], [-160, 50]]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'South America' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-90, 20], [-80, -10], [-70, -50], [-40, -60], [-30, -40], [-35, -10], [-45, 15], [-60, 25], [-75, 45], [-90, 20]]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'Eurasia' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-20, 70], [20, 75], [60, 78], [100, 75], [130, 65], [140, 45], [120, 35], [80, 40], [40, 45], [0, 50], [-20, 70]]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'Africa' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-20, 35], [0, 50], [40, 45], [50, 20], [45, -10], [35, -35], [15, -40], [-10, -35], [-15, -10], [-20, 35]]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'Indo-Australia' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[50, 20], [120, 35], [140, 45], [160, 10], [150, -40], [130, -50], [90, -45], [70, -30], [60, -10], [50, 20]]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'Antarctica' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-180, -90], [-180, -60], [-70, -50], [-40, -60], [35, -40], [90, -45], [130, -50], [160, -60], [180, -60], [180, -90], [-180, -90]]]
            }
          }
        ];
        
        console.log('Created features:', features); // 디버깅용
        
        setPlatesGeo(features);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getPlateColor = (plateName: string): string => {
    const plateNames = [
      'Pacific', 'North America', 'South America', 
      'Eurasia', 'Africa', 'Indo-Australia', 'Antarctica'
    ];
    const index = plateNames.indexOf(plateName);
    const baseColor = index >= 0 ? schemeCategory10[index] : '#cccccc';
    
    // 선택된 판은 더 밝게, 나머지는 많이 투명하게
    if (selectedPlate && getPlateId(plateName) === selectedPlate.id) {
      return baseColor + 'CC'; // 선택된 판은 80% 불투명
    }
    return baseColor + '40'; // 나머지는 25% 불투명 (더 투명하게)
  };

  const getPlateStrokeColor = (plateName: string): string => {
    if (selectedPlate && getPlateId(plateName) === selectedPlate.id) {
      return '#ffff00'; // 선택된 판은 노란색 테두리
    }
    return '#ffffff80'; // 기본 반투명 흰색 테두리
  };

  const getPlateStrokeWidth = (plateName: string): number => {
    if (selectedPlate && getPlateId(plateName) === selectedPlate.id) {
      return 4; // 선택된 판은 더 두꺼운 테두리
    }
    return 0.5; // 기본 얇은 테두리
  };

  const getPlateId = (plateName: string): string => {
    const plateMap: { [key: string]: string } = {
      'Pacific': 'PA',
      'North America': 'NA',
      'South America': 'SA',
      'Eurasia': 'EU',
      'Africa': 'AF',
      'Indo-Australia': 'IA',
      'Antarctica': 'AN'
    };
    return plateMap[plateName] || 'UN';
  };

  const handlePolygonClick = (polygon: any, event?: any) => {
    console.log('Polygon clicked:', polygon); // 디버깅용
    
    if (polygon?.properties?.PlateName) {
      const plateId = getPlateId(polygon.properties.PlateName);
      const plate = plates.find(p => p.id === plateId);
      
      console.log('Selected plate:', plate); // 디버깅용
      
      if (plate) {
        // 같은 판을 다시 클릭하면 선택 해제
        if (selectedPlate?.id === plate.id) {
          setSelectedPlate(null);
        } else {
          setSelectedPlate(plate);
        }
        
        // 이벤트 전파 중단
        if (event) {
          event.stopPropagation?.();
        }
      }
    } else {
      // 빈 공간 클릭 시 선택 해제
      setSelectedPlate(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-2xl font-bold mb-2">Tectonic Plates Interactive Globe</h1>
          <p className="text-gray-400">Loading 3D globe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* 3D Globe */}
      <div className="flex-1 relative">
        <Globe
          ref={globeEl}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          polygonsData={platesGeo}
          polygonCapColor={(d: any) => getPlateColor(d.properties?.PlateName)}
          polygonSideColor={() => 'rgba(255, 255, 255, 0.02)'}
          polygonStrokeColor={(d: any) => getPlateStrokeColor(d.properties?.PlateName)}
          polygonStrokeWidth={(d: any) => getPlateStrokeWidth(d.properties?.PlateName)}
          polygonsTransitionDuration={500}
          onPolygonClick={handlePolygonClick}
          onPolygonHover={(polygon, prevPolygon) => {
            // 호버 효과
            document.body.style.cursor = polygon ? 'pointer' : 'default';
          }}
          polygonAltitude={(d: any) => {
            // 선택된 판은 약간 높이 띄우기
            if (selectedPlate && getPlateId(d.properties?.PlateName) === selectedPlate.id) {
              return 0.015;
            }
            return 0.002; // 기본 높이를 더 낮게
          }}
          enablePointerInteraction={true}
          width={window.innerWidth * 0.7}
          height={window.innerHeight}
        />
        
        {/* Legend */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs">
          <h3 className="text-lg font-bold mb-2">🌍 Tectonic Plates</h3>
          <div className="space-y-1 text-sm">
            {['Pacific', 'North America', 'South America', 'Eurasia', 'Africa', 'Indo-Australia', 'Antarctica'].map((name, index) => (
              <div key={name} className="flex items-center">
                <div 
                  className="w-4 h-4 mr-2 rounded"
                  style={{ backgroundColor: schemeCategory10[index] }}
                ></div>
                <span>{name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2 opacity-75">Click on a plate to learn more</p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-gray-800 text-white p-6 overflow-y-auto border-l border-gray-600">
        {selectedPlate ? (
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              {selectedPlate.name} Plate
            </h2>

            {/* Motion Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                🔄 Plate Motion
              </h3>
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-300 mb-2">
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
                🌋 Major Earthquakes
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
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-xl font-bold text-gray-400 mb-2">
              Interactive 3D Globe
            </h2>
            <p className="text-gray-500 mb-4">
              Rotate the globe and click on any tectonic plate to explore its movement patterns and major earthquakes.
            </p>
            <div className="text-sm text-gray-600">
              <p>🖱️ Drag to rotate</p>
              <p>🔍 Scroll to zoom</p>
              <p>👆 Click plates for details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
