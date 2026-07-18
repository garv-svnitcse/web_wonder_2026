import { useState } from "react";
import { FaCloudUploadAlt, FaPaperPlane } from "react-icons/fa";
import SuccessModal from "./SuccessModal";

export default function SubmitResearchForm() {
  const [formData, setFormData] = useState({
    title: "",
    coResearchers: "",
    species: "",
    category: "",
    era: "",
    keyFindings: "",
    abstract: "",
    references: "",
    notes: "",
  });

  const [fileName, setFileName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData, fileName);
    setShowSuccess(true);
  };

  return (
    <div className="submitResearchSection">
      <div className="submitResearchHeading">
        <h2>Submit Your Research</h2>
        <p>Share your discoveries with the global paleontology community.</p>
      </div>

      <form className="submitResearchForm" onSubmit={handleSubmit}>
        <div className="srfGrid">
          <div className="srfField">
            <label>Research Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Enter research title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="srfField">
            <label>Co-Researchers</label>
            <input
              type="text"
              name="coResearchers"
              placeholder="Add co-researchers (optional)"
              value={formData.coResearchers}
              onChange={handleChange}
            />
          </div>

          <div className="srfField srfSpan2">
            <label>Upload Evidence (PDF / Images) *</label>
            <label className="srfUploadBox" htmlFor="fileUpload">
              <FaCloudUploadAlt />
              <p>{fileName || "Drag & drop files here"}</p>
              <span>or click to browse</span>
              <small>PDF, JPG, PNG (Max 10MB)</small>
              <input
                id="fileUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>

          <div className="srfField">
            <label>Dinosaur / Species *</label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
            >
              <option value="">Select or type species name</option>
              <option>Tyrannosaurus Rex</option>
              <option>Spinosaurus</option>
              <option>Velociraptor</option>
              <option>Triceratops</option>
              <option>Brachiosaurus</option>
              <option>Stegosaurus</option>
            </select>
          </div>

          <div className="srfField">
            <label>Research Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option>Fossil Analysis</option>
              <option>Genetics & DNA</option>
              <option>Behavioral Study</option>
              <option>Anatomy</option>
              <option>Environment & Habitat</option>
            </select>
          </div>

          <div className="srfField">
            <label>Era *</label>
            <select
              name="era"
              value={formData.era}
              onChange={handleChange}
              required
            >
              <option value="">Select Era</option>
              <option>Triassic</option>
              <option>Jurassic</option>
              <option>Cretaceous</option>
            </select>
          </div>

          <div className="srfField">
            <label>Key Findings *</label>
            <textarea
              name="keyFindings"
              placeholder="Write key findings..."
              value={formData.keyFindings}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="srfField srfSpan2">
            <label>Abstract / Summary *</label>
            <textarea
              name="abstract"
              placeholder="Write a brief summary of your research..."
              value={formData.abstract}
              onChange={handleChange}
              maxLength={1000}
              rows={5}
              required
            />
            <span className="srfCharCount">
              {formData.abstract.length} / 1000
            </span>
          </div>

          <div className="srfField">
            <label>References / Links</label>
            <input
              type="text"
              name="references"
              placeholder="Add references or related links"
              value={formData.references}
              onChange={handleChange}
            />
          </div>

          <div className="srfField">
            <label>Additional Notes</label>
            <input
              type="text"
              name="notes"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="srfSubmitBtn">
          Submit Research <FaPaperPlane />
        </button>
      </form>
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
