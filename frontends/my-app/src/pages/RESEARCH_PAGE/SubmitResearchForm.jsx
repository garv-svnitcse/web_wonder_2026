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

  const [researcherData, setResearcherData] = useState({
    name: "",
    email: "",
    specialization: "",
    quote: "",
    publishedStudies: "",
    awardsWon: "",
    citations: "",
  });
  const [avatarName, setAvatarName] = useState("");
  const [showResearcherSuccess, setShowResearcherSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResearcherChange = (e) => {
    setResearcherData({ ...researcherData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files.length > 0) {
      setAvatarName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Research:", formData, fileName);
    setShowSuccess(true);
  };

  const handleResearcherSubmit = (e) => {
    e.preventDefault();
    console.log("Researcher Submitted:", researcherData, avatarName);
    setShowResearcherSuccess(true);
  };

  return (
    <div className="submitResearchSection">
      <div className="srfFormsContainer">
        
        {/* Left Column: Submit Research Details */}
        <div className="submitResearchColumn">
          <div className="submitResearchHeading" style={{ textAlign: "left" }}>
            <h2>Submit Research</h2>
            <p>Share your discoveries with the global paleontology community.</p>
          </div>

          <form className="submitResearchForm" onSubmit={handleSubmit}>
            <div className="srfGrid">
              <div className="srfField srfSpan2">
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

              <div className="srfField srfSpan2">
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
                  <option value="">Select species</option>
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

              <div className="srfField srfSpan2">
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

              <div className="srfField srfSpan2">
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
                  rows={4}
                  required
                />
                <span className="srfCharCount">
                  {formData.abstract.length} / 1000
                </span>
              </div>

              <div className="srfField srfSpan2">
                <label>References / Links</label>
                <input
                  type="text"
                  name="references"
                  placeholder="Add references or related links"
                  value={formData.references}
                  onChange={handleChange}
                />
              </div>

              <div className="srfField srfSpan2">
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
        </div>

        {/* Right Column: Researcher Details */}
        <div className="submitResearcherColumn">
          <div className="submitResearchHeading" style={{ textAlign: "left" }}>
            <h2>Researcher Profile</h2>
            <p>Register your credentials in the explorer archives based on your studies.</p>
          </div>

          <form className="submitResearchForm" onSubmit={handleResearcherSubmit}>
            <div className="srfGrid">
              <div className="srfField srfSpan2">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Dr. Amelia Hart"
                  value={researcherData.name}
                  onChange={handleResearcherChange}
                  required
                />
              </div>

              <div className="srfField srfSpan2">
                <label>Specialization / Role *</label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="e.g. Lead Paleobiologist"
                  value={researcherData.specialization}
                  onChange={handleResearcherChange}
                  required
                />
              </div>

              <div className="srfField srfSpan2">
                <label>Profile Photo (Avatar) *</label>
                <label className="srfUploadBox" htmlFor="avatarUpload">
                  <FaCloudUploadAlt />
                  <p>{avatarName || "Upload profile avatar"}</p>
                  <span>or click to browse</span>
                  <small>JPG, PNG (Max 5MB)</small>
                  <input
                    id="avatarUpload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleAvatarChange}
                    hidden
                  />
                </label>
              </div>

              <div className="srfField srfSpan2">
                <label>Featured Quote *</label>
                <textarea
                  name="quote"
                  placeholder='e.g. "Every fossil tells a story..."'
                  value={researcherData.quote}
                  onChange={handleResearcherChange}
                  rows={3}
                  required
                />
              </div>

              <div className="srfField">
                <label>Published Studies *</label>
                <input
                  type="number"
                  name="publishedStudies"
                  placeholder="e.g. 42"
                  value={researcherData.publishedStudies}
                  onChange={handleResearcherChange}
                  required
                />
              </div>

              <div className="srfField">
                <label>Awards Won *</label>
                <input
                  type="number"
                  name="awardsWon"
                  placeholder="e.g. 8"
                  value={researcherData.awardsWon}
                  onChange={handleResearcherChange}
                  required
                />
              </div>

              <div className="srfField srfSpan2">
                <label>Citations Count *</label>
                <input
                  type="number"
                  name="citations"
                  placeholder="e.g. 1200"
                  value={researcherData.citations}
                  onChange={handleResearcherChange}
                  required
                />
              </div>

              <div className="srfField srfSpan2">
                <label>Contact Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. amelia.hart@explorer.org"
                  value={researcherData.email}
                  onChange={handleResearcherChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="srfSubmitBtn">
              Save Profile <FaPaperPlane />
            </button>
          </form>
        </div>

      </div>

      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Research Submitted!"
        message="Your research has been sent for review. Our team will verify your findings and notify you once approved."
      />

      <SuccessModal
        show={showResearcherSuccess}
        onClose={() => setShowResearcherSuccess(false)}
        title="Profile Registered!"
        message="Your researcher credentials have been logged in the explorer database. You can now contribute findings."
      />
    </div>
  );
}
