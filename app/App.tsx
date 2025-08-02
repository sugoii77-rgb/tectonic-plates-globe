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
        
        // Geographically accurate boundaries (no overlap)
        const features: TopoFeature[] = [
          {
            type: 'Feature',
            properties: { PlateName: 'Pacific' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-180, -90], [-180, 70], [-130, 65], [-110, 30], [-80, -15], 
                [-70, -60], [140, -65], [150, -50], [165, -20], [175, 20], 
                [180, 65], [180, -90], [-180, -90]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'North America' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-130, 65], [-110, 30], [-75, 35], [-65, 50], [-50, 65], 
                [-20, 75], [-130, 75], [-130, 65]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'South America' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-110, 30], [-80, -15], [-70, -60], [-35, -65], [-30, -35], 
                [-35, -5], [-50, 20], [-75, 35], [-110, 30]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'Eurasia' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-20, 75], [25, 80], [140, 80], [175, 20], [140, 30], 
                [90, 5], [65, 20], [40, 30], [10, 40], [-20, 75]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'Africa' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [10, 40], [40, 30], [65, 20], [55, -5], [45, -30], 
                [25, -40], [5, -35], [-15, -20], [-20, 5], [10, 40]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'Indo-Australia' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [65, 20], [90, 5], [140, 30], [175, 20], [180, -20], 
                [155, -45], [130, -55], [95, -45], [75, -15], [65, 20]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { PlateName: 'Antarctica' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-180, -90], [180, -90], [180, -45], [155, -45], [130, -55], 
                [95, -45], [45, -30], [25, -40], [-35, -65], [-70, -60], 
                [-180, -90]
              ]]
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

  const [hoveredPlate, setHoveredPlate] = useState<string | null>(null);

  const getPlateColor = (plateName: string): string => {
    const plateNames = [
      'Pacific', 'North America', 'South America', 
      'Eurasia', 'Africa', 'Indo-Australia', 'Antarctica'
    ];
    const index = plateNames.indexOf(plateName);
    const baseColor = index >= 0 ? schemeCategory10[index] : '#cccccc';
    
    // 선택된 판인지 확인
    const isSelected = selectedPlate && selectedPlate.name === plateName;
    // 호버된 판인지 확인
    const isHovered = hoveredPlate === plateName;
    
    if (isSelected) {
      return baseColor + 'DD'; // 선택된 판: 87% 불투명
    } else if (isHovered) {
      return baseColor + '99'; // 호버된 판: 60% 불투명
    } else {
      return baseColor + '33'; // 나머지: 20% 불투명 (더 투명하게)
    }
  };

  const getPlateStrokeColor = (plateName: string): string => {
    const isSelected = selectedPlate && selectedPlate.name === plateName;
    
    if (isSelected) {
      return '#ffff00'; // 선택된 판: 노란색 테두리
    }
    return '#ffffff66'; // 기본: 반투명 흰색 테두리
  };

  const getPlateStrokeWidth = (plateName: string): number => {
    const isSelected = selectedPlate && selectedPlate.name === plateName;
    
    if (isSelected) {
      return 3; // 선택된 판: 두꺼운 테두리
    }
    return 0.3; // 기본: 매우 얇은 테두리
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
    console.log('=== CLICK DEBUG v2 ===');
    console.log('Raw clicked object:', polygon);
    console.log('Event object:', event);
    
    // 배열인 경우 처리
    const polygons = Array.isArray(polygon) ? polygon : [polygon];
    console.log('Polygons array:', polygons);
    
    // 유효한 판 찾기
    for (const poly of polygons) {
      console.log('Checking polygon:', poly);
      console.log('Properties:', poly?.properties);
      console.log('ID:', poly?.id);
      
      const plateKey = poly?.id || poly?.properties?.PlateName || poly?.properties?.id;
      console.log('Extracted plate key:', plateKey);
      
      if (plateKey) {
        // name으로 직접 매칭 시도
        let plate = plates.find(p => p.name === plateKey);
        
        // 만약 없으면 ID로도 시도
        if (!plate) {
          const plateId = getPlateId(plateKey);
          plate = plates.find(p => p.id === plateId);
        }
        
        console.log('Found plate:', plate);
        
        if (plate) {
          // 같은 판을 다시 클릭하면 선택 해제
          if (selectedPlate?.name === plate.name) {
            console.log('Deselecting same plate');
            setSelectedPlate(null);
          } else {
            console.log('Selecting new plate:', plate.name);
            setSelectedPlate(plate);
          }
          console.log('=== END DEBUG ===');
          return; // 첫 번째 유효한 판에서 중단
        }
      }
    }
    
    // 유효한 판을 찾지 못한 경우
    console.log('No valid plate found, deselecting');
    setSelectedPlate(null);
    console.log('=== END DEBUG ===');
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
          polygonSideColor={() => 'rgba(255, 255, 255, 0.01)'}
          polygonStrokeColor={(d: any) => getPlateStrokeColor(d.properties?.PlateName)}
          polygonStrokeWidth={(d: any) => getPlateStrokeWidth(d.properties?.PlateName)}
          polygonsTransitionDuration={200}
          onPolygonClick={handlePolygonClick}
          onPolygonHover={(polygon, prevPolygon) => {
            // 호버 상태 업데이트
            if (polygon?.properties?.PlateName) {
              setHoveredPlate(polygon.properties.PlateName);
              document.body.style.cursor = 'pointer';
            } else {
              setHoveredPlate(null);
              document.body.style.cursor = 'default';
            }
          }}
          polygonAltitude={(d: any) => {
            const plateName = d.properties?.PlateName;
            const isSelected = selectedPlate && selectedPlate.name === plateName;
            
            if (isSelected) {
              return 0.012; // 선택된 판: 높이 상승
            }
            return 0.001; // 기본: 매우 낮은 높이
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
