import { FaSearch } from "react-icons/fa";

export default function ResearchSearchBar({
  search,
  setSearch,
  status,
  setStatus,
  era,
  setEra,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="rhSearchSection">
      <div className="rhSearchBar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search research..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rhFilters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>

        <select value={era} onChange={(e) => setEra(e.target.value)}>
          <option value="">All Era</option>
          <option value="Triassic">Triassic</option>
          <option value="Jurassic">Jurassic</option>
          <option value="Cretaceous">Cretaceous</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="popular">Most Viewed</option>
          <option value="discussed">Most Discussed</option>
        </select>
      </div>
    </div>
  );
}
