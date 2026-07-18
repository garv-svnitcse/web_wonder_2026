import trexImg from "../../assets/Dinosaurs_Images/Tyrannosaurus rex.png";
import spinosaurusImg from "../../assets/Dinosaurs_Images/Spinosaurus.png";
import velociraptorImg from "../../assets/Dinosaurs_Images/Velociraptor.png";
import triceratopsImg from "../../assets/Dinosaurs_Images/Triceratops.png";
import brachiosaurusImg from "../../assets/Dinosaurs_Images/Brachiosaurus.png";
import stegosaurusImg from "../../assets/Dinosaurs_Images/Stegosaurus.png";

export const database = [
  {
    slug: "tyrannosaurus-rex",
    title: "Isotopic Analysis of Tyrannosaurus Rex Fossils",
    description:
      "New isotopic data suggests T. Rex had a warmer metabolism than previously estimated.",
    fullContent:
      "This study examines oxygen and carbon isotope ratios extracted from Tyrannosaurus Rex bone samples recovered from Late Cretaceous deposits. Results indicate significantly elevated metabolic rates compared to earlier estimates, suggesting T. Rex maintained a body temperature closer to modern endothermic mammals than previously theorized. These findings challenge long-standing assumptions about theropod thermoregulation and open new avenues for understanding predator-prey dynamics in Late Cretaceous ecosystems. Further sampling across multiple specimens is recommended to validate population-wide consistency.",
    era: "Jurassic Era",
    status: "Approved",
    image: trexImg,
    date: "May 14, 2026",
    views: "1.2K",
    comments: 32,
    lastComment: {
      author: "Dr. Kevin Park",
      text: "Fascinating insight — this really challenges older thermoregulation models.",
    },
    diet: "Carnivore",
    threat: "Extreme",
    scientist: {
      name: "Dr. Amelia Hart",
      role: "Paleobiologist",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
  },
  {
    slug: "spinosaurus-aegyptiacus",
    title: "Ancient DNA Fragments in Mosquito Fossils",
    description:
      "Breakthrough in extracting partial DNA sequences from amber-preserved mosquitoes.",
    fullContent:
      "Utilizing advanced PCR amplification techniques on amber-preserved mosquito specimens, researchers successfully extracted partial genetic sequences believed to originate from Late Cretaceous archosaurs. While full genome reconstruction remains beyond current technological capability, these fragments provide unprecedented insight into genetic markers of the period. The preservation quality of the amber samples significantly exceeded expectations, suggesting similar deposits may yield further breakthroughs.",
    era: "Cretaceous Era",
    status: "Pending",
    image: spinosaurusImg,
    date: "May 13, 2026",
    views: "890",
    comments: 18,
    lastComment: {
      author: "Dr. Danielle Rivera",
      text: "Great insight — this adds real depth to the field.",
    },
    diet: "Piscivore",
    threat: "Extreme",
    scientist: {
      name: "Dr. Noah Bennett",
      role: "Evolutionary Biologist",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  },
  {
    slug: "velociraptor-mongoliensis",
    title: "Feather Structures in Velociraptor Specimens",
    description:
      "Microscopic analysis indicates the presence of proto-feather structures in forelimb fossils.",
    fullContent:
      "High-resolution electron microscopy of forelimb fossil impressions has revealed clear evidence of proto-feather quill knobs on Velociraptor specimens. This discovery strongly supports the hypothesis that many theropod dinosaurs possessed feathered coverings, primarily for display and thermoregulation rather than flight. Comparative analysis with related dromaeosaurid species suggests this trait was widespread across the family, reshaping our understanding of dinosaur appearance and behavior.",
    era: "Cretaceous Era",
    status: "Approved",
    image: velociraptorImg,
    date: "May 12, 2026",
    views: "1K",
    comments: 25,
    lastComment: {
        author: "Dr. Olivia Chen",
        text: "This is a game-changer for our understanding of dinosaur integument.",
    },
    diet: "Carnivore",
    threat: "High",
    scientist: {
      name: "Dr. Sophia Lee",
      role: "Geology Specialist",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
  },
  {
    slug: "triceratops-horridus",
    title: "Growth Ring Patterns in Triceratops Horn Core",
    description:
      "Growth rings provide further insight into the age and environmental stress factors.",
    fullContent:
      "Cross-sectional analysis of Triceratops horn cores reveals distinct annual growth rings comparable to those found in modern reptiles. Variations in ring thickness correlate with seasonal environmental stressors, including drought periods and resource scarcity. This methodology allows researchers to estimate individual specimen age with greater precision and reconstruct paleoclimatic conditions across multiple growth cycles, offering a novel lens into Late Cretaceous environmental fluctuations.",
    era: "Triassic Era",
    status: "Pending",
    image: triceratopsImg,
    date: "May 10, 2026",
    views: "760",
    comments: 14,
    lastComment: {
      author: "Dr. Danielle Rivera",
      text: "Great insight — this adds real depth to the field.",
    },
    diet: "Herbivore",
    threat: "Medium",
    scientist: {
      name: "Dr. Ethan Cole",
      role: "Paleoenvironmentalist",
      avatar: "https://i.pravatar.cc/150?img=53",
    },
  },
  {
    slug: "brachiosaurus-altithorax",
    title: "Paleoenvironmental Study of Brachiosaurus Habitat",
    description:
      "Sediment analysis reveals lush, floodplain forests were more widespread than expected.",
    fullContent:
      "Detailed sedimentological surveys of Brachiosaurus fossil sites indicate extensive floodplain forest ecosystems previously underestimated in scope. Pollen analysis and root structure preservation suggest a diverse plant community capable of sustaining large sauropod populations year-round. These findings significantly expand our understanding of Late Jurassic vegetation distribution and its role in supporting megafauna.",
    era: "Jurassic Era",
    status: "Pending",
    image: brachiosaurusImg,
    date: "May 10, 2026",
    views: "760",
    comments: 14,
    lastComment: {
      author: "Dr. Olivia Chen",
      text: "This is a game-changer for our understanding of dinosaur integument.",
    },
    diet: "Herbivore",
    threat: "Low",
    scientist: {
      name: "Dr. Ethan Cole",
      role: "Paleoenvironmentalist",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
  },
  {
    slug: "spinosaurus-bone-density",
    title: "Bone Microstructure of Spinosaurus Aegyptiacus",
    description: "Bone density patterns suggest Spinosaurus was semi-aquatic.",
    fullContent:
      "Histological examination of Spinosaurus limb bones reveals unusually dense cortical bone structure, closely resembling adaptations seen in modern semi-aquatic vertebrates such as hippopotamuses and penguins. This density pattern likely served as ballast, aiding buoyancy control during aquatic hunting. The findings provide compelling skeletal evidence supporting the semi-aquatic lifestyle hypothesis for this genus.",
    era: "Triassic Era",
    status: "Approved",
    image: stegosaurusImg,
    date: "May 8, 2026",
    views: "670",
    comments: 11,
    lastComment: {
        author: "Dr. Lucas Wright",
        text: "Fascinating insight — this really challenges older thermoregulation models.",
    },
    diet: "Piscivore",
    threat: "Extreme",
    scientist: {
      name: "Dr. Lucas Wright",
      role: "Anatomy Researcher",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  },
];
