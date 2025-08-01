import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { usePlateContext } from '../context/PlateContext';
import { PlateMeta } from '../types/plate';

interface GlobeComponentProps {
  className?: string;
}

const GlobeComponent: React.FC<GlobeComponentProps> = ({ className = '' }) => {
  const globeEl = useRef<any>();
  const { setSelectedPlateId } = usePlateContext();
  const [platesData, setPlatesData] = useState<any>(null);
  const [platesMeta, setPlatesMeta] = useState<PlateMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [topoResponse, metaResponse] = await Promise.all([
          fetch('/data/platesTopo.json'),
          fetch('/data/plates.json')
        ]);
        
        const topoData = await topoResponse.json();
        const metaData = await metaResponse.json();
        
        setPlatesData(topoData);
        setPlatesMeta(metaData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading plate data:', error);
        setIsLoading(false);
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
    return index >= 0 ? schemeCategory10[index] : '#cccccc';
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

  const handlePolygonClick = (polygon: any) => {
    if (polygon && polygon.properties && polygon.properties.PlateName) {
      const plateId = getPlateId(polygon.properties.PlateName);
      setSelectedPlateId(plateId);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-white text-lg">Loading globe...</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={platesData?.objects?.plates?.geometries || []}
        polygonCapColor={(d: any) => getPlateColor(d.properties?.PlateName)}
        polygonSideColor={() => 'rgba(255, 255, 255, 0.1)'}
        polygonStrokeColor={() => '#ffffff'}
        polygonsTransitionDuration={300}
        onPolygonClick={handlePolygonClick}
        polygonAltitude={0.01}
        width={window.innerWidth}
        height={window.innerHeight}
        enablePointerInteraction={true}
      />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs">
        <h3 className="text-lg font-bold mb-2">Tectonic Plates</h3>
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
  );
};

export default GlobeComponent;
