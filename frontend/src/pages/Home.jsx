




import React, { useState, useEffect } from "react";
import { getCoursesPreview, getUserPurchases } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiSearch, FiFilter, FiBookOpen, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [purchasedIds, setPurchasedIds] = useState(new Set()); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); 
  const { isUserLoggedIn } = useAuth();

  useEffect(() => {
    fetchData();
  }, [isUserLoggedIn]);

  const fetchData = async () => {
    setLoading(true);
    try {

      const coursesRes = await getCoursesPreview();
      setCourses(coursesRes.data.courses);

      if (isUserLoggedIn) {
        const purchasesRes = await getUserPurchases();
        const ids = new Set(purchasesRes.data.courses.map((c) => c._id));
        setPurchasedIds(ids);
      }
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSuccess = (courseId) => {
    setPurchasedIds((prev) => new Set([...prev, courseId]));
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt); 
  });

  return (
    <div style={{ minHeight: "calc(100vh - 64px)" }}>
      {}
      <div
        style={{
          background: "rgba(37,99,235,0.04)",
          borderBottom: "1px solid var(--color-border)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(37,99,235,0.1)",
              border: "1px solid rgba(37,99,235,0.2)",
              borderRadius: "20px",
              padding: "0.375rem 1rem",
              fontSize: "0.8rem",
              color: "var(--color-primary)",
              marginBottom: "1.5rem",
              fontWeight: 500,
            }}
          >
            <FiTrendingUp size={14} />
            {courses.length}+ Courses Available
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              margin: "0 0 1rem",
              lineHeight: 1.1,
            }}
          >
            <span className="gradient-text">Master New Skills</span>
            <br />
            <span style={{ color: "var(--color-text)" }}>At Your Own Pace</span>
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "1.1rem", margin: "0 0 2rem", lineHeight: 1.7 }}>
            Explore our curated library of expert-led courses and unlock your potential.
          </p>
          {!isUserLoggedIn && (
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/signup">
                <button className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
                  Get Started Free
                </button>
              </Link>
              <Link to="/login">
                <button className="btn-secondary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }}>
                  Sign In
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {}
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <FiSearch
              size={16}
              style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}
            />
            <input
              id="course-search"
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>

          {}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiFilter size={16} color="#64748b" />
            <select
              id="course-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
              style={{ width: "auto", paddingLeft: "0.75rem", cursor: "pointer" }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {}
        <div style={{ marginBottom: "1.5rem", color: "#64748b", fontSize: "0.875rem" }}>
          {searchQuery ? (
            <span>
              Showing{" "}
              <strong style={{ color: "#6366f1" }}>{sorted.length}</strong> results for "
              <em>{searchQuery}</em>"
            </span>
          ) : (
            <span>
              All Courses{" "}
              <span
                style={{
                  background: "rgba(37,99,235,0.1)",
                  color: "#a5b4fc",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "10px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginLeft: "0.25rem",
                }}
              >
                {sorted.length}
              </span>
            </span>
          )}
        </div>

        {}
        {loading && <LoadingSpinner message="Loading courses..." />}

        {}
        {!loading && sorted.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "#64748b",
            }}
          >
            <FiBookOpen size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <h3 style={{ margin: "0 0 0.5rem", color: "#94a3b8" }}>
              {searchQuery ? "No courses found" : "No courses yet"}
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem" }}>
              {searchQuery
                ? `Try a different search term`
                : "Check back soon for new courses!"}
            </p>
          </div>
        )}

        {}
        {!loading && sorted.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {sorted.map((course, index) => (
              <div
                key={course._id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CourseCard
                  course={course}
                  isPurchased={purchasedIds.has(course._id)}
                  onPurchaseSuccess={handlePurchaseSuccess}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
