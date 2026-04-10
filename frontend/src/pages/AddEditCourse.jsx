



import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createCourse, updateCourse } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiBookOpen, FiDollarSign, FiImage, FiFileText, FiArrowLeft, FiSave } from "react-icons/fi";

export default function AddEditCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminLoggedIn } = useAuth();

  const editCourse = location.state?.course || null;
  const isEditing = !!editCourse;

  const [formData, setFormData] = useState({
    title: editCourse?.title || "",
    description: editCourse?.description || "",
    price: editCourse?.price || "",
    imageURL: editCourse?.imageURL || "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(editCourse?.imageURL || "");

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [isAdminLoggedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "imageURL") setImagePreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.price === "") {
      toast.error("Title, description, and price are required");
      return;
    }
    if (isNaN(formData.price) || Number(formData.price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {

        await updateCourse({ courseId: editCourse._id, ...formData });
        toast.success("Course updated successfully! ✅");
      } else {

        await createCourse(formData);
        toast.success("Course created successfully! 🎉");
      }
      navigate("/admin/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Operation failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {}
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            color: "#94a3b8", background: "none", border: "none",
            cursor: "pointer", fontSize: "0.875rem", marginBottom: "1.5rem",
            padding: 0, transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          <FiArrowLeft size={16} />
          Back to Dashboard
        </button>

        {}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.75rem", fontWeight: 800, color: "#e2e8f0" }}>
            {isEditing ? "✏️ Edit Course" : "➕ Add New Course"}
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
            {isEditing ? "Update your course details below" : "Fill in the details to create a new course"}
          </p>
        </div>

        {}
        <div className="glass-card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                <FiBookOpen size={14} style={{ marginRight: "0.4rem" }} />
                Course Title *
              </label>
              <input
                id="course-title"
                type="text" name="title"
                placeholder="e.g., Complete Web Development Bootcamp"
                value={formData.title} onChange={handleChange}
                className="input-field" required
              />
            </div>

            {}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                <FiFileText size={14} style={{ marginRight: "0.4rem" }} />
                Description *
              </label>
              <textarea
                id="course-description"
                name="description"
                placeholder="Describe what students will learn in this course..."
                value={formData.description} onChange={handleChange}
                className="input-field"
                style={{ minHeight: "120px", resize: "vertical" }}
                required
              />
            </div>

            {}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                <FiDollarSign size={14} style={{ marginRight: "0.4rem" }} />
                Price (USD) *
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontWeight: 600 }}>$</span>
                <input
                  id="course-price"
                  type="number" name="price" min="0" step="0.01"
                  placeholder="0 for free courses"
                  value={formData.price} onChange={handleChange}
                  className="input-field" style={{ paddingLeft: "1.75rem" }} required
                />
              </div>
            </div>

            {}
            <div>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                <FiImage size={14} style={{ marginRight: "0.4rem" }} />
                Course Image URL <span style={{ fontWeight: 400, color: "#64748b" }}>(optional)</span>
              </label>
              <input
                id="course-image"
                type="url" name="imageURL"
                placeholder="https://example.com/course-image.jpg"
                value={formData.imageURL} onChange={handleChange}
                className="input-field"
              />

              {}
              {imagePreview && (
                <div style={{ marginTop: "0.75rem" }}>
                  <img
                    src={imagePreview}
                    alt="Course preview"
                    style={{
                      width: "100%", height: "180px", objectFit: "cover",
                      borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {}
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button
                type="button" onClick={() => navigate("/admin/dashboard")}
                className="btn-secondary" style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                id="course-submit" type="submit" disabled={loading}
                className="btn-primary"
                style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                {loading ? (
                  <>
                    <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    {isEditing ? "Update Course" : "Create Course"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
