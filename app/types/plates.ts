export interface CollisionEQ {
  year: number;
  place: string;
  Mw: number;
}

export interface Collision {
  with: string;
  eqs: CollisionEQ[];
}

export interface MotionVector {
  vector: [number, number]; // [dx, dy] cm/yr
  rate: number;
}

export interface PlateMeta {
  id: string; // 2-letter code
  name: string;
  motion: MotionVector;
  collisions: Collision[];
}

export interface PlateGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface PlateFeature {
  type: 'Feature';
  properties: {
    PlateName: string;
    [key: string]: any;
  };
  geometry: PlateGeometry;
}
