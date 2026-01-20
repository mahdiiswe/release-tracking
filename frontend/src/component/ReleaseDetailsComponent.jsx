import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRelease } from "../services/ReleaseService";

const ReleaseDetailsComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [release, setRelease] = useState(null);

  function formatDateDisplay(value) {
    if (!value) return "";
    const maybeDate = new Date(value);
    if (!isNaN(maybeDate.getTime())) {
      const dd = String(maybeDate.getDate()).padStart(2, "0");
      const monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      const m = monthNames[maybeDate.getMonth()];
      const y = maybeDate.getFullYear();
      return `${dd}-${m}-${y}`;
    }
    return value;
  }

  useEffect(() => {
    if (!id) return;
    getRelease(id)
      .then((res) => setRelease(res.data))
      .catch((err) => {
        console.error("Error fetching release:", err);
      });
  }, [id]);

  if (!release) {
    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-body">Loading...</div>
        </div>
      </div>
    );
  }

  // Format field names to readable labels
  const formatFieldName = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getValue = (key, value) => {
    if (/(date|Date)$/i.test(key) || /\d{4}-\d{2}-\d{2}/.test(String(value))) {
      return formatDateDisplay(value);
    }
    return String(value || "N/A");
  };

  return (
    <div className="container mt-4 mb-4">
      <div
        className="card shadow-lg"
        style={{ borderRadius: "12px", border: "none" }}
      >
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
            padding: "1.5rem",
          }}
        >
          <h4 className="mb-0">
            <i className="bi bi-file-earmark-text"></i> Release Details
          </h4>
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigate(-1)}
            style={{ borderRadius: "6px" }}
          >
            ← Back
          </button>
        </div>

        <div className="card-body p-3">
          <div className="row g-3">
            {Object.keys(release).map((key) => {
              const fieldName = formatFieldName(key);
              const fieldValue = getValue(key, release[key]);

              return (
                <div key={key} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div
                    className="form-group"
                    style={{
                      background: "#f8f9fa",
                      padding: "0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #e9ecef",
                      transition: "all 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 3px 10px rgba(102, 126, 234, 0.15)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 1px 3px rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#667eea",
                        marginBottom: "0.4rem",
                        display: "block",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {fieldName}
                    </label>
                    <div
                      className="form-control"
                      style={{
                        background: "white",
                        border: "1px solid #dee2e6",
                        color: "#212529",
                        fontWeight: "500",
                        fontSize: "0.85rem",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "5px",
                        minHeight: "auto",
                        maxHeight: "60px",
                        overflow: "auto",
                        display: "flex",
                        alignItems: "center",
                        cursor: "default",
                        wordBreak: "break-word",
                      }}
                      title={fieldValue}
                    >
                      {fieldValue}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-top">
            <div className="d-flex gap-2 justify-content-between">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
                style={{ borderRadius: "6px", minWidth: "120px" }}
              >
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/edit-release/${release.id}`)}
                style={{
                  borderRadius: "6px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  minWidth: "120px",
                }}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseDetailsComponent;
