import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const researchAPI = {
  getBySlug: async (slug) => null
};

import { Compass, Radio, ChevronDown, Lightbulb, Shield, Dna, Hourglass, Flame, Ruler, ArrowUp, Scale, Gauge } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import jungleBg from '../assets/prehistoric_jungle_bg.png';

// Local specimen database for fallback offline mode
const LOCAL_SPECIMENS = {
  'tyrannosaurus-rex': {
    name: 'Tyrannosaurus Rex',
    scientific_name: 'Tyrannosaurus rex',
    era: 'Mesozoic',
    period: 'Late Cretaceous',
    million_years_ago: 66,
    diet: 'Carnivore',
    habitat: 'Terrestrial (North America)',
    description: 'Dominating its ecosystem as an apex predator, the Tyrannosaurus Rex possessed one of the strongest bite forces in terrestrial history. With its massive skull, muscular build, and finely-tuned senses, it ruled the forested river valleys and coastal plains with absolute authority.'
  },
  'triceratops-horridus': {
    name: 'Triceratops Horridus',
    scientific_name: 'Triceratops horridus',
    era: 'Mesozoic',
    period: 'Late Cretaceous',
    million_years_ago: 68,
    diet: 'Herbivore',
    habitat: 'Terrestrial (North America)',
    description: 'Triceratops is a genus of herbivorous ceratopsid dinosaur that first appeared during the late Cretaceous period. Bearing a large bony frill, three horns on the skull, and a large four-legged body, Triceratops is one of the most recognizable of all dinosaurs and the most well-known ceratopsid.'
  },
  'stegosaurus-stenops': {
    name: 'Stegosaurus Stenops',
    scientific_name: 'Stegosaurus stenops',
    era: 'Mesozoic',
    period: 'Late Jurassic',
    million_years_ago: 150,
    diet: 'Herbivore',
    habitat: 'Terrestrial (North America / Europe)',
    description: 'Stegosaurus is a genus of herbivorous thyreophoran dinosaur. They lived during the Late Jurassic period, in what is now western North America. Due to its distinctive tail spikes and plates, Stegosaurus is one of the most recognizable kinds of dinosaurs.'
  }
};

const getDinoImageUrl = (specimen) => {
  if (!specimen) return null;
  let filename = specimen.image || '';
  if (!filename || filename === '/') {
    const nameLower = specimen.name.toLowerCase();
    if (nameLower.includes('tyrannosaurus')) {
      filename = 'Tyrannosaurus rex.png';
    } else if (nameLower.includes('stegosaurus')) {
      filename = 'Stegosaurus.png';
    } else if (nameLower.includes('triceratops')) {
      filename = 'Triceratops.png';
    } else if (nameLower.includes('velociraptor')) {
      filename = 'Velociraptor.png';
    } else if (nameLower.includes('ankylosaurus')) {
      filename = 'Ankylosaurus.png';
    } else if (nameLower.includes('parasaurolophus')) {
      filename = 'Parasaurolophus.png';
    } else if (nameLower.includes('brachiosaurus')) {
      filename = 'Brachiosaurus.png';
    } else if (nameLower.includes('spinosaurus')) {
      filename = 'Spinosaurus.png';
    } else if (nameLower.includes('allosaurus')) {
      filename = 'Allosaurus.png';
    } else if (nameLower.includes('carnotaurus')) {
      filename = 'Carnotaurus.png';
    } else {
      const firstWord = specimen.name.split(' ')[0];
      filename = `${firstWord}.png`;
    }
  }
  if (filename.includes('/')) {
    filename = filename.substring(filename.lastIndexOf('/') + 1);
  }
  try {
    return new URL(`../assets/Dinosaurs_Images/${filename}`, import.meta.url).href;
  } catch (e) {
    return null;
  }
};

export default function DinosaurSlugSection() {
  const { slug } = useParams();
  const { isAdmin } = useAuth();
  
  const [specimen, setSpecimen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fossilModalOpen, setFossilModalOpen] = useState(false);
  const [dnaModalOpen, setDnaModalOpen] = useState(false);
  const [behaviourModalOpen, setBehaviourModalOpen] = useState(false);

  useEffect(() => {
    const fetchSpecimen = async () => {
      setLoading(true);
      try {
        const data = await researchAPI.getBySlug(slug);
        if (!data || typeof data !== 'object' || !data.name) {
          throw new Error('Invalid JSON response or HTML document returned from proxy endpoint');
        }
        setSpecimen(data);
        setUsingFallback(false);
      } catch (err) {
        console.warn("API error fetching specimen, trying local fallback:", err);
        const localData = LOCAL_SPECIMENS[slug];
        if (localData) {
          setSpecimen(localData);
          setUsingFallback(true);
        } else {
          console.error("No local fallback data for slug:", slug);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSpecimen();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-12 h-12 border-4 border-[#c5a880]/10 border-t-[#c5a880] rounded-full animate-spin" />
        <p className="text-xs font-semibold tracking-[0.2em] text-[#c5a880] animate-pulse">
          SCANNING SPECIMEN GRID ARCHIVE...
        </p>
      </div>
    );
  }

  if (!specimen) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center bg-[#0a0f0d] border border-white/5 rounded-lg shadow-2xl flex flex-col items-center mt-12">
        <Radio size={48} color="#e11d48" className="mb-6 opacity-80" />
        <h2 className="text-2xl font-serif text-white tracking-wide">Specimen Dossier Lost</h2>
        <p className="my-4 text-sm text-[#94a3b8]">This classification has not yet been logged in the archives.</p>
        <Link to="/research" className="inline-block px-8 py-3 bg-[#121815] border border-[#c5a880]/40 text-[#c5a880] text-sm uppercase tracking-wider font-semibold rounded-sm transition duration-300 hover:bg-[#c5a880] hover:text-black">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const imageUrl = getDinoImageUrl(specimen);

  // Dynamic values based on spec data
  const stats = specimen.physical_stats || {};
  
  const lengthM = stats.length_m || specimen.length_meters || 12.3;
  const lengthFt = Math.round(lengthM * 3.28);
  
  const weightTons = stats.weight_tons || (specimen.weight_kg ? (specimen.weight_kg / 1000).toFixed(1) : "8.4");
  const weightLbs = Math.round(weightTons * 2204.6);
  
  let heightM = stats.height_m || specimen.height_meters || (lengthM * 0.32).toFixed(1);
  let heightFt = Math.round(heightM * 3.28);
  
  // Bite Force (can be int or string)
  let biteForce = stats.bite_force_psi 
    ? `${stats.bite_force_psi.toLocaleString()} PSI` 
    : (specimen.bite_force_newtons 
       ? `${Math.round(specimen.bite_force_newtons * 0.145).toLocaleString()} PSI` 
       : null);
       
  // Speed
  let speed = stats.speed_kmph 
    ? `${stats.speed_kmph} km/h` 
    : (specimen.speed_kmph 
       ? `${specimen.speed_kmph} km/h` 
       : null);

  // Fallbacks if not retrieved
  if (!biteForce || biteForce === "0 PSI") {
    if (specimen.name.toLowerCase().includes('tyrannosaurus')) {
      biteForce = "12,800 PSI";
    } else if (specimen.name.toLowerCase().includes('stegosaurus')) {
      biteForce = "0 PSI";
    } else if (specimen.name.toLowerCase().includes('triceratops')) {
      biteForce = "0 PSI";
    } else if (specimen.diet && specimen.diet.toLowerCase() === 'carnivore') {
      biteForce = "4,500 PSI";
    } else {
      biteForce = "0 PSI";
    }
  }

  if (!speed) {
    if (specimen.name.toLowerCase().includes('tyrannosaurus')) {
      speed = "20–27 km/h";
    } else if (specimen.name.toLowerCase().includes('stegosaurus')) {
      speed = "6–8 km/h";
    } else if (specimen.name.toLowerCase().includes('triceratops')) {
      speed = "24–32 km/h";
    } else if (specimen.diet && specimen.diet.toLowerCase() === 'carnivore') {
      speed = "30–40 km/h";
    } else {
      speed = "15–20 km/h";
    }
  }

  // Dynamic classification breadcrumbs
  const dbClass = specimen.classification || {};
  let classification = {
    kingdom: dbClass.kingdom || "Animalia",
    phylum: dbClass.phylum || "Chordata",
    class: dbClass.class_name || dbClass.class || "Reptilia",
    order: dbClass.order || (specimen.name.toLowerCase().includes('tyrannosaurus') ? "Saurischia" : "Ornithischia"),
    family: dbClass.family || (specimen.name.toLowerCase().includes('tyrannosaurus') ? "Tyrannosauridae" : "Stegosauridae"),
    genus: dbClass.genus || specimen.name.split(' ')[0],
    species: dbClass.species || (specimen.name.toLowerCase().includes('tyrannosaurus') ? "T. rex" : "specimen")
  };

  return (
    <div 
      className="min-h-screen bg-[#070b09] text-[#e2e8f0] font-sans selection:bg-[#c5a880] selection:text-black relative flex flex-col items-center w-full overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(14, 25, 20, 0.82) 0%, rgba(8, 14, 11, 0.96) 100%), url(${jungleBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Subtle Gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,15,13,0.3)_80%,#070b09_100%)] pointer-events-none z-10" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 w-full z-20 flex flex-col gap-12">
        
        {/* Back Navigation Link */}
        <div className="w-full">
          <Link to="/research" className="text-xs uppercase tracking-[0.25em] text-[#c5a880] hover:text-white transition duration-300 flex items-center gap-2 font-semibold">
            ← Back to Expedition
          </Link>
        </div>

        {/* TOP ROW: Specimen details split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
          
          {/* Left Column: Title, Quick Badges, About Block */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-center">
            
            {/* Era & Period Badge Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] font-semibold block">
                  {specimen.era} Era • {specimen.period || 'Mesozoic Period'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white uppercase leading-tight font-serif">
                {specimen.name}
              </h1>
              <p className="text-sm italic text-[#c5a880]/90 font-serif">
                "{specimen.scientific_name ? `The ${specimen.scientific_name}` : 'The Ancient Specimen King'}"
              </p>
            </div>

            {/* Quick Stat Badges horizontal list */}
            <div className="flex flex-wrap gap-3">
              {/* Timeline Stat */}
              <div className="bg-gradient-to-br from-[#1b2a22]/70 to-[#0e1613]/90 border border-[#c5a880]/20 border-l-2 border-l-[#c5a880] px-4 py-2.5 rounded-sm flex items-center gap-3 text-xs shadow-md shadow-black/25 hover:border-[#c5a880]/40 transition duration-300 group/pill">
                <Hourglass size={14} className="text-[#c5a880] drop-shadow-[0_0_5px_rgba(197,168,128,0.5)] group-hover/pill:rotate-12 transition-transform duration-300" />
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-white/40 block leading-none uppercase">Timeline</span>
                  <span className="font-semibold text-white/95 font-serif text-[11px] leading-normal pt-0.5 block">{specimen.million_years_ago || '66'}M Years Ago</span>
                </div>
              </div>

              {/* Diet Stat */}
              <div className="bg-gradient-to-br from-[#1b2a22]/70 to-[#0e1613]/90 border border-[#c5a880]/20 border-l-2 border-l-[#c5a880] px-4 py-2.5 rounded-sm flex items-center gap-3 text-xs shadow-md shadow-black/25 hover:border-[#c5a880]/40 transition duration-300 group/pill">
                <Flame size={14} className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] group-hover/pill:scale-110 transition-transform duration-300" />
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#c5a880]/70 block leading-none uppercase">Diet</span>
                  <span className="font-semibold text-white/95 font-serif text-[11px] leading-normal pt-0.5 block capitalize">{specimen.diet}</span>
                </div>
              </div>

              {/* Habitat Stat */}
              <div className="bg-gradient-to-br from-[#1b2a22]/70 to-[#0e1613]/90 border border-[#c5a880]/20 border-l-2 border-l-[#c5a880] px-4 py-2.5 rounded-sm flex items-center gap-3 text-xs shadow-md shadow-black/25 hover:border-[#c5a880]/40 transition duration-300 group/pill">
                <Compass size={14} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] group-hover/pill:rotate-45 transition-transform duration-500" />
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-white/40 block leading-none uppercase">Habitat</span>
                  <span className="font-semibold text-white/95 font-serif text-[11px] leading-normal pt-0.5 block truncate max-w-[85px]">{specimen.habitat ? specimen.habitat.split(' ')[0] : 'Terrestrial'}</span>
                </div>
              </div>
            </div>

            {/* About Block */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-bold">About</h3>
              <p className="text-sm text-white/70 leading-relaxed font-light">
                {specimen.description}
              </p>
              <button className="text-xs uppercase tracking-wider text-[#c5a880] hover:text-white flex items-center gap-1 mt-2 transition duration-300">
                Read More <ChevronDown size={12} />
              </button>
            </div>

          </div>

          {/* Middle Column: Scanning Viewfinder image render */}
          <div className="lg:col-span-5 flex justify-center items-center relative w-full">
            <div className="absolute w-[85%] h-[85%] bg-[#c5a880]/3 blur-[130px] rounded-full pointer-events-none" />
            
            {/* Viewfinder scanner container */}
            <div className="relative group w-full aspect-[4/3] flex items-center justify-center bg-[#121c17]/35 border border-[#c5a880]/20 p-2 rounded-sm shadow-[0_25px_50px_rgba(0,0,0,0.85)] overflow-hidden">
              {/* Corner ticks */}
              <div className="absolute top-2 left-2 text-[#c5a880]/50 font-mono text-xs select-none pointer-events-none">┌</div>
              <div className="absolute top-2 right-2 text-[#c5a880]/50 font-mono text-xs select-none pointer-events-none">┐</div>
              <div className="absolute bottom-2 left-2 text-[#c5a880]/50 font-mono text-xs select-none pointer-events-none">└</div>
              <div className="absolute bottom-2 right-2 text-[#c5a880]/50 font-mono text-xs select-none pointer-events-none">┘</div>

              <img 
                src={imageUrl} 
                alt={`${specimen.name} profile view`}
                className="object-contain max-h-[380px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.95)] filter contrast-[1.03] brightness-[0.98] group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer z-10"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Right Column: Quick Facts vertical list panel */}
          <div className="lg:col-span-3 bg-[#121c17]/40 border border-white/10 p-6 rounded-sm shadow-xl space-y-6 w-full">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-bold border-b border-white/10 pb-3">
              Quick Facts
            </h3>
            
            <div className="space-y-4">
              {/* Stat 1: Length */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <Ruler size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none">Length</span>
                  <span className="text-sm font-semibold text-white">{lengthM} m</span>
                  <span className="text-[10px] text-white/50 ml-1">({lengthFt} ft)</span>
                </div>
              </div>

              {/* Stat 2: Height */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <ArrowUp size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none">Height</span>
                  <span className="text-sm font-semibold text-white">{heightM} m</span>
                  <span className="text-[10px] text-white/50 ml-1">({heightFt} ft)</span>
                </div>
              </div>

              {/* Stat 3: Weight */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <Scale size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none">Weight</span>
                  <span className="text-sm font-semibold text-white">{weightTons} Tons</span>
                  <span className="text-[10px] text-white/50 block font-light leading-tight">Approx.</span>
                </div>
              </div>

              {/* Stat 4: Bite Force */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <Shield size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none">Bite Force</span>
                  <span className="text-sm font-semibold text-white">{biteForce}</span>
                  <span className="text-[10px] text-white/50 block font-light leading-tight">Estimated</span>
                </div>
              </div>

              {/* Stat 5: Speed */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <Gauge size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none">Speed</span>
                  <span className="text-sm font-semibold text-white">{speed}</span>
                  <span className="text-[10px] text-white/50 block font-light leading-tight">Estimated</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* MIDDLE SECTION: 3-Column Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Card 1: Fossil Evidence */}
          <div className="premium-dossier-card p-6 flex flex-col gap-4 justify-between relative group/card">
            {/* Corner brackets */}
            <div className="absolute top-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┌</div>
            <div className="absolute top-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┐</div>
            <div className="absolute bottom-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">└</div>
            <div className="absolute bottom-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┘</div>

            {/* Scientific telemetry tags */}
            <div className="absolute top-5 right-5 text-[8px] font-mono text-white/30 tracking-widest pointer-events-none">
              [REG_FOS_01]
            </div>

            <div className="space-y-3">
              <div className="card-header-badge py-1.5 px-3 rounded-sm self-start inline-block">
                <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-bold">Fossil Evidence</h4>
              </div>
              <div className="w-full bg-gradient-to-b from-black/60 to-black/45 bg-[radial-gradient(rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:16px_16px] rounded-sm p-3 flex justify-center items-center border border-white/5 shadow-inner">
                <svg viewBox="0 0 100 100" className="w-full h-24 stroke-[#c5a880] fill-none opacity-85 group-hover/card:opacity-100 transition-opacity duration-300 glow-gold" strokeWidth="1.5">
                  <path d="M20,60 Q30,40 60,35 Q80,35 85,50 Q85,65 70,68 L50,68 L45,80 Q35,82 25,75 Z" />
                  <path d="M30,68 C40,68 55,60 65,60 M65,45 Q70,48 70,52 Z" />
                  <circle cx="58" cy="48" r="3" fill="#c5a880" className="animate-pulse" />
                  <path d="M35,68 L38,71 L41,68 L44,71 L47,68 L50,71" />
                </svg>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light pt-1">
                Numerous nearly complete skeletons have been discovered, giving us one of the most well-understood dinosaurs in paleontology history.
              </p>
            </div>
            <button 
              onClick={() => setFossilModalOpen(true)}
              className="text-[9px] uppercase tracking-wider font-semibold border border-[#c5a880]/30 bg-[#0d1612]/90 px-4 py-2.5 rounded-sm text-[#c5a880] hover:bg-[#c5a880] hover:text-black hover:border-transparent transition-all duration-300 mt-2 self-start flex items-center gap-1 shadow-lg"
            >
              <span>View Fossils</span>
              <span className="text-[8px] font-sans">↗</span>
            </button>
          </div>

          {/* Card 2: DNA Insights */}
          <div className="premium-dossier-card p-6 flex flex-col gap-4 justify-between relative group/card">
            {/* Corner brackets */}
            <div className="absolute top-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┌</div>
            <div className="absolute top-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┐</div>
            <div className="absolute bottom-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">└</div>
            <div className="absolute bottom-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┘</div>

            {/* Scientific telemetry tags */}
            <div className="absolute top-5 right-5 text-[8px] font-mono text-white/30 tracking-widest pointer-events-none">
              [REG_DNA_02]
            </div>

            <div className="space-y-3">
              <div className="card-header-badge py-1.5 px-3 rounded-sm self-start inline-block">
                <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-bold">DNA Insights</h4>
              </div>
              <div className="w-full bg-gradient-to-b from-black/60 to-black/45 bg-[radial-gradient(rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:16px_16px] rounded-sm p-3 flex justify-center items-center border border-white/5 shadow-inner">
                <svg viewBox="0 0 100 100" className="w-full h-24 stroke-cyan-400 fill-none opacity-85 group-hover/card:opacity-100 transition-opacity duration-300 glow-cyan" strokeWidth="1.5">
                  <path d="M20,30 C35,40 45,60 50,68 C55,75 65,75 80,65" />
                  <path d="M20,70 C35,75 45,75 50,68 C55,60 65,40 80,30" />
                  <line x1="28" y1="36" x2="28" y2="64" />
                  <line x1="38" y1="44" x2="38" y2="72" />
                  <line x1="48" y1="52" x2="48" y2="74" />
                  <line x1="58" y1="64" x2="58" y2="40" />
                  <line x1="68" y1="70" x2="68" y2="34" />
                </svg>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light pt-1">
                Advanced studies of soft tissues and proteins continue to reveal fascinating genetic codes about evolutionary growth and behavior.
              </p>
            </div>
            <button 
              onClick={() => setDnaModalOpen(true)}
              className="text-[9px] uppercase tracking-wider font-semibold border border-[#c5a880]/30 bg-[#0d1612]/90 px-4 py-2.5 rounded-sm text-[#c5a880] hover:bg-[#c5a880] hover:text-black hover:border-transparent transition-all duration-300 mt-2 self-start flex items-center gap-1 shadow-lg"
            >
              <span>DNA Report</span>
              <span className="text-[8px] font-sans">∨</span>
            </button>
          </div>

          {/* Card 3: Behavior & Lifestyle */}
          <div className="premium-dossier-card p-6 flex flex-col gap-4 justify-between relative group/card">
            {/* Corner brackets */}
            <div className="absolute top-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┌</div>
            <div className="absolute top-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┐</div>
            <div className="absolute bottom-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">└</div>
            <div className="absolute bottom-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┘</div>

            {/* Scientific telemetry tags */}
            <div className="absolute top-5 right-5 text-[8px] font-mono text-white/30 tracking-widest pointer-events-none">
              [REG_BEH_03]
            </div>

            <div className="space-y-3">
              <div className="card-header-badge py-1.5 px-3 rounded-sm self-start inline-block">
                <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-bold">Behavior & Lifestyle</h4>
              </div>
              <div className="w-full bg-gradient-to-b from-black/60 to-black/45 bg-[radial-gradient(rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:16px_16px] rounded-sm p-3 flex justify-center items-center border border-white/5 shadow-inner">
                <svg viewBox="0 0 100 100" className="w-full h-24 stroke-amber-500 fill-none opacity-85 group-hover/card:opacity-100 transition-opacity duration-300 glow-amber" strokeWidth="1.5">
                  <path d="M50,70 L45,52 L35,42 Q40,38 50,46 Q60,38 65,42 L55,52 Z" fill="rgba(245, 158, 11, 0.05)" />
                  <path d="M50,70 L50,56" />
                  <circle cx="50" cy="74" r="3" fill="rgba(245, 158, 11, 0.2)" />
                </svg>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light pt-1">
                Evidence suggests this specimen was a solitary hunter with exceptional biological senses, strength, and vast territorial range.
              </p>
            </div>
            <button 
              onClick={() => setBehaviourModalOpen(true)}
              className="text-[9px] uppercase tracking-wider font-semibold border border-[#c5a880]/30 bg-[#0d1612]/90 px-4 py-2.5 rounded-sm text-[#c5a880] hover:bg-[#c5a880] hover:text-black hover:border-transparent transition-all duration-300 mt-2 self-start flex items-center gap-1 shadow-lg"
            >
              <span>Learn More</span>
              <span className="text-[8px] font-sans">↗</span>
            </button>
          </div>

        </div>

        {/* BOTTOM ROW: Fun Fact, Classification, Conservation Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
          
          {/* Panel 1: Fun Fact */}
          <div className="lg:col-span-4 premium-dossier-card p-6 flex items-start gap-4 shadow-xl">
            <span className="text-2xl text-[#c5a880] bg-[#0d1511]/85 w-12 h-12 rounded-sm flex items-center justify-center border border-[#c5a880]/20 shrink-0 shadow-inner glow-gold">
              💡
            </span>
            <div className="space-y-1">
              <div className="card-header-badge py-0.5 px-2 rounded-sm self-start inline-block">
                <h5 className="text-[10px] uppercase tracking-wider text-[#c5a880] font-bold">Fun Fact</h5>
              </div>
              <p className="text-xs text-white/70 leading-relaxed pt-1.5">
                T. rex's bite was so powerful that it could crush bone with ease, exercising over 12,000 pounds of pressure!
              </p>
            </div>
          </div>

          {/* Panel 2: Classification Details */}
          <div className="lg:col-span-5 premium-dossier-card p-6 flex flex-col justify-between gap-3 shadow-xl">
            <div className="card-header-badge py-0.5 px-2 rounded-sm self-start inline-block">
              <h5 className="text-[10px] uppercase tracking-wider text-[#c5a880] font-bold">
                Classification
              </h5>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-white/80 font-mono pt-1">
              <div><span className="text-white/40">Kingdom:</span> {classification.kingdom}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Phylum:</span> {classification.phylum}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Class:</span> {classification.class}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Order:</span> {classification.order}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Family:</span> {classification.family}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Genus:</span> {classification.genus}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Species:</span> {classification.species}</div>
            </div>
          </div>

          {/* Panel 3: Conservation Status */}
          <div className="lg:col-span-3 premium-dossier-card p-6 flex items-center gap-4 shadow-xl">
            <span className="text-2xl text-[#c5a880] bg-[#0d1511]/85 w-12 h-12 rounded-sm flex items-center justify-center border border-[#c5a880]/20 shrink-0 shadow-inner glow-amber">
              🛡️
            </span>
            <div className="space-y-1">
              <h5 className="text-[10px] uppercase tracking-wider text-white/40 leading-none">Conservation Status</h5>
              <p className="text-lg font-bold text-white tracking-wide uppercase leading-none font-serif pt-1.5">Extinct</p>
              <p className="text-[10px] text-white/50 leading-none pt-1">
                {specimen.conservation?.extinction_million_years_ago || specimen.million_years_ago || '65'} million years ago
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Fossil Evidence Modal Popup */}
      {fossilModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-6">
          <div 
            className="border border-[#c5a880]/30 max-w-lg w-full p-6 md:p-8 rounded-sm relative shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(197,168,128,0.15)] flex flex-col gap-4 animate-scale-in"
            style={{ 
              background: 'radial-gradient(circle at 10% 10%, rgba(197, 168, 128, 0.12) 0%, rgba(15, 23, 19, 0.8) 50%, rgba(7, 12, 10, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 text-[#c5a880]/40 font-mono text-xs select-none pointer-events-none">┌</div>
            <div className="absolute top-2 right-2 text-[#c5a880]/40 font-mono text-xs select-none pointer-events-none">┐</div>
            <div className="absolute bottom-2 left-2 text-[#c5a880]/40 font-mono text-xs select-none pointer-events-none">└</div>
            <div className="absolute bottom-2 right-2 text-[#c5a880]/40 font-mono text-xs select-none pointer-events-none">┘</div>

            {/* Close Button */}
            <button 
              onClick={() => setFossilModalOpen(false)}
              className="absolute top-4 right-4 text-[#c5a880]/70 hover:text-white transition duration-300 font-mono text-sm border border-[#c5a880]/20 bg-[#0d1612]/80 w-7 h-7 flex items-center justify-center rounded-sm shadow-md"
            >
              ✕
            </button>

            <div className="card-header-badge py-1.5 px-3 rounded-sm self-start inline-block">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[#c5a880] font-bold">Fossil Telemetry Dossier</h3>
            </div>

            <p className="text-xs text-white/60 font-light leading-relaxed">
              {specimen.fossil_evidence?.summary || 'Standard database fossil registry details. Excavated skeleton specimens cataloged below.'}
            </p>

            <div className="space-y-3 mt-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {specimen.fossil_evidence?.discoveries && specimen.fossil_evidence.discoveries.length > 0 ? (
                specimen.fossil_evidence.discoveries.map((disc, idx) => (
                  <div key={idx} className="bg-black/35 border border-white/5 p-4 rounded-sm space-y-2 relative">
                    <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-widest text-[#c5a880]">
                      <span>Discovery #{idx + 1}</span>
                      <span>{disc.year || 'N/A'}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/95">{disc.location || 'Unknown location'}</p>
                    <p className="text-xs text-white/50">Lead Paleontologist: {disc.discovered_by || 'Unknown'}</p>
                  </div>
                ))
              ) : (
                <div className="bg-black/35 border border-white/5 p-4 rounded-sm space-y-2 relative">
                  <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-widest text-[#c5a880]">
                    <span>Registry Scan</span>
                    <span>{specimen.discovery_year || '1902'}</span>
                  </div>
                  <p className="text-sm font-semibold text-white/95">{specimen.region || 'North America'}</p>
                  <p className="text-xs text-white/50">Lead Paleontologist: {specimen.discovered_by || 'Barnum Brown'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DNA Report Modal Popup */}
      {dnaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-6">
          <div 
            className="border border-cyan-500/30 max-w-lg w-full p-6 md:p-8 rounded-sm relative shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(34,211,238,0.15)] flex flex-col gap-4 animate-scale-in"
            style={{ 
              background: 'radial-gradient(circle at 10% 10%, rgba(34, 211, 238, 0.12) 0%, rgba(15, 23, 19, 0.8) 50%, rgba(7, 12, 10, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 text-cyan-400/40 font-mono text-xs select-none pointer-events-none">┌</div>
            <div className="absolute top-2 right-2 text-cyan-400/40 font-mono text-xs select-none pointer-events-none">┐</div>
            <div className="absolute bottom-2 left-2 text-cyan-400/40 font-mono text-xs select-none pointer-events-none">└</div>
            <div className="absolute bottom-2 right-2 text-cyan-400/40 font-mono text-xs select-none pointer-events-none">┘</div>

            {/* Close Button */}
            <button 
              onClick={() => setDnaModalOpen(false)}
              className="absolute top-4 right-4 text-cyan-400/70 hover:text-white transition duration-300 font-mono text-sm border border-cyan-500/20 bg-[#0d1612]/80 w-7 h-7 flex items-center justify-center rounded-sm shadow-md"
            >
              ✕
            </button>

            <div className="py-1.5 px-3 rounded-sm self-start inline-block border-l-2 border-cyan-400 bg-gradient-to-r from-cyan-400/10 to-transparent">
              <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">DNA Sequencing Report</h3>
            </div>

            <div className="flex justify-between items-center bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-sm text-xs mt-1">
              <span className="text-white/40 uppercase font-mono tracking-wider">Sequence Status</span>
              <span className="text-cyan-400 font-mono font-bold tracking-widest uppercase">
                {specimen.dna_insights?.status || 'Segmented'}
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-light">
              {specimen.dna_insights?.summary || 'Helix mapping successfully accomplished. Diagnostic readings indicate normal sequence continuity and stable core cellular structure.'}
            </p>

            <div className="space-y-2 mt-1">
              <div className="text-[9px] uppercase font-mono tracking-widest text-cyan-400/60">Live Sequencing Grid Feed</div>
              <div className="font-mono text-[9px] tracking-widest text-cyan-400 bg-black/45 p-4 rounded-sm border border-cyan-500/20 max-h-24 overflow-hidden relative leading-tight select-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/75 pointer-events-none" />
                A T T C G G A T C C G G T A A T C G G A T T C G A T T C G A T C G G A T T C G A T T C G<br/>
                C G T T A G C C G T T A A C G T T A A C C G G T A A C G C G T C C A A T T G G C C G T C<br/>
                G C G C T T A G C G A T C G A T C G A T C G A T C G A T C G A T C G A T C G A T C G T T
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Behavior & Lifestyle Modal Popup */}
      {behaviourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-6">
          <div 
            className="border border-amber-500/30 max-w-lg w-full p-6 md:p-8 rounded-sm relative shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.15)] flex flex-col gap-4 animate-scale-in"
            style={{ 
              background: 'radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 19, 0.8) 50%, rgba(7, 12, 10, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 text-amber-500/40 font-mono text-xs select-none pointer-events-none">┌</div>
            <div className="absolute top-2 right-2 text-amber-500/40 font-mono text-xs select-none pointer-events-none">┐</div>
            <div className="absolute bottom-2 left-2 text-amber-500/40 font-mono text-xs select-none pointer-events-none">└</div>
            <div className="absolute bottom-2 right-2 text-amber-500/40 font-mono text-xs select-none pointer-events-none">┘</div>

            {/* Close Button */}
            <button 
              onClick={() => setBehaviourModalOpen(false)}
              className="absolute top-4 right-4 text-amber-500/70 hover:text-white transition duration-300 font-mono text-sm border border-amber-500/20 bg-[#0d1612]/80 w-7 h-7 flex items-center justify-center rounded-sm shadow-md"
            >
              ✕
            </button>

            <div className="py-1.5 px-3 rounded-sm self-start inline-block border-l-2 border-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent">
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-500 font-bold">Behavior & Lifestyle Dossier</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm">
                <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider">Hunting Style</span>
                <span className="text-xs text-white/90 font-medium capitalize">{specimen.behaviour?.hunting_style || 'Apex pack/solitary hunter'}</span>
              </div>
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm">
                <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider">Social Structure</span>
                <span className="text-xs text-white/90 font-medium capitalize">{specimen.behaviour?.social_behavior || 'Highly territorial / solitary'}</span>
              </div>
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm sm:col-span-2">
                <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider">Cognitive Evaluation</span>
                <span className="text-xs text-white/90 font-medium">{specimen.behaviour?.intelligence || 'High tactical adaptability'}</span>
              </div>
            </div>

            {/* Prey List */}
            {specimen.behaviour?.prey && specimen.behaviour.prey.length > 0 && (
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm">
                <span className="text-[9px] font-mono text-amber-500 block uppercase tracking-wider mb-1">Target Prey Species</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {specimen.behaviour.prey.map((item, idx) => (
                    <span key={idx} className="bg-amber-950/20 border border-amber-500/10 text-white/80 font-mono text-[9px] px-2 py-0.5 rounded-sm uppercase">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Competitors List */}
            {specimen.behaviour?.predators && specimen.behaviour.predators.length > 0 && (
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm">
                <span className="text-[9px] font-mono text-red-400 block uppercase tracking-wider mb-1">Competitors / Predators</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {specimen.behaviour.predators.map((item, idx) => (
                    <span key={idx} className="bg-red-950/20 border border-red-500/10 text-red-300/90 font-mono text-[9px] px-2 py-0.5 rounded-sm uppercase">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .premium-dossier-card {
          position: relative;
          background: radial-gradient(circle at 10% 20%, rgba(24, 42, 33, 0.8) 0%, rgba(10, 16, 13, 0.95) 100%);
          border: 1px solid rgba(197, 168, 128, 0.2);
          border-radius: 2px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .premium-dossier-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(197, 168, 128, 0.45), transparent);
          z-index: 10;
        }
        .premium-dossier-card:hover {
          transform: translateY(-5px);
          border-color: rgba(197, 168, 128, 0.65);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(197, 168, 128, 0.22);
        }
        .card-header-badge {
          background: linear-gradient(90deg, rgba(197, 168, 128, 0.15) 0%, transparent 100%);
          border-left: 3px solid #c5a880;
        }
        .glow-gold {
          filter: drop-shadow(0 0 8px rgba(197, 168, 128, 0.75));
        }
        .glow-cyan {
          filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.75));
        }
        .glow-amber {
          filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.75));
        }
        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(197,168,128,0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(197,168,128,0.5);
        }
      `}</style>
    </div>
  );
}
