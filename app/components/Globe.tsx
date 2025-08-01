import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { usePlateContext } from '../context/PlateContext';

const plateNames = [
  'Pacific', 'North America', 'South America',
  'Eurasia', 'Africa', 'Indo-Australia', 'Antarctica'
];
const plateIdMap: Record<string, string> = {
  Pacific: 'PA', 'North America': 'NA', 'South America': 'SA',
  Eurasia: 'EU',  Africa: 'AF',   'Indo-Australia': 'IA', Antarctica: 'AN'
};
const plateColor = (name: string) =>
  schemeCategory10[plateNames.indexOf(name)] ?? '#90caf9';

interface GlobeComponentProps { className?: string; }

const GlobeComponent: React.FC<GlobeComponentProps> = ({ className = '' }) => {
  const globeEl = useRef<any>();
  const { setSelectedPlateId } = usePlateContext();

  const [platesData, setPlatesData] = useState<any>(null);
  const [hoverId,    setHoverId]    = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* 데이터 로드 */
  useEffect(() => {
    (async () => {
      const topo = await fetch('/data/platesTopo.json').then(r => r.json());
      setPlatesData(topo.objects.PB2002_plates.geometries); // ★ 실제 TopoJSON 키
    })();
  }, []);

  if (!platesData) {
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

        /* ---------- 데이터 ---------- */
        polygonsData={platesData}

        /* ---------- 색상·스타일 ---------- */
        polygonCapColor={d => {
          const id = d.id ?? d.properties?.PlateName;
          if (id === selectedId) return plateColor(id);
          if (id === hoverId)    return plateColor(id);
          return 'rgba(0,0,0,0)';              // 기본 투명
        }}
        polygonSideColor={() => 'transparent'}
        polygonStrokeColor={d => plateColor(d.properties?.PlateName)}
        polygonStrokeWidth={0.6}
        polygonDepthWrite={false}              // 겹침 방지

        /* ---------- 높이 ---------- */
        polygonAltitude={d =>
          (d.id ?? d.properties?.PlateName) === selectedId ? 0.01 : 0
        }

        /* ---------- 인터랙션 ---------- */
        enablePointerInteraction
        onPolygonHover={d => {
          const id = d ? d.id ?? d.properties?.PlateName : null;
          setHoverId(id);
        }}
        onPolygonClick={d => {
          if (!d) return;
          const name = d.id ?? d.properties?.PlateName;
          setSelectedId(name);
          setSelectedPlateId(plateIdMap[name] ?? 'UN');
        }}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs">
        <h3 className="text-lg font-bold mb-2">Tectonic Plates</h3>
        <div className="space-y-1 text-sm">
          {plateNames.map((name, i) => (
            <div key={name} className="flex items-center">
              <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: schemeCategory10[i] }}/>
              <span>{name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2 opacity-75">Click a plate to learn more</p>
      </div>
    </div>
  );
};

export default GlobeComponent;
