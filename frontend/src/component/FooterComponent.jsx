import React from "react";

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "2rem 0",
        marginTop: "3rem",
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <h5 style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
              📊 Release Tracking
            </h5>
            <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
              Manage releases efficiently
            </p>
          </div>

          <div className="col-md-4 text-center mb-3 mb-md-0">
            <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
              © {currentYear} All Rights Reserved
            </p>
          </div>

          <div className="col-md-4 text-center">
            <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "500" }}>
              👨‍💼 Developed by <strong>Mahdi</strong>
            </p>
          </div>
        </div>

        <hr
          style={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            margin: "1.5rem 0",
          }}
        />

        <div className="text-center">
          <small style={{ opacity: 0.8 }}>
            Version 1.0 | Secure Release Management System
          </small>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
