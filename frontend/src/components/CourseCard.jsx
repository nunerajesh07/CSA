



import React, { useState } from "react";
import { FiDollarSign, FiCheckCircle, FiShoppingCart, FiLoader } from "react-icons/fi";
import { purchaseCourse } from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CourseCard=({ course, isPurchased, onPurchaseSuccess })=> {
  const [loading, setLoading] = useState(false);
  const { isUserLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = async () => {

    if (!isUserLoggedIn) {
      toast.error("Please login to purchase courses");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await purchaseCourse(course._id);
      toast.success("Course purchased successfully! 🎉");
      if (onPurchaseSuccess) onPurchaseSuccess(course._id); 
    } catch (err) {
      const message = err.response?.data?.message || "Purchase failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="animate-card-in"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      {}
      <div style={{ position: "relative", overflow: "hidden", height: "180px" }}>
        <img
          src={course.imageURL || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
          alt={course.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";
          }}
        />
        {}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "rgba(255,255,255,0.85)",
          }}
        />
        {}
        {isPurchased && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#10b981",
              color: "white",
              padding: "0.25rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              boxShadow: "0 2px 8px rgba(16,185,129,0.4)",
            }}
          >
            <FiCheckCircle size={12} />
            Purchased
          </div>
        )}
      </div>

      {}
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 700,
            color: "#e2e8f0",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {course.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "#94a3b8",
            lineHeight: 1.6,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            flex: 1,
          }}
        >
          {course.description}
        </p>

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <FiDollarSign size={16} color="#10b981" />
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#10b981",
              }}
            >
              {course.price === 0 ? "Free" : `${course.price.toLocaleString()}`}
            </span>
          </div>

          {isPurchased ? (
            <button
              disabled
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#10b981",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "not-allowed",
              }}
            >
              <FiCheckCircle size={14} />
              Enrolled
            </button>
          ) : (
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                fontSize: "0.8rem",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                  Buying...
                </>
              ) : (
                <>
                  <FiShoppingCart size={14} />
                  Buy Now
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
export default CourseCard