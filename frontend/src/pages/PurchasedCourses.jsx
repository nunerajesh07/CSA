



import React, { useState, useEffect } from "react";
import { getUserPurchases } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiBookOpen, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function PurchasedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isUserLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate("/login");
      return;
    }
    fetchPurchases();
  }, [isUserLoggedIn]);

  const fetchPurchases = async () => {
    try {
      const res = await getUserPurchases();
      setCourses(res.data.courses);
    } catch (err) {
      console.error("Failed to load purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your courses..." />;

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div
              style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "#6366f1",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <FiBookOpen size={18} color="white" />
            </div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800, color: "#e2e8f0" }}>
              My Courses
            </h1>
          </div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
            Welcome back, <strong style={{ color: "#6366f1" }}>{user?.firstname}</strong>! Here are your enrolled courses.
          </p>
        </div>

        {}
        {courses.length > 0 && (
          <div
            className="glass-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.5rem",
              marginBottom: "2rem",
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.2)",
            }}
          >
            <FiCheckCircle size={20} color="#10b981" />
            <span style={{ color: "var(--color-text)", fontWeight: 500 }}>
              You're enrolled in{" "}
              <strong style={{ color: "#6366f1" }}>{courses.length}</strong>{" "}
              {courses.length === 1 ? "course" : "courses"}
            </span>
          </div>
        )}

        {}
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
              <FiBookOpen size={36} color="#6366f1" />
            </div>
            <h2 style={{ margin: "0 0 0.75rem", color: "#e2e8f0", fontSize: "1.5rem", fontWeight: 700 }}>
              No courses yet
            </h2>
            <p style={{ margin: "0 0 2rem", color: "#64748b", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
              You haven't enrolled in any courses yet. Browse our catalog and start learning today!
            </p>
            <Link to="/">
              <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Browse Courses <FiArrowRight size={16} />
              </button>
            </Link>
          </div>
        )}

        {}
        {courses.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {courses.map((course, index) => (
              <div
                key={course._id}
                className="animate-card-in"
                style={{
                  animationDelay: `${index * 0.08}s`,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(37,99,235,0.2)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,99,235,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {}
                <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                  <img
                    src={course.imageURL || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                    alt={course.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: "#10b981",
                      color: "white", padding: "0.25rem 0.75rem",
                      borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: "0.3rem",
                    }}
                  >
                    <FiCheckCircle size={12} /> Enrolled
                  </div>
                  <div
                    style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: "60px",
                      background: "rgba(15,15,26,0.7)",
                    }}
                  />
                </div>

                {}
                <div style={{ padding: "1.25rem" }}>
                  <h3
                    style={{
                      margin: "0 0 0.5rem", fontSize: "1rem", fontWeight: 700,
                      color: "#e2e8f0", lineHeight: 1.4,
                    }}
                  >
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
                  <div
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span style={{ color: "#10b981", fontWeight: 700, fontSize: "0.9rem" }}>
                      ${course.price === 0 ? "Free" : course.price.toLocaleString()}
                    </span>
                    <span
                      style={{
                        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                        color: "#10b981", padding: "0.25rem 0.75rem",
                        borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600,
                      }}
                    >
                      ✓ Purchased
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {}
        {courses.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link to="/">
              <button className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Browse More Courses <FiArrowRight size={16} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
