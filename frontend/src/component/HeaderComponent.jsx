import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderComponent = () => {
  const navigate = useNavigate();

  // মেনু আইটেমগুলোর জন্য কমন স্টাইল
  const navLinkStyle = {
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
  };

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        padding: "0.5rem 0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <nav
        className="navbar navbar-expand-md navbar-dark"
        style={{ background: "transparent" }}
      >
        <div className="container-fluid">
          {/* Logo / Brand */}
          <a
            className="navbar-brand"
            onClick={() => navigate("/")}
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              cursor: "pointer",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>📊</span>
            Release Tracking
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Dashboard Link - নতুন যুক্ত করা হয়েছে */}
              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() => navigate("/dashboard")}
                  style={navLinkStyle}
                >
                  📈 Dashboard
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() => navigate("/releases")}
                  style={navLinkStyle}
                >
                  📋 Releases
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() => navigate("/add-release")}
                  style={navLinkStyle}
                >
                  ➕ Add Release
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() => navigate("/report")}
                  style={navLinkStyle}
                >
                  📊 Report & Filter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;
