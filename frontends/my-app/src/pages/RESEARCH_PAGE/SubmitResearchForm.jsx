import { API_URL } from "../../config/api";
import { useEffect, useState } from "react";
import { FaCloudUploadAlt, FaPaperPlane } from "react-icons/fa";
import SuccessModal from "./SuccessModal";

export default function SubmitResearchForm() {
  const getStoredResearcherData = () => {
    if (typeof window === "undefined") {
      return {
        name: "",
        email: "",
        specialization: "",
        awardsWon: "",
        quote: "",
      };
    }

    try {
      const saved = localStorage.getItem("researcher_profile");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error("Failed to read saved researcher profile:", err);
    }

    return {
      name: "",
      email: "",
      specialization: "",
      awardsWon: "",
      quote: "",
    };
  };

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
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [researcherData, setResearcherData] = useState(getStoredResearcherData);
  const [avatarName, setAvatarName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    localStorage.setItem("researcher_profile", JSON.stringify(researcherData));
  }, [researcherData]);

  useEffect(() => {
    if (profileFetched) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok && isMounted) {
          const user = await response.json();
          setResearcherData((prev) => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
          }));
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        if (isMounted) {
          setProfileFetched(true);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [profileFetched]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResearcherChange = (e) => {
    setResearcherData({ ...researcherData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setEvidenceFile(e.target.files[0]);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files.length > 0) {
      setAvatarName(e.target.files[0].name);
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleUnifiedSubmit = async (e) => {
    e.preventDefault();
    if (!evidenceFile) {
      alert("Please upload an evidence document.");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("co_researchers", formData.coResearchers);
    submitData.append("species", formData.species);
    submitData.append("era", formData.era);
    submitData.append("key_findings", formData.keyFindings);
    submitData.append("abstract", formData.abstract);
    submitData.append("references", formData.references);
    submitData.append("notes", formData.notes);

    submitData.append("researcher_name", researcherData.name);
    submitData.append("researcher_email", researcherData.email);
    submitData.append("researcher_specialization", researcherData.specialization);
    submitData.append("researcher_awards", researcherData.awardsWon);

    submitData.append("evidence_document", evidenceFile);
    if (avatarFile) {
      submitData.append("researcher_avatar", avatarFile);
    }

    try {
      const response = await fetch(`${API_URL}/research/research`, {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setShowSuccess(true);
        // Reset state
        setFormData({
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
        setResearcherData((prev) => ({
          ...prev,
          specialization: "",
          awardsWon: "",
          quote: "",
        }));
        setFileName("");
        setAvatarName("");
        setEvidenceFile(null);
        setAvatarFile(null);
      } else {
        try {
          const err = await response.json();
          alert(err.detail || "Failed to submit research.");
        } catch (e) {
          alert(`Submission failed (Status ${response.status}): ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="submitResearchSection">
      <form className="submitResearchForm unifiedForm" onSubmit={handleUnifiedSubmit}>
        <div className="srfFormsContainer">

          {/* Left Column: Submit Research Details */}
          <div className="submitResearchColumn">
            <div className="submitResearchHeading" style={{ textAlign: "left" }}>
              <h2>Submit Research</h2>
              <p>Share your discoveries with the global paleontology community.</p>
            </div>

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
          </div>

          {/* Right Column: Researcher Details */}
          <div className="submitResearcherColumn">
            <div className="submitResearchHeading" style={{ textAlign: "left" }}>
              <h2>Researcher Profile</h2>
              <p>Register your credentials in the explorer archives based on your studies.</p>
            </div>

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

              <div className="srfField srfSpan2">
                <label>Featured Quote / Motto *</label>
                <input
                  type="text"
                  name="quote"
                  placeholder="e.g. Seeking secrets in the bones of time."
                  value={researcherData.quote}
                  onChange={handleResearcherChange}
                  required
                />
              </div>
            </div>
          </div>

        </div>

        {/* Centered Unified Submit Button */}
        <div className="srfUnifiedSubmitRow" style={{ display: "flex", justifyContent: "center", marginTop: "30px", width: "100%" }}>
          <button type="submit" className="srfSubmitBtn" style={{ minWidth: "250px", padding: "14px 30px" }}>
            Submit Research & Profile <FaPaperPlane style={{ marginLeft: "8px" }} />
          </button>
        </div>
      </form>

      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Research Submitted!"
        message="Your research findings and profile credentials have been successfully submitted for validation."
      />
    </div>
  );
}
