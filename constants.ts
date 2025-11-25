import { PartData, CameraTarget } from './types';

export const VIEW_CONFIGS: Record<string, CameraTarget> = {
  EXTERIOR: {
    // Moved camera further back [8, 5, 8] for better mobile fitting
    // Moved target Y up [0, 0.8, 0] to shift car slightly down in frame (away from header)
    position: [8, 5, 8],
    target: [0, 0.8, 0],
  },
  ENGINE: {
    position: [2.5, 3, 2.5],
    target: [1.5, 0.5, 0], // Focusing on front engine bay
  },
  AC_SYSTEM: {
    position: [1.8, 1.5, 0.5],
    target: [1.8, 0.5, 0],
  }
};

export const PARTS: Record<string, PartData> = {
  ENGINE_BLOCK: {
    id: 'engine_block',
    name: 'Engine Block (Generic)',
    description: 'The structural foundation of the engine containing cylinders and crankshaft. Common to all internal combustion vehicles.',
    color: '#7f8c8d',
    type: 'general',
    commonProblems: ['Oil gasket leaks', 'Overheating warping the head', 'Cracked block (rare)'],
  },
  BATTERY: {
    id: 'battery',
    name: '12V Car Battery',
    description: 'Standard lead-acid or AGM battery providing starting power and voltage stabilizaton.',
    color: '#2c3e50',
    type: 'general',
    commonProblems: ['Sulfation on terminals', 'Dead cell (won\'t hold charge)', 'Alternator not charging'],
  },
  COMPRESSOR: {
    id: 'compressor',
    name: 'AC Compressor',
    description: 'The pump of the AC system. It pressurizes refrigerant, circulating it through the system.',
    color: '#3498db',
    type: 'ac',
    commonProblems: ['Clutch not engaging', 'Internal piston failure (Black Death)', 'Leaking shaft seal'],
  },
  CONDENSER: {
    id: 'condenser',
    name: 'AC Condenser',
    description: 'Heat exchanger located in front of the radiator. Converts high-pressure gas to liquid.',
    color: '#2980b9',
    type: 'ac',
    commonProblems: ['Road debris punctures', 'Clogged fins reducing airflow', 'Leaking fittings'],
  },
  EVAPORATOR: {
    id: 'evaporator',
    name: 'Evaporator Core',
    description: 'Hidden under the dash. Absorbs heat from cabin air, cooling it down.',
    color: '#ecf0f1',
    type: 'ac',
    commonProblems: ['Mold/Bacteria buildup (Bad smell)', 'Refrigerant leaks (expensive fix)', 'Drain tube blockage (wet floor)'],
  },
  PIPING: {
    id: 'piping',
    name: 'Refrigerant Lines',
    description: 'Aluminum pipes and rubber hoses carrying Freon (R134a/R1234yf) between components.',
    color: '#bdc3c7',
    type: 'ac',
    commonProblems: ['Rubber hose degradation', 'O-ring failure at joints', 'Crimping leaks'],
  }
};

export const COMMON_ISSUES = [
  { id: 'ac_warm', en: 'AC Blowing Warm Air', ms: 'Aircond Keluar Angin Panas' },
  { id: 'ac_smell', en: 'Bad Smell from Vents', ms: 'Bau Busuk Masam' },
  { id: 'ac_noise', en: 'Loud Compressor Noise', ms: 'Bunyi Bising Kompresor' },
  { id: 'ac_leak', en: 'Water Leaking in Cabin', ms: 'Air Menitik Dalam Kereta' },
  { id: 'overheat', en: 'Engine Overheating w/ AC', ms: 'Suhu Naik Bila Buka Aircond' },
];

export const TRANSLATIONS = {
  en: {
    title: 'CAR INSIGHT',
    subtitle: 'AC & Engine Visualizer',
    tapHood: 'TAP TO OPEN HOOD',
    enterAC: 'ENTER AC SYSTEM',
    analyzing: 'ANALYZING COMPONENT...',
    generatingImage: 'GENERATING PHOTO...',
    getDiagnosis: 'GET AI DIAGNOSIS',
    viewRealLife: 'VIEW REAL PHOTO',
    back: 'Back',
    nav3D: '3D View',
    navIssues: 'AC Issues',
    navAI: 'AI Engine',
    welcome: 'Select Language',
    chatPlaceholder: 'Ask about car AC or engine...',
    chatTitle: 'AI Engine Helper',
    issuesTitle: 'Common AC Problems',
    tapToAsk: 'Tap an issue for diagnosis',
  },
  ms: {
    title: 'CAR INSIGHT',
    subtitle: 'Visualisasi Enjin & Aircond',
    tapHood: 'TEKAN BUKA BONET',
    enterAC: 'MASUK SISTEM AC',
    analyzing: 'MENGANALISIS...',
    generatingImage: 'MENJANA GAMBAR...',
    getDiagnosis: 'DIAGNOSIS AI',
    viewRealLife: 'LIHAT GAMBAR SEBENAR',
    back: 'Kembali',
    nav3D: 'Lihat 3D',
    navIssues: 'Masalah AC',
    navAI: 'Enjin AI',
    welcome: 'Pilih Bahasa',
    chatPlaceholder: 'Tanya pasal AC atau enjin...',
    chatTitle: 'Pembantu Enjin AI',
    issuesTitle: 'Masalah Umum Aircond',
    tapToAsk: 'Tekan isu untuk diagnosa',
  }
};