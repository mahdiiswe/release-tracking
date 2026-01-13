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

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Release Details</h5>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            {Object.keys(release).map((key) => (
              <div key={key} className="col-12 col-md-6 mb-2">
                <div style={{ fontSize: 12, color: "#6c757d" }}>{key}</div>
                <div style={{ fontWeight: 500 }}>
                  {/(date|Date)$/i.test(key) ||
                  /\d{4}-\d{2}-\d{2}/.test(String(release[key]))
                    ? formatDateDisplay(release[key])
                    : String(release[key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseDetailsComponent;
