import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Tectonic Plates Data Pipeline', () => {
  const dataDir = join(process.cwd(), 'public/data');
  const topoJsonPath = join(dataDir, 'platesTopo.json');
  const platesJsonPath = join(dataDir, 'plates.json');

  describe('File Existence', () => {
    test('platesTopo.json file exists', () => {
      expect(existsSync(topoJsonPath)).toBe(true);
    });

    test('plates.json file exists', () => {
      expect(existsSync(platesJsonPath)).toBe(true);
    });
  });

  describe('TopoJSON Validation', () => {
    let topoData: any;

    beforeAll(() => {
      if (existsSync(topoJsonPath)) {
        const fileContent = readFileSync(topoJsonPath, 'utf-8');
        topoData = JSON.parse(fileContent);
      }
    });

    test('has valid TopoJSON structure', () => {
      expect(topoData).toBeDefined();
      expect(topoData.type).toBe('Topology');
      expect(topoData.objects).toBeDefined();
    });

    test('contains exactly 7 plate geometries', () => {
      const plates = topoData?.objects?.PB2002_plates?.geometries || [];
      expect(plates).toHaveLength(7);
    });

    test('all plates have valid properties', () => {
      const plates = topoData?.objects?.PB2002_plates?.geometries || [];
      const expectedPlates = [
        'Pacific', 'North America', 'South America', 
        'Eurasia', 'Africa', 'Indo-Australia', 'Antarctica'
      ];

      plates.forEach((plate: any) => {
        expect(plate.properties).toBeDefined();
        expect(plate.properties.PlateName).toBeDefined();
        expect(expectedPlates).toContain(plate.properties.PlateName);
      });
    });

    test('file size is reasonable (< 200 KB)', () => {
      if (existsSync(topoJsonPath)) {
        const stats = require('fs').statSync(topoJsonPath);
        expect(stats.size).toBeLessThan(200 * 1024); // 200 KB
      }
    });
  });

  describe('Plates Metadata Validation', () => {
    let platesData: any[];

    beforeAll(() => {
      if (existsSync(platesJsonPath)) {
        const fileContent = readFileSync(platesJsonPath, 'utf-8');
        platesData = JSON.parse(fileContent);
      }
    });

    test('contains exactly 7 plates', () => {
      expect(Array.isArray(platesData)).toBe(true);
      expect(platesData).toHaveLength(7);
    });

    test('all plates have required fields', () => {
      platesData.forEach(plate => {
        expect(plate.id).toBeDefined();
        expect(typeof plate.id).toBe('string');
        expect(plate.id.length).toBe(2);

        expect(plate.name).toBeDefined();
        expect(typeof plate.name).toBe('string');

        expect(plate.motion).toBeDefined();
        expect(plate.motion.vector).toBeDefined();
        expect(Array.isArray(plate.motion.vector)).toBe(true);
        expect(plate.motion.vector).toHaveLength(2);
        expect(typeof plate.motion.rate).toBe('number');
        
        expect(Array.isArray(plate.collisions)).toBe(true);
      });
    });

    test('all plates have positive motion rates', () => {
      platesData.forEach(plate => {
        expect(plate.motion.rate).toBeGreaterThan(0);
      });
    });

    test('all plates have at least one collision', () => {
      platesData.forEach(plate => {
        expect(plate.collisions.length).toBeGreaterThanOrEqual(1);
      });
    });

    test('collision earthquakes have valid data', () => {
      platesData.forEach(plate => {
        plate.collisions.forEach((collision: any) => {
          expect(collision.with).toBeDefined();
          expect(typeof collision.with).toBe('string');
          
          expect(Array.isArray(collision.eqs)).toBe(true);
          expect(collision.eqs.length).toBeGreaterThanOrEqual(1);
          expect(collision.eqs.length).toBeLessThanOrEqual(3);

          collision.eqs.forEach((eq: any) => {
            expect(typeof eq.year).toBe('number');
            expect(eq.year).toBeGreaterThan(1700);
            expect(eq.year).toBeLessThanOrEqual(new Date().getFullYear());
            
            expect(typeof eq.place).toBe('string');
            expect(eq.place.length).toBeGreaterThan(0);
            
            expect(typeof eq.Mw).toBe('number');
            expect(eq.Mw).toBeGreaterThanOrEqual(6.5);
            expect(eq.Mw).toBeLessThanOrEqual(10.0);
          });
        });
      });
    });

    test('plate IDs are unique', () => {
      const ids = platesData.map(plate => plate.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('plate names match expected major plates', () => {
      const expectedNames = [
        'Pacific', 'North America', 'South America', 
        'Eurasia', 'Africa', 'Indo-Australia', 'Antarctica'
      ];
      
      const actualNames = platesData.map(plate => plate.name);
      expectedNames.forEach(name => {
        expect(actualNames).toContain(name);
      });
    });
  });

  describe('Data Consistency', () => {
    test('TopoJSON and metadata plates match', () => {
      if (existsSync(topoJsonPath) && existsSync(platesJsonPath)) {
        const topoContent = readFileSync(topoJsonPath, 'utf-8');
        const topoData = JSON.parse(topoContent);
        
        const metaContent = readFileSync(platesJsonPath, 'utf-8');
        const metaData = JSON.parse(metaContent);

        const topoPlateNames = topoData.objects.PB2002_plates.geometries.map(
          (plate: any) => plate.properties.PlateName
        );
        
        const metaPlateNames = metaData.map((plate: any) => plate.name);

        topoPlateNames.forEach((name: string) => {
          expect(metaPlateNames).toContain(name);
        });
      }
    });
  });
});
