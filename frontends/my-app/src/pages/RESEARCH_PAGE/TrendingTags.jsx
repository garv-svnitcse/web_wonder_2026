import { FaHashtag } from "react-icons/fa";

const tags = [
  "Paleontology",
  "DNA",
  "Fossils",
  "Cretaceous",
  "Jurassic",
  "Carnivore",
  "Herbivore",
  "Genetics",
];

export default function TrendingTags({ onTagClick }) {
  return (
    <div className="trendingTags">
      <span className="ttLabel">
        <FaHashtag /> Trending
      </span>
      <div className="ttChips">
        {tags.map((tag, i) => (
          <button key={i} className="ttChip" onClick={() => onTagClick(tag)}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
