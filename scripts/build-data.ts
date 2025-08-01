import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { PlateMeta, CollisionEQ } from '../app/types/plate.js';

const MAJOR_PLATES = [
  'Pacific', 'North America', 'South America', 
  'Eurasia', 'Africa', 'Indo-Australia', 'Antarctica'
];

const PLATE_IDS: { [key: string]: string } = {
  'Pacific': 'PA',
  'North America': 'NA', 
  'South America': 'SA',
  'Eurasia': 'EU',
  'Africa': 'AF',
  'Indo-Australia': 'IA',
  'Antarctica': 'AN'
};

// Hard-coded motion data (cm/year)
const MOTION_DATA: { [key: string]: { dx: number; dy: number; rate: number } } = {
  'PA': { dx: -3.2, dy: 1.1, rate: 7.8 },
  'NA': { dx: -1.0, dy: 0.2, rate: 2.1 },
  'SA': { dx: -1.1, dy: 0.4, rate: 1.8 },
  'EU': { dx: 0.8, dy: 0.1, rate: 2.2 },
  'AF': { dx: 0.9, dy: 0.5, rate: 2.5 },
  'IA': { dx: 2.8, dy: 1.2, rate: 6.2 },
  'AN': { dx: 0.1, dy: -0.2, rate: 1.1 }
};

// Hard-coded major earthquakes data
const EARTHQUAKE_DATA: { [key: string]: { with: string; eqs: CollisionEQ[] }[] } = {
  'PA': [
    {
      with: 'North America',
      eqs: [
        { year: 1964, place: 'Prince William Sound, Alaska', Mw: 9.2 },
        { year: 2011, place: 'Tohoku, Japan', Mw: 9.1 },
        { year: 1952, place: 'Kamchatka Peninsula', Mw: 9.0 }
      ]
    },
    {
      with: 'Indo-Australia', 
      eqs: [
        { year: 2004, place: 'Sumatra-Andaman', Mw: 9.1 },
        { year: 2005, place: 'Nias Island', Mw: 8.6 },
        { year: 2012, place: 'Indian Ocean', Mw: 8.6 }
      ]
    }
  ],
  'NA': [
    {
      with: 'Pacific',
      eqs: [
        { year: 1906, place: 'San Francisco', Mw: 7.9 },
        { year: 1989, place: 'Loma Prieta', Mw: 6.9 },
        { year:1994, place: 'Northridge', Mw: 6.7 }
      ]
    }
  ],
  'SA': [
    {
      with: 'Nazca',
      eqs: [
        { year: 1960, place: 'Valdivia, Chile', Mw: 9.5 },
        { year: 2010, place: 'Maule, Chile', Mw: 8.8 },
        { year: 1868, place: 'Arica, Peru', Mw: 8.5 }
      ]
    }
  ],
  'EU': [
    {
      with: 'Africa',
      eqs: [
        { year: 1755, place: 'Lisbon, Portugal', Mw: 8.5 },
        { year: 1999, place: 'Izmit, Turkey', Mw: 7.6 },
        { year: 2023, place: 'Turkey-Syria', Mw: 7.8 }
      ]
    }
  ],
  'AF': [
    {
      with: 'Eurasia',
      eqs: [
        { year: 2023, place: 'Morocco', Mw: 6.8 },
        { year: 1980, place: 'El Asnam, Algeria', Mw: 7.1 },
        { year: 2003, place: 'Boumerdes, Algeria', Mw: 6.8 }
      ]
    }
  ],
  'IA': [
    {
      with: 'Pacific',
      eqs: [
        { year: 2004, place: 'Sumatra-Andaman', Mw: 9.1 },
        { year: 1861, place: 'Sumatra', Mw: 8.5 },
        { year: 2007, place: 'Sumatra', Mw: 8.5 }
      ]
    }
  ],
  'AN': [
    {
      with: 'Scotia',
      eqs: [
        { year: 1929, place: 'South Sandwich Islands', Mw: 8.1 },
        { year: 2003, place: 'South Sandwich Islands', Mw: 7.6 },
        { year: 1998, place: 'Antarctic Peninsula', Mw: 8.1 }
      ]
    }
  ]
};

async function downloadTectonicPlates(): Promise<void> {
  console.log('📥 Downloading tectonic plates data...');
  
  const tempDir = join(process.cwd(), 'temp');
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  try {
    // Clone the repository to get the shapefiles
    execSync(`git clone https://github.com/fraxen/tectonicplates.git ${tempDir}/tectonicplates`, {
      stdio: 'pipe'
    });
    console.log('✅ Downloaded tectonic plates repository');
  } catch (error) {
    console.error('❌ Failed to download tectonic plates data:', error);
    throw error;
  }
}

async function convertToTopoJSON(): Promise<void> {
  console.log('🔄 Converting shapefile to TopoJSON...');
  
  const inputPath = join(process.cwd(), 'temp/tectonicplates/PB2002_plates.shp');
  const outputDir = join(process.cwd(), 'public/data');
  const outputPath = join(outputDir, 'platesTopo.json');

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Filter to major plates and convert to TopoJSON
    const plateFilter = MAJOR_PLATES.map(name => `PlateName="${name}"`).join(' || ');
    
  const command = [ 
    'npx --yes mapshaper',         
    `"${inputPath}"`, 
    `-filter '${plateFilter}'`,     
    '-dissolve PlateName',         
    '-simplify 5% keep-shapes',     
    "-each 'id=PlateName'",         
    '-o format=topojson', 
    `"${outputPath}"` 
  ].join(' ');

    execSync(command, { stdio: 'pipe' });
    
    console.log('✅ Converted to TopoJSON successfully');
  } catch (error) {
    console.error('❌ Failed to convert to TopoJSON:', error);
    throw error;
  }
}

async function createPlatesMetadata(): Promise<void> {
  console.log('📋 Creating plates metadata...');
  
  const outputPath = join(process.cwd(), 'public/data/plates.json');
  
  const platesData: PlateMeta[] = MAJOR_PLATES.map(plateName => {
    const plateId = PLATE_IDS[plateName];
    const motion = MOTION_DATA[plateId];
    const collisions = EARTHQUAKE_DATA[plateId] || [];
    
    return {
      id: plateId,
      name: plateName,
      motion: {
        vector: [motion.dx, motion.dy],
        rate: motion.rate
      },
      collisions
    };
  });

  writeFileSync(outputPath, JSON.stringify(platesData, null, 2));
  console.log('✅ Created plates metadata successfully');
}

function validateOutput(): void {
  console.log('🔍 Validating output files...');
  
  const topoPath = join(process.cwd(), 'public/data/platesTopo.json');
  const metaPath = join(process.cwd(), 'public/data/plates.json');
  
  // Validate TopoJSON file
  if (!existsSync(topoPath)) {
    throw new Error('platesTopo.json file not found');
  }
  
  const topoData = JSON.parse(readFileSync(topoPath, 'utf-8'));
  if (!topoData.objects || !topoData.objects.PB2002_plates) {
    throw new Error('Invalid TopoJSON structure');
  }
  
  const plateCount = topoData.objects.PB2002_plates.geometries?.length || 0;
  if (plateCount !== 7) {
    throw new Error(`Expected 7 plates, found ${plateCount}`);
  }
  
  // Validate metadata file
  if (!existsSync(metaPath)) {
    throw new Error('plates.json file not found');
  }
  
  const metaData = JSON.parse(readFileSync(metaPath, 'utf-8'));
  if (!Array.isArray(metaData) || metaData.length !== 7) {
    throw new Error(`Expected 7 plate metadata entries, found ${metaData.length}`);
  }
  
  // Validate each plate has required fields
  metaData.forEach((plate: PlateMeta) => {
    if (!plate.id || !plate.name || !plate.motion || plate.motion.rate <= 0) {
      throw new Error(`Invalid plate data for ${plate.name}`);
    }
  });
  
  console.log('✅ All validations passed');
}

function cleanup(): void {
  console.log('🧹 Cleaning up temporary files...');
  
  const tempDir = join(process.cwd(), 'temp');
  if (existsSync(tempDir)) {
    execSync(`rm -rf "${tempDir}"`, { stdio: 'pipe' });
  }
  
  console.log('✅ Cleanup completed');
}

async function main(): Promise<void> {
  try {
    console.log('🚀 Starting tectonic plates data pipeline...\n');
    
    await downloadTectonicPlates();
    await convertToTopoJSON();
    await createPlatesMetadata();
    validateOutput();
    cleanup();
    
    console.log('\n🎉 Data pipeline completed successfully!');
    console.log('📁 Output files:');
    console.log('   - public/data/platesTopo.json');
    console.log('   - public/data/plates.json');
    
  } catch (error) {
    console.error('\n❌ Data pipeline failed:', error);
    cleanup();
    process.exit(1);
  }
}

// ES 모듈에서 직접 실행
main();
