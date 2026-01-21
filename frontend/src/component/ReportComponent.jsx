import React, { useEffect, useState } from "react";
import { getReleases } from "../services/ReleaseService";
import { useNavigate } from "react-router-dom";

const ReportComponent = () => {
  const navigate = useNavigate();
  const [releases, setReleases] = useState([]);
  const [filteredReleases, setFilteredReleases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Single filter states
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  // Date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Unique values for dropdowns
  const [domains, setDomains] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [teams, setTeams] = useState([]);

  // Load all releases
  useEffect(() => {
    fetchAllReleases();
  }, []);

  function fetchAllReleases() {
    setLoading(true);
    getReleases()
      .then((response) => {
        const data = response.data;
        setReleases(data);
        setFilteredReleases(data);

        // Extract unique values for filters
        const uniqueDomains = [...new Set(data.map((r) => r.domain))].filter(
          Boolean,
        );
        const uniqueStatuses = [
          ...new Set(data.map((r) => r.release_Status)),
        ].filter(Boolean);
        const uniqueTypes = [
          ...new Set(data.map((r) => r.release_Type)),
        ].filter(Boolean);
        const uniqueTeams = [
          ...new Set(data.map((r) => r.assigned_Team_Members)),
        ].filter(Boolean);

        setDomains(uniqueDomains);
        setStatuses(uniqueStatuses);
        setTypes(uniqueTypes);
        setTeams(uniqueTeams);
      })
      .catch((error) => {
        console.error("Error fetching releases:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [
    selectedDomain,
    selectedStatus,
    selectedType,
    selectedTeam,
    startDate,
    endDate,
    searchTerm,
  ]);

  function applyFilters() {
    let filtered = releases;

    // Domain filter
    if (selectedDomain) {
      filtered = filtered.filter((r) => r.domain === selectedDomain);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter((r) => r.release_Status === selectedStatus);
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter((r) => r.release_Type === selectedType);
    }

    // Team filter
    if (selectedTeam) {
      filtered = filtered.filter(
        (r) => r.assigned_Team_Members === selectedTeam,
      );
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter((r) => {
        const releaseDate = new Date(r.release_Date);
        return releaseDate >= new Date(startDate);
      });
    }

    if (endDate) {
      filtered = filtered.filter((r) => {
        const releaseDate = new Date(r.release_Date);
        return releaseDate <= new Date(endDate);
      });
    }

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((r) => {
        const hay =
          `${r.sl} ${r.release_Id} ${r.release_Title} ${r.domain} ${r.client_Name}`.toLowerCase();
        return hay.includes(q);
      });
    }

    setFilteredReleases(filtered);
  }

  // Reset all filters
  function resetFilters() {
    setSelectedDomain("");
    setSelectedStatus("");
    setSelectedType("");
    setSelectedTeam("");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  }

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

  const activeFilters = [
    selectedDomain,
    selectedStatus,
    selectedType,
    selectedTeam,
    startDate,
    endDate,
  ].filter(Boolean).length;

  return (
    <div className="container mt-4 mb-5">
      <div
        className="card shadow-lg"
        style={{ borderRadius: "12px", border: "none" }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: 0, fontWeight: "600" }}>
            📊 Release Report & Analytics
          </h3>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              opacity: 0.9,
              fontSize: "0.95rem",
            }}
          >
            Filter releases by single or multiple criteria
          </p>
        </div>

        <div className="card-body p-4">
          {/* Search Bar */}
          <div className="mb-4">
            <label className="form-label fw-600" style={{ color: "#495057" }}>
              🔍 Search:
            </label>
            <input
              type="search"
              className="form-control"
              placeholder="Search by Release ID, Title, Domain, Client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: "6px", padding: "0.75rem" }}
            />
          </div>

          {/* Filters Section */}
          <div className="row g-3 mb-4">
            {/* Domain Filter */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-600" style={{ color: "#495057" }}>
                🏢 Domain:
              </label>
              <select
                className="form-select"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                style={{ borderRadius: "6px", padding: "0.6rem" }}
              >
                <option value="">All Domains</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-600" style={{ color: "#495057" }}>
                ✅ Status:
              </label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ borderRadius: "6px", padding: "0.6rem" }}
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-600" style={{ color: "#495057" }}>
                📦 Release Type:
              </label>
              <select
                className="form-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ borderRadius: "6px", padding: "0.6rem" }}
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Filter */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-600" style={{ color: "#495057" }}>
                👥 Team Member:
              </label>
              <select
                className="form-select"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                style={{ borderRadius: "6px", padding: "0.6rem" }}
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-600" style={{ color: "#495057" }}>
                📅 Start Date:
              </label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ borderRadius: "6px", padding: "0.6rem" }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-600" style={{ color: "#495057" }}>
                📅 End Date:
              </label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ borderRadius: "6px", padding: "0.6rem" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-4">
            <button
              className="btn text-white"
              onClick={resetFilters}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              🔄 Reset Filters
            </button>
            <span
              className="badge bg-info"
              style={{
                alignSelf: "center",
                fontSize: "0.9rem",
                padding: "0.6rem 1rem",
              }}
            >
              {activeFilters > 0
                ? `${activeFilters} filter(s) active`
                : "No filters applied"}
            </span>
          </div>

          {/* Active Filters Display */}
          {activeFilters > 0 && (
            <div
              className="alert alert-light border"
              style={{
                borderRadius: "6px",
                marginBottom: "1.5rem",
                backgroundColor: "#f8f9fa",
              }}
            >
              <strong style={{ color: "#667eea" }}>🔍 Active Filters:</strong>
              <div
                style={{
                  marginTop: "0.75rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {searchTerm && (
                  <span
                    className="badge"
                    style={{
                      background: "#667eea",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSearchTerm("")}
                  >
                    Search: "{searchTerm}" ✕
                  </span>
                )}
                {selectedDomain && (
                  <span
                    className="badge"
                    style={{
                      background: "#28a745",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedDomain("")}
                  >
                    Domain: {selectedDomain} ✕
                  </span>
                )}
                {selectedStatus && (
                  <span
                    className="badge"
                    style={{
                      background: "#ffc107",
                      color: "black",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedStatus("")}
                  >
                    Status: {selectedStatus} ✕
                  </span>
                )}
                {selectedType && (
                  <span
                    className="badge"
                    style={{
                      background: "#17a2b8",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedType("")}
                  >
                    Type: {selectedType} ✕
                  </span>
                )}
                {selectedTeam && (
                  <span
                    className="badge"
                    style={{
                      background: "#e83e8c",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedTeam("")}
                  >
                    Team: {selectedTeam} ✕
                  </span>
                )}
                {startDate && (
                  <span
                    className="badge"
                    style={{
                      background: "#fd7e14",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setStartDate("")}
                  >
                    From: {startDate} ✕
                  </span>
                )}
                {endDate && (
                  <span
                    className="badge"
                    style={{
                      background: "#dc3545",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setEndDate("")}
                  >
                    To: {endDate} ✕
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          <div
            className="alert alert-light border"
            style={{ borderRadius: "6px" }}
          >
            <strong>📈 Results:</strong> Showing {filteredReleases.length} of{" "}
            {releases.length} releases
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ padding: 0 }}>
            <table
              className="table table-striped table-bordered table-hover mb-0"
              style={{
                width: "100%",
                margin: 0,
                borderCollapse: "collapse",
              }}
            >
              <thead className="table-light">
                <tr>
                  <th style={{ width: "50px" }}>SL</th>
                  <th style={{ width: "100px" }}>Release ID</th>
                  <th style={{ width: "90px" }}>Date</th>
                  <th style={{ width: "70px" }}>Domain</th>
                  <th style={{ flex: 1, minWidth: "200px" }}>Release Title</th>
                  <th style={{ width: "90px" }}>Status</th>
                  <th style={{ width: "100px" }}>Team Member</th>
                  <th style={{ width: "100px" }}>Client</th>
                  <th style={{ width: "70px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReleases.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <span style={{ color: "#6c757d" }}>
                        No releases found matching your criteria
                      </span>
                    </td>
                  </tr>
                ) : (
                  filteredReleases.map((release) => (
                    <tr key={release.id}>
                      <td style={{ width: "50px" }}>{release.sl}</td>
                      <td style={{ width: "100px" }}>
                        <strong>{release.release_Id}</strong>
                      </td>
                      <td style={{ width: "90px" }}>
                        {formatDateDisplay(release.release_Date)}
                      </td>
                      <td style={{ width: "70px" }}>
                        <span
                          className="badge"
                          style={{
                            background: "#667eea",
                            color: "white",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "4px",
                          }}
                        >
                          {release.domain}
                        </span>
                      </td>
                      <td
                        style={{
                          flex: 1,
                          minWidth: "200px",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {release.release_Title}
                      </td>
                      <td style={{ width: "90px" }}>
                        <span
                          className="badge"
                          style={{
                            background:
                              release.release_Status === "Delivered"
                                ? "#28a745"
                                : "#ffc107",
                            color:
                              release.release_Status === "Delivered"
                                ? "white"
                                : "black",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "4px",
                          }}
                        >
                          {release.release_Status}
                        </span>
                      </td>
                      <td style={{ width: "100px" }}>
                        {release.assigned_Team_Members}
                      </td>
                      <td style={{ width: "100px" }}>{release.client_Name}</td>
                      <td style={{ width: "70px" }}>
                        <button
                          className="btn btn-light btn-sm border"
                          title="View Details"
                          onClick={() =>
                            navigate(`/release-details/${release.id}`)
                          }
                          style={{
                            padding: "6px 8px",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#0d6efd"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8z" />
                            <path
                              d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
                              fill="#fff"
                            />
                          </svg>
                          <span
                            style={{ fontSize: "0.8rem", fontWeight: "500" }}
                          >
                            View Details
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="row g-3 mt-4">
            <div className="col-md-3">
              <div
                className="p-3 rounded"
                style={{
                  background: "#e7f3ff",
                  borderLeft: "4px solid #667eea",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                  Total Releases
                </div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#667eea",
                  }}
                >
                  {releases.length}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="p-3 rounded"
                style={{
                  background: "#e8f5e9",
                  borderLeft: "4px solid #28a745",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                  Filtered Results
                </div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#28a745",
                  }}
                >
                  {filteredReleases.length}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="p-3 rounded"
                style={{
                  background: "#fff3cd",
                  borderLeft: "4px solid #ffc107",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                  Delivered
                </div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#ffc107",
                  }}
                >
                  {
                    filteredReleases.filter(
                      (r) => r.release_Status === "Delivered",
                    ).length
                  }
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="p-3 rounded"
                style={{
                  background: "#f3e5f5",
                  borderLeft: "4px solid #764ba2",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                  Unique Domains
                </div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#764ba2",
                  }}
                >
                  {[...new Set(filteredReleases.map((r) => r.domain))].length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportComponent;
