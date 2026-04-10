


import React from "react";

const LoadingSpinner=({ message = "Loading..." })=> {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "300px",
        gap: "1rem",
        color: "#94a3b8",
      }}
    >
      {}
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "3px solid rgba(37,99,235,0.2)",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{message}</span>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
export default LoadingSpinner