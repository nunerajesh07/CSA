



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminCourses } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  FiPlus, FiEdit2, FiBookOpen,
  FiShield, FiTrendingUp, FiGrid,
} from "react-icons/fi";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdminLoggedIn, admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
      return;
    }
    fetchCourses();
  }, [isAdminLoggedIn]);

  const fetchCourses = async () => {
    try {
      const res = await getAdminCourses();
      setCourses(res.data.courses);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenuePotential = courses.reduce((sum, c) => sum + c.price, 0);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Section */}
        <div
          style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            marginBottom: "2rem", flexWrap: "wrap", gap: "1rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div
                style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "#7c3aed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <FiShield size={18} color="white" />
              </div>
              <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800, color: "#e2e8f0" }}>
                Admin Dashboard
              </h1>
            </div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
              Welcome, <strong style={{ color: "#7c3aed" }}>{admin?.firstname} {admin?.lastname}</strong>. Manage your courses here.
            </p>
          </div>

          {/* Action Buttons */}
          <button
            id="add-course-btn"
            onClick={() => navigate("/admin/course/new")}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem" }}
          >
            <FiPlus size={18} />
            Add New Course
          </button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <StatCard
            icon={<FiGrid size={20} color="#6366f1" />}
            label="Total Courses"
            value={courses.length}
            color="#6366f1"
          />
          <StatCard
            label="Total Value"
            value={`$${totalRevenuePotential.toLocaleString()}`}
            color="#10b981"
          />
          <StatCard
            icon={<FiTrendingUp size={20} color="#f59e0b" />}
            label="Avg. Price"
            value={courses.length > 0 ? `$${Math.round(totalRevenuePotential / courses.length)}` : "$0"}
            color="#f59e0b"
          />
        </div>

        {/* Courses Section */}
        <div>
          <h2 style={{ margin: "0 0 1.25rem", fontSize: "1.1rem", fontWeight: 700, color: "#94a3b8" }}>
            Your Courses ({courses.length})
          </h2>

          {/* Empty State */}
          {courses.length === 0 && (
            <div
              className="glass-card"
              style={{ textAlign: "center", padding: "5rem 2rem" }}
            >
              <div
                style={{
                  width: "80px", height: "80px", borderRadius: "20px",
                  background: "rgba(37,99,235,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <FiBookOpen size={36} color="var(--color-primary)" />
              </div>
              <h3 style={{ margin: "0 0 0.75rem", color: "var(--color-text)", fontSize: "1.4rem", fontWeight: 700 }}>
                No courses yet
              </h3>
              <p style={{ margin: "0 0 2rem", color: "#64748b", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
                Create your first course and start teaching students around the world!
              </p>
              <button
                onClick={() => navigate("/admin/course/new")}
                className="btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FiPlus size={16} /> Create First Course
              </button>
            </div>
          )}

          {}
          {courses.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {courses.map((course, index) => (
                <div
                  key={course._id}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {}
                  <div style={{ height: "160px", overflow: "hidden" }}>
                    <img
                      src={course.imageURL || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                      alt={course.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";
                      }}
                    />
                  </div>

                  {}
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.4 }}>
                      {course.title}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 1rem", fontSize: "0.8rem", color: "#94a3b8",
                        lineHeight: 1.6, overflow: "hidden",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}
                    >
                      {course.description}
                    </p>

                    {}
                    <div
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span style={{ color: "#10b981", fontWeight: 800, fontSize: "1rem" }}>
                        ${course.price === 0 ? "Free" : course.price.toLocaleString()}
                      </span>

                      <button
                        id={`edit-course-${course._id}`}
                        onClick={() =>
                          navigate("/admin/course/edit", { state: { course } })
                        }
                        style={{
                          display: "flex", alignItems: "center", gap: "0.4rem",
                          background: "rgba(37,99,235,0.1)",
                          border: "1px solid rgba(37,99,235,0.3)",
                          color: "var(--color-primary)", padding: "0.5rem 1rem",
                          borderRadius: "8px", cursor: "pointer",
                          fontSize: "0.8rem", fontWeight: 600,
                        }}
                      >
                        <FiEdit2 size={14} /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(${hexToRgb(color)}, 0.15)`,
        borderRadius: "14px",
        padding: "1.25rem",
        display: "flex", alignItems: "center", gap: "1rem",
      }}
    >
      <div
        style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: `rgba(${hexToRgb(color)}, 0.1)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 500, marginBottom: "0.2rem" }}>{label}</div>
        <div style={{ color: "#e2e8f0", fontSize: "1.4rem", fontWeight: 800 }}>{value}</div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "99, 102, 241";
}
