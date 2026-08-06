import { API_URL } from "../config/api";
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Compass, Radio, ChevronDown, Lightbulb, Shield, Dna, Hourglass, Flame, Ruler, ArrowUp, Scale, Gauge, Play, Box } from 'lucide-react';
import jungleBg from '../assets/prehistoric_jungle_bg.png';

import trexImg from '../assets/Dinosaurs_Images/Tyrannosaurus rex.png';
import triceratopsImg from '../assets/Dinosaurs_Images/Triceratops.png';
import velociraptorImg from '../assets/Dinosaurs_Images/Velociraptor.png';
import spinosaurusImg from '../assets/Dinosaurs_Images/Spinosaurus.png';
import brachiosaurusImg from '../assets/Dinosaurs_Images/Brachiosaurus.png';
import stegosaurusImg from '../assets/Dinosaurs_Images/Stegosaurus.png';
import ankylosaurusImg from '../assets/Dinosaurs_Images/Ankylosaurus.png';
import parasaurolophusImg from '../assets/Dinosaurs_Images/Parasaurolophus.png';
import carnotaurusImg from '../assets/Dinosaurs_Images/Carnotaurus.png';
import allosaurusImg from '../assets/Dinosaurs_Images/Allosaurus.png';

// Local specimen database for fallback offline mode
const LOCAL_SPECIMENS = {
  'tyrannosaurus-rex': {
    slug: 'tyrannosaurus-rex',
    name: 'Tyrannosaurus Rex',
    scientific_name: 'Tyrannosaurus rex',
    era: 'Mesozoic',
    period: 'Late Cretaceous',
    million_years_ago: 66,
    diet: 'Carnivore',
    habitat: 'Terrestrial (North America)',
    description: 'Dominating its ecosystem as an apex predator, the Tyrannosaurus Rex possessed one of the strongest bite forces in terrestrial history. With its massive skull, muscular build, and finely-tuned senses, it ruled the forested river valleys and coastal plains with absolute authority.',
    length: '12.3 m',
    weight: '8.4 Tons',
    height: '4 m',
    speed: '27 km/h',
    bite_force_psi: 12800,
  },
  'triceratops': {
    slug: 'triceratops',
    name: 'Triceratops Horridus',
    scientific_name: 'Triceratops horridus',
    era: 'Mesozoic',
    period: 'Late Cretaceous',
    million_years_ago: 68,
    diet: 'Herbivore',
    habitat: 'Terrestrial (North America)',
    description: 'Triceratops is a genus of herbivorous ceratopsid dinosaur that first appeared during the late Cretaceous period. Bearing a large bony frill, three horns on the skull, and a large four-legged body, Triceratops is one of the most recognizable of all dinosaurs and the most well-known ceratopsid.',
    length: '9.0 m',
    weight: '6.0 Tons',
    height: '3 m',
    speed: '32 km/h',
    bite_force_psi: 0,
  },
  'velociraptor': {
    slug: 'velociraptor',
    name: 'Velociraptor Mongoliensis',
    scientific_name: 'Velociraptor mongoliensis',
    era: 'Mesozoic',
    period: 'Late Cretaceous',
    million_years_ago: 75,
    diet: 'Carnivore',
    habitat: 'Terrestrial (Asia)',
    description: 'Velociraptor was a genus of dromaeosaurid theropod dinosaur that lived approximately 75 to 71 million years ago during the latter part of the Cretaceous Period. A bipedal, feathered carnivore with a long tail and an enlarged sickle-shaped claw on each hindfoot, which is thought to have been used to tackle and displace prey.',
    length: '2.0 m',
    weight: '0.015 Tons',
    height: '0.5 m',
    speed: '40 km/h',
    bite_force_psi: 800,
  }
};

const LOCAL_IMAGES = {
  "tyrannosaurus-rex": trexImg,
  "triceratops": triceratopsImg,
  "velociraptor": velociraptorImg,
  "spinosaurus": spinosaurusImg,
  "brachiosaurus": brachiosaurusImg,
  "stegosaurus": stegosaurusImg,
  "ankylosaurus": ankylosaurusImg,
  "parasaurolophus": parasaurolophusImg,
  "carnotaurus": carnotaurusImg,
  "allosaurus": allosaurusImg,
};

const DOCUMENTARY_VIDEOS = {
  "tyrannosaurus-rex": "https://www.youtube.com/embed/aYV3DkMvW0E",
  "triceratops": "https://www.youtube.com/embed/5D3x5a9aK9g",
  "velociraptor": "https://www.youtube.com/embed/TszwB1YQh-0",
  "spinosaurus": "https://www.youtube.com/embed/4yW5Kj0rX8A",
  "brachiosaurus": "https://www.youtube.com/embed/rV3d8NqI6xM",
  "stegosaurus": "https://www.youtube.com/embed/7V2Y5K8mS2Q"
};

const getDinoImageUrl = (specimen) => {
  if (!specimen) return "";

  // 1. Prioritize backend-provided image (parse Drive link if needed)
  const rawUrl = specimen.thumbnail || specimen.image || "";
  if (rawUrl) {
    if (rawUrl.includes("drive.google.com/file/d/")) {
      const parts = rawUrl.split("drive.google.com/file/d/");
      if (parts.length > 1) {
        const id = parts[1].split("/")[0].split("?")[0];
        return `https://lh3.googleusercontent.com/d/${id}=w1000`;
      }
    }
    if (rawUrl.includes("drive.google.com/thumbnail?id=")) {
      const parts = rawUrl.split("id=");
      if (parts.length > 1) {
        const id = parts[1].split("&")[0];
        return `https://lh3.googleusercontent.com/d/${id}=w1000`;
      }
    }
    if (rawUrl.includes("drive.google.com/thumbnail?sz=")) {
      const match = rawUrl.match(/id=([^&]+)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
      }
    }
    return rawUrl;
  }

  // 2. Fallback to whitelisted compiled local images
  const slug = specimen.slug || "";
  if (LOCAL_IMAGES[slug]) {
    return LOCAL_IMAGES[slug];
  }
  // Try substring matching
  for (const key of Object.keys(LOCAL_IMAGES)) {
    if (slug.includes(key) || key.includes(slug)) {
      return LOCAL_IMAGES[key];
    }
  }
  return "/images/trex.webp";
};

function prepareSpecimenData(dino) {
  const slug = dino.slug || "";

  // Extract or build fields cleanly
  const name = dino.name || "Unknown Giant";
  const scientific_name = dino.scientificName || dino.scientific_name || dino.name || "Unknown";
  const era = dino.era || "Mesozoic";
  const period = dino.period || (slug.includes("rex") || slug.includes("tricera") || slug.includes("raptor") ? "Late Cretaceous" : "Mesozoic Period");
  const million_years_ago = dino.million_years_ago || (slug.includes("rex") ? 66 : slug.includes("triceratops") ? 68 : slug.includes("velociraptor") ? 75 : 150);
  const diet = dino.diet || "Unknown";
  const habitat = dino.habitat || (slug.includes("rex") || slug.includes("triceratops") ? "Terrestrial (North America)" : "Terrestrial");
  const description = dino.description || "No description available in the archive.";

  // Generate default classification
  const nameWord = name.split(' ')[0];
  const classification = dino.classification || {
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Reptilia",
    order: slug.includes("rex") || slug.includes("spino") || slug.includes("raptor") || slug.includes("carnotaurus") || slug.includes("allosaurus") ? "Saurischia" : "Ornithischia",
    family: slug.includes("rex") ? "Tyrannosauridae" :
      slug.includes("spino") ? "Spinosauridae" :
        slug.includes("raptor") ? "Dromaeosauridae" :
          slug.includes("tricera") ? "Ceratopsidae" :
            slug.includes("stego") ? "Stegosauridae" :
              slug.includes("brachio") ? "Brachiosauridae" : "Ornithischia",
    genus: nameWord,
    species: slug.includes("rex") ? "T. rex" :
      slug.includes("horridus") || slug.includes("tricera") ? "T. horridus" :
        slug.includes("stenops") || slug.includes("stego") ? "S. stenops" : "specimen"
  };

  // Generate default fossil discoveries
  const fossil_evidence = dino.fossil_evidence || {
    summary: `Numerous skeleton specimens of ${name} have been excavated, providing crucial data for anatomical modeling and biomechanical simulation.`,
    discoveries: [
      {
        year: dino.discovery_year || "1902",
        location: habitat,
        discovered_by: dino.discovered_by || "Barnum Brown"
      }
    ]
  };

  // Generate DNA insights
  const dna_insights = dino.dna_insights || {
    status: "94% Sequenced",
    summary: `Highly preserved proteins retrieved from fossilized marrow enabled a near-complete reconstruction of ${name}'s genome.`
  };

  // Generate behaviour profile
  const behaviour = dino.behaviour || {
    hunting_style: diet === "Carnivore" ? "Solitary ambush predator" : "Foraging browser",
    social_behavior: diet === "Carnivore" ? "Highly territorial" : "Herd/gregarious behavior",
    intelligence: diet === "Carnivore" ? "High tactical agility" : "Moderate situational awareness",
    prey: diet === "Carnivore" ? ["Hadrosaurs", "Ceratopsians"] : [],
    predators: diet === "Carnivore" ? ["Other mega-theropods"] : ["Tyrannosaurs", "Raptors"]
  };

  return {
    ...dino,
    name,
    scientific_name,
    era,
    period,
    million_years_ago,
    diet,
    habitat,
    description,
    classification,
    fossil_evidence,
    dna_insights,
    behaviour
  };
}

export default function Dinosaur() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [specimen, setSpecimen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fossilModalOpen, setFossilModalOpen] = useState(false);
  const [dnaModalOpen, setDnaModalOpen] = useState(false);
  const [behaviourModalOpen, setBehaviourModalOpen] = useState(false);
  const [documentaryModalOpen, setDocumentaryModalOpen] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchSpecimen = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/dinosaurs/${slug}`);
        if (!response.ok) {
          throw new Error('Dinosaur not found');
        }
        const data = await response.json();
        setSpecimen(prepareSpecimenData(data));
        setUsingFallback(false);
      } catch (err) {
        console.warn(`Specimen dossier API failure. Pulling local cache for slug "${slug}".`, err);
        const local = LOCAL_SPECIMENS[slug] || Object.values(LOCAL_SPECIMENS)[0];
        setSpecimen(prepareSpecimenData(local));
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecimen();
  }, [slug]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!specimen) return;
      try {
        const response = await fetch(`${API_URL}/dinosaurs`);
        const allDinos = await response.json();
        if (Array.isArray(allDinos)) {
          const filtered = allDinos.filter(d => d.slug !== slug);
          let matching = filtered.filter(d => d.diet === specimen.diet);
          if (matching.length < 3) {
            matching = [...matching, ...filtered.filter(d => d.diet !== specimen.diet)];
          }
          setRelated(matching.slice(0, 3));
        }
      } catch (e) {
        setRelated([
          { slug: "spinosaurus", name: "Spinosaurus", diet: "Carnivore", era: "Cretaceous" },
          { slug: "velociraptor", name: "Velociraptor", diet: "Carnivore", era: "Cretaceous" },
          { slug: "triceratops", name: "Triceratops", diet: "Herbivore", era: "Cretaceous" }
        ]);
      }
    };
    fetchRelated();
  }, [slug, specimen]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070b09] gap-6">
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
        <Link to="/research-database" className="inline-block px-8 py-3 bg-[#121815] border border-[#c5a880]/40 text-[#c5a880] text-sm uppercase tracking-wider font-semibold rounded-sm transition duration-300 hover:bg-[#c5a880] hover:text-black">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const imageUrl = getDinoImageUrl(specimen);

  // Dynamic values based on physical stats
  const stats = specimen.physical_stats || {};
  const length = specimen.length || stats.length_m || "12.3 m";
  const height = specimen.height || stats.height_m || "4 m";
  const weight = specimen.weight || stats.weight_tons || "8.4 Tons";
  const speed = specimen.speed || stats.speed_kmph || "27 km/h";
  const biteForce = specimen.biteForce || (stats.bite_force_psi ? `${stats.bite_force_psi.toLocaleString()} PSI` : "35,000 N");

  // Get documentary video source
  const documentaryUrl = DOCUMENTARY_VIDEOS[specimen.slug] || "https://www.youtube.com/embed/aYV3DkMvW0E";

  return (
    <div
      className="min-h-screen bg-[#070b09] text-[#e2e8f0] font-sans selection:bg-[#c5a880] selection:text-black relative flex flex-col items-center w-full overflow-x-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(14, 25, 20, 0.70) 0%, rgba(8, 14, 11, 0.80) 100%), url(${jungleBg})`,
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
        <div className="w-full flex justify-between items-center">
          <Link to="/research-database" className="text-xs uppercase tracking-[0.25em] text-[#c5a880] hover:text-white transition duration-300 flex items-center gap-2 font-semibold font-mono">
            ← Back to Expedition
          </Link>
          {usingFallback && (
            <span className="text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded-sm">
              Offline Cache Mode
            </span>
          )}
        </div>

        {/* TOP ROW: Specimen details split layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start w-full">

          {/* Left Column: Title, Quick Badges, About Block */}
          <div className="md:col-span-12 lg:col-span-12 space-y-6 flex flex-col justify-center">

            {/* Era & Period Badge Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] font-semibold block font-mono">
                  {specimen.era} Era • {specimen.period}
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
                  <span className="font-semibold text-white/95 font-serif text-[11px] leading-normal pt-0.5 block">{specimen.million_years_ago}M Years Ago</span>
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
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-bold font-mono">About</h3>
              <p className="text-sm text-white/70 leading-relaxed font-light">
                {specimen.description}
              </p>
            </div>

            {/* Premium Interaction Buttons Group */}
            <div className="flex gap-4 pt-3 flex-wrap">
              <button
                onClick={() => navigate(`/viewer/${specimen.slug}`)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold border border-[#c5a880]/40 bg-[#c5a880]/10 hover:bg-[#c5a880] hover:text-black transition-all duration-300 px-6 py-3 rounded-sm shadow-md font-mono"
              >
                <Box size={14} />
                <span>View In 3D</span>
              </button>
              <button
                onClick={() => setDocumentaryModalOpen(true)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold border border-[#c5a880]/40 bg-[#0d1612]/90 hover:bg-white hover:text-black hover:border-white transition-all duration-300 px-6 py-3 rounded-sm shadow-md font-mono"
              >
                <Play size={14} />
                <span>Watch Documentary</span>
              </button>
            </div>

          </div>

          {/* Middle Column: Scanning Viewfinder image render */}
          <div className="md:col-span-8 lg:col-span-8 flex justify-center items-start relative w-full">
            <div className="absolute w-[85%] h-[85%] bg-[#c5a880]/3 blur-[130px] rounded-full pointer-events-none" />

            {/* Viewfinder scanner container - responsive image wrapper */}
            <div className="relative group w-full flex items-center justify-center bg-[#121c17]/35 border border-[#c5a880]/20 p-2 rounded-lg shadow-[0_25px_50px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Corner ticks */}
              <div className="absolute top-2 left-2 text-[#c5a880]/50 font-mono text-xs select-none">┌</div>
              <div className="absolute top-2 right-2 text-[#c5a880]/50 font-mono text-xs select-none">┐</div>
              <div className="absolute bottom-2 left-2 text-[#c5a880]/50 font-mono text-xs select-none">└</div>
              <div className="absolute bottom-2 right-2 text-[#c5a880]/50 font-mono text-xs select-none">┘</div>

              <div className="w-full max-w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                <img
                  src={imageUrl}
                  alt={`${specimen.name} profile view`}
                  className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.95)] filter contrast-[1.03] brightness-[0.98] group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer z-10"
                  onError={(e) => { e.currentTarget.src = '/images/placeholder-dino.png'; }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Quick Facts vertical list panel */}
          <div className="md:col-span-4 lg:col-span-4 self-start sticky top-28 bg-[#121c17]/40 border border-white/10 p-6 rounded-sm shadow-xl space-y-6 w-full h-[min(60vh,520px)] overflow-y-auto">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-bold border-b border-white/10 pb-3 font-mono">
              Quick Facts
            </h3>

            <div className="space-y-4">
              {/* Stat 1: Length */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <Ruler size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none font-mono">Length</span>
                  <span className="text-sm font-semibold text-white">{length}</span>
                </div>
              </div>

              {/* Stat 2: Height */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <ArrowUp size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none font-mono">Height</span>
                  <span className="text-sm font-semibold text-white">{height}</span>
                </div>
              </div>

              {/* Stat 3: Weight */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <Scale size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none font-mono">Weight</span>
                  <span className="text-sm font-semibold text-white">{weight}</span>
                </div>
              </div>

              {/* Stat 4: Bite Force */}
              {biteForce && biteForce !== "0 PSI" && (
                <div className="flex items-center gap-4 group/stat">
                  <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                    <Shield size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block leading-none font-mono">Bite Force</span>
                    <span className="text-sm font-semibold text-white">{biteForce}</span>
                  </div>
                </div>
              )}

              {/* Stat 5: Speed */}
              <div className="flex items-center gap-4 group/stat">
                <div className="w-10 h-10 rounded-full border border-[#c5a880]/20 flex items-center justify-center text-xs text-[#c5a880] bg-[#0d1511]/90 shadow-md group-hover/stat:border-[#c5a880]/50 transition-colors duration-300">
                  <Gauge size={14} className="text-[#c5a880] drop-shadow-[0_0_4px_rgba(197,168,128,0.4)]" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block leading-none font-mono">Speed</span>
                  <span className="text-sm font-semibold text-white">{speed}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* MIDDLE SECTION: 3-Column Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

          {/* Card 1: Fossil Evidence */}
          <div className="premium-dossier-card p-6 flex flex-col gap-4 justify-between relative group/card">
            <div className="absolute top-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┌</div>
            <div className="absolute top-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┐</div>
            <div className="absolute bottom-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">└</div>
            <div className="absolute bottom-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┘</div>

            <div className="absolute top-5 right-5 text-[8px] font-mono text-white/30 tracking-widest pointer-events-none">
              [REG_FOS_01]
            </div>

            <div className="space-y-3">
              <div className="card-header-badge py-1.5 px-3 rounded-sm self-start inline-block">
                <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-bold font-mono">Fossil Evidence</h4>
              </div>
              <div className="w-full h-36 overflow-hidden rounded-sm border border-white/10 bg-black/70 shadow-inner relative group-hover/card:border-[#c5a880]/40 transition-all duration-350">
                <img
                  src="/images/fossil.jpg"
                  alt="Fossil Evidence"
                  className="w-full h-full object-contain opacity-80 group-hover/card:opacity-100 group-hover/card:scale-102 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light pt-1">
                {specimen.fossil_evidence?.summary.substring(0, 120)}...
              </p>
            </div>
            <button
              onClick={() => setFossilModalOpen(true)}
              className="text-[9px] uppercase tracking-wider font-semibold border border-[#c5a880]/30 bg-[#0d1612]/90 px-4 py-2.5 rounded-sm text-[#c5a880] hover:bg-[#c5a880] hover:text-black hover:border-transparent transition-all duration-300 mt-2 self-start flex items-center gap-1 shadow-lg font-mono"
            >
              <span>View Fossils</span>
              <span className="text-[8px] font-sans">↗</span>
            </button>
          </div>

          {/* Card 2: DNA Insights */}
          <div className="premium-dossier-card p-6 flex flex-col gap-4 justify-between relative group/card">
            <div className="absolute top-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┌</div>
            <div className="absolute top-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┐</div>
            <div className="absolute bottom-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">└</div>
            <div className="absolute bottom-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┘</div>

            <div className="absolute top-5 right-5 text-[8px] font-mono text-white/30 tracking-widest pointer-events-none">
              [REG_DNA_02]
            </div>

            <div className="space-y-3">
              <div className="card-header-badge py-1.5 px-3 rounded-sm self-start inline-block">
                <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-bold font-mono">DNA Insights</h4>
              </div>
              <div className="w-full h-36 overflow-hidden rounded-sm border border-white/10 bg-black/70 shadow-inner relative group-hover/card:border-cyan-500/40 transition-all duration-350">
                <img
                  src="/images/dna.jpg"
                  alt="DNA Insights"
                  className="w-full h-full object-contain opacity-80 group-hover/card:opacity-100 group-hover/card:scale-102 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light pt-1">
                Advanced structural analysis of genetic materials revealing details about species growth parameters.
              </p>
            </div>
            <button
              onClick={() => setDnaModalOpen(true)}
              className="text-[9px] uppercase tracking-wider font-semibold border border-[#c5a880]/30 bg-[#0d1612]/90 px-4 py-2.5 rounded-sm text-[#c5a880] hover:bg-[#c5a880] hover:text-black hover:border-transparent transition-all duration-300 mt-2 self-start flex items-center gap-1 shadow-lg font-mono"
            >
              <span>DNA Report</span>
              <span className="text-[8px] font-sans">∨</span>
            </button>
          </div>

          {/* Card 3: Behavior & Lifestyle */}
          <div className="premium-dossier-card p-6 flex flex-col gap-4 justify-between relative group/card">
            <div className="absolute top-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┌</div>
            <div className="absolute top-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┐</div>
            <div className="absolute bottom-1.5 left-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">└</div>
            <div className="absolute bottom-1.5 right-1.5 text-[#c5a880]/30 font-mono text-[9px] select-none pointer-events-none">┘</div>

            <div className="absolute top-5 right-5 text-[8px] font-mono text-white/30 tracking-widest pointer-events-none">
              [REG_BEH_03]
            </div>

            <div className="space-y-3">
              <div className="card-header-badge py-1.5 px-3 rounded-sm self-start inline-block">
                <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-bold font-mono">Behavior & Lifestyle</h4>
              </div>
              <div className="w-full h-36 overflow-hidden rounded-sm border border-white/10 bg-black/70 shadow-inner relative group-hover/card:border-amber-500/40 transition-all duration-350">
                <img
                  src="/images/behaviour.jpg"
                  alt="Behavior & Lifestyle"
                  className="w-full h-full object-contain opacity-80 group-hover/card:opacity-100 group-hover/card:scale-102 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light pt-1">
                Ecosystem mapping, hunting profile, pack structure, and territorial behavioral dossier.
              </p>
            </div>
            <button
              onClick={() => setBehaviourModalOpen(true)}
              className="text-[9px] uppercase tracking-wider font-semibold border border-[#c5a880]/30 bg-[#0d1612]/90 px-4 py-2.5 rounded-sm text-[#c5a880] hover:bg-[#c5a880] hover:text-black hover:border-transparent transition-all duration-300 mt-2 self-start flex items-center gap-1 shadow-lg font-mono"
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
                <h5 className="text-[10px] uppercase tracking-wider text-[#c5a880] font-bold font-mono">Fun Fact</h5>
              </div>
              <p className="text-xs text-white/70 leading-relaxed pt-1.5">
                {specimen.slug.includes("rex")
                  ? "T. rex's bite was so powerful that it could crush bone with ease, exercising over 12,000 pounds of pressure!"
                  : specimen.slug.includes("tricera")
                    ? "Triceratops horns grew up to 3 feet long and were used for defense, territorial disputes, and mating displays."
                    : "Dinosaur profiles indicate specialized adaptive mechanisms suited to their distinct prehistoric biomes."
                }
              </p>
            </div>
          </div>

          {/* Panel 2: Classification Details */}
          <div className="lg:col-span-5 premium-dossier-card p-6 flex flex-col justify-between gap-3 shadow-xl">
            <div className="card-header-badge py-0.5 px-2 rounded-sm self-start inline-block">
              <h5 className="text-[10px] uppercase tracking-wider text-[#c5a880] font-bold font-mono">
                Classification
              </h5>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-white/80 font-mono pt-1">
              <div><span className="text-white/40">Kingdom:</span> {specimen.classification.kingdom}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Phylum:</span> {specimen.classification.phylum}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Class:</span> {specimen.classification.class}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Order:</span> {specimen.classification.order}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Family:</span> {specimen.classification.family}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Genus:</span> {specimen.classification.genus}</div>
              <div className="text-white/30">&gt;</div>
              <div><span className="text-white/40">Species:</span> {specimen.classification.species}</div>
            </div>
          </div>

          {/* Panel 3: Conservation Status */}
          <div className="lg:col-span-3 premium-dossier-card p-6 flex items-center gap-4 shadow-xl">
            <span className="text-2xl text-[#c5a880] bg-[#0d1511]/85 w-12 h-12 rounded-sm flex items-center justify-center border border-[#c5a880]/20 shrink-0 shadow-inner glow-amber">
              🛡️
            </span>
            <div className="space-y-1">
              <h5 className="text-[10px] uppercase tracking-wider text-white/40 leading-none font-mono">Conservation Status</h5>
              <p className="text-lg font-bold text-white tracking-wide uppercase leading-none font-serif pt-1.5">Extinct</p>
              <p className="text-[10px] text-white/50 leading-none pt-1 font-mono">
                ~{specimen.million_years_ago} million years ago
              </p>
            </div>
          </div>

        </div>

        {/* RELATED SPECIES GALLERY SECTION */}
        {related && related.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-bold font-mono">DISCOVER MORE</h3>
              <h2 className="text-3xl font-serif text-white tracking-wide uppercase mt-1">Related Species</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item, idx) => {
                const relatedImg = getDinoImageUrl(item);
                return (
                  <div
                    key={idx}
                    className="premium-dossier-card p-4 flex flex-col justify-between gap-4 cursor-pointer relative group/related transition-all duration-300 hover:border-[#c5a880]/40"
                    onClick={() => navigate(`/dinosaur/${item.slug}`)}
                  >
                    <div className="w-full aspect-[3/3] bg-[#121c17]/35 border border-white/5 rounded-sm overflow-hidden flex items-center justify-center p-4">
                      <img
                        src={relatedImg}
                        alt={item.name}
                        className="object-contain max-h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] group-hover/related:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#c5a880] uppercase">
                        <span>{item.era || 'Mesozoic'}</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded-sm text-white/70">{item.diet || 'Herbivore'}</span>
                      </div>
                      <h3 className="text-lg font-serif text-white uppercase tracking-wide mt-2">{item.name}</h3>
                    </div>
                    <button
                      className="text-[9px] uppercase tracking-wider font-semibold border border-[#c5a880]/30 bg-[#0d1612]/90 w-full py-2.5 rounded-sm text-[#c5a880] group-hover/related:bg-[#c5a880] group-hover/related:text-black transition-all duration-300 font-mono"
                    >
                      Explore Species
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Watch Documentary Modal Popup */}
      {documentaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6">
          <div
            className="border border-[#c5a880]/30 max-w-4xl w-full p-4 rounded-sm relative shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col gap-4 animate-scale-in bg-[#070b09]"
          >
            {/* Close Button */}
            <button
              onClick={() => setDocumentaryModalOpen(false)}
              className="absolute -top-12 right-0 text-[#c5a880] hover:text-white transition duration-300 font-mono text-sm border border-[#c5a880]/20 bg-[#0d1612]/80 w-8 h-8 flex items-center justify-center rounded-sm shadow-md"
            >
              ✕
            </button>

            <div className="card-header-badge py-1.5 px-3 rounded-sm self-start inline-block">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[#c5a880] font-bold font-mono">Watch species documentary</h3>
            </div>

            <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-white/10 bg-black">
              <iframe
                src={documentaryUrl}
                title={`${specimen.name} Documentary`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

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
              <h3 className="text-sm uppercase tracking-[0.2em] text-[#c5a880] font-bold font-mono">Fossil Telemetry Dossier</h3>
            </div>

            <p className="text-xs text-white/60 font-light leading-relaxed">
              {specimen.fossil_evidence?.summary}
            </p>

            <div className="space-y-3 mt-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {specimen.fossil_evidence?.discoveries && specimen.fossil_evidence.discoveries.length > 0 && (
                specimen.fossil_evidence.discoveries.map((disc, idx) => (
                  <div key={idx} className="bg-black/35 border border-white/5 p-4 rounded-sm space-y-2 relative">
                    <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-widest text-[#c5a880]">
                      <span>Discovery #{idx + 1}</span>
                      <span>{disc.year || 'N/A'}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/95">{disc.location || 'Unknown location'}</p>
                    <p className="text-xs text-white/50 font-mono">Lead Paleontologist: {disc.discovered_by || 'Unknown'}</p>
                  </div>
                ))
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
              <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">DNA Sequencing Report</h3>
            </div>

            <div className="flex justify-between items-center bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-sm text-xs mt-1">
              <span className="text-white/40 uppercase font-mono tracking-wider">Sequence Status</span>
              <span className="text-cyan-400 font-mono font-bold tracking-widest uppercase">
                {specimen.dna_insights?.status}
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-light">
              {specimen.dna_insights?.summary}
            </p>

            <div className="space-y-2 mt-1">
              <div className="text-[9px] uppercase font-mono tracking-widest text-cyan-400/60 font-mono">Live Sequencing Grid Feed</div>
              <div className="font-mono text-[9px] tracking-widest text-cyan-400 bg-black/45 p-4 rounded-sm border border-cyan-500/20 max-h-24 overflow-hidden relative leading-tight select-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/75 pointer-events-none font-mono" />
                A T T C G G A T C C G G T A A T C G G A T T C G A T T C G A T C G G A T T C G A T T C G<br />
                C G T T A G C C G T T A A C G T T A A C C G G T A A C G C G T C C A A T T G G C C G T C<br />
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
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-500 font-bold font-mono">Behavior & Lifestyle Dossier</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm">
                <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider font-mono">Hunting Style</span>
                <span className="text-xs text-white/90 font-medium capitalize">{specimen.behaviour?.hunting_style || 'Apex pack/solitary hunter'}</span>
              </div>
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm">
                <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider font-mono">Social Structure</span>
                <span className="text-xs text-white/90 font-medium capitalize">{specimen.behaviour?.social_behavior || 'Highly territorial / solitary'}</span>
              </div>
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm sm:col-span-2">
                <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider font-mono">Cognitive Evaluation</span>
                <span className="text-xs text-white/90 font-medium">{specimen.behaviour?.intelligence || 'High tactical adaptability'}</span>
              </div>
            </div>

            {/* Prey List */}
            {specimen.behaviour?.prey && specimen.behaviour.prey.length > 0 && (
              <div className="bg-black/35 border border-white/5 p-3 rounded-sm">
                <span className="text-[9px] font-mono text-amber-500 block uppercase tracking-wider mb-1 font-mono">Target Prey Species</span>
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
                <span className="text-[9px] font-mono text-red-400 block uppercase tracking-wider mb-1 font-mono">Competitors / Predators</span>
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
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}