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

  // Column management
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [dynamicFilters, setDynamicFilters] = useState({});
  const [dynamicFilterValues, setDynamicFilterValues] = useState({});
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
  const [selectedDynamicFilters, setSelectedDynamicFilters] = useState([]);

  // Default display columns (main table)
  const defaultDisplayColumns = [
    "sl",
    "release_Id",
    "release_Date",
    "domain",
    "release_Title",
    "release_Status",
  ];

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

        // Extract all unique column names from the data
        const allColumns = new Set();
        data.forEach((record) => {
          Object.keys(record).forEach((key) => allColumns.add(key));
        });
        const columnList = Array.from(allColumns).sort();
        setAvailableColumns(columnList);
        setDisplayColumns(defaultDisplayColumns);
        setExportColumns(columnList);

        // Extract unique values for static filters (Domain, Status, Type, Team) - case insensitive with trim
        const uniqueDomains = [
          ...new Set(
            data
              .map((r) =>
                String(r.domain || "")
                  .toLowerCase()
                  .trim(),
              )
              .filter((v) => v.length > 0),
          ),
        ].sort();
        const uniqueStatuses = [
          ...new Set(
            data
              .map((r) =>
                String(r.release_Status || "")
                  .toLowerCase()
                  .trim(),
              )
              .filter((v) => v.length > 0),
          ),
        ].sort();
        const uniqueTypes = [
          ...new Set(
            data
              .map((r) =>
                String(r.release_Type || "")
                  .toLowerCase()
                  .trim(),
              )
              .filter((v) => v.length > 0),
          ),
        ].sort();
        const uniqueTeams = [
          ...new Set(
            data
              .map((r) =>
                String(r.assigned_Team_Members || "")
                  .toLowerCase()
                  .trim(),
              )
              .filter((v) => v.length > 0),
          ),
        ].sort();

        setDomains(uniqueDomains);
        setStatuses(uniqueStatuses);
        setTypes(uniqueTypes);
        setTeams(uniqueTeams);

        // Extract unique values for dynamic filters - case insensitive with trim
        const filterObj = {};
        columnList.forEach((col) => {
          const uniqueValues = [
            ...new Set(
              data
                .map((r) =>
                  String(r[col] || "")
                    .toLowerCase()
                    .trim(),
                )
                .filter((v) => v.length > 0),
            ),
          ]
            .sort()
            .slice(0, 50); // Limit to 50 unique values
          if (uniqueValues.length > 1 && uniqueValues.length <= 50) {
            filterObj[col] = uniqueValues;
          }
        });
        setDynamicFilters(filterObj);
        // Initialize selectedDynamicFilters with all available dynamic filters
        setSelectedDynamicFilters(Object.keys(filterObj));
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
    dynamicFilterValues,
  ]);

  function applyFilters() {
    let filtered = releases;

    // Domain filter - case insensitive LIKE
    if (selectedDomain) {
      filtered = filtered.filter((r) =>
        String(r.domain || "")
          .toLowerCase()
          .includes(selectedDomain.toLowerCase()),
      );
    }

    // Status filter - case insensitive LIKE
    if (selectedStatus) {
      filtered = filtered.filter((r) =>
        String(r.release_Status || "")
          .toLowerCase()
          .includes(selectedStatus.toLowerCase()),
      );
    }

    // Type filter - case insensitive LIKE
    if (selectedType) {
      filtered = filtered.filter((r) =>
        String(r.release_Type || "")
          .toLowerCase()
          .includes(selectedType.toLowerCase()),
      );
    }

    // Team filter - case insensitive LIKE
    if (selectedTeam) {
      filtered = filtered.filter((r) =>
        String(r.assigned_Team_Members || "")
          .toLowerCase()
          .includes(selectedTeam.toLowerCase()),
      );
    }

    // Dynamic filters - case insensitive LIKE with trim
    Object.keys(dynamicFilterValues).forEach((colName) => {
      const value = dynamicFilterValues[colName];
      if (value) {
        filtered = filtered.filter((r) =>
          String(r[colName] || "")
            .toLowerCase()
            .trim()
            .includes(value.toLowerCase().trim()),
        );
      }
    });

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
    setDynamicFilterValues({});
  }

  // Export filtered data to Excel
  function exportToExcel() {
    if (filteredReleases.length === 0) {
      alert("No data to export. Please apply filters or ensure data exists.");
      return;
    }

    // Use selected export columns
    const headers = exportColumns.length > 0 ? exportColumns : availableColumns;

    // Create rows with selected columns
    const rows = filteredReleases.map((release) => {
      return headers.map((key) => {
        const value = release[key];
        // Format dates if needed
        if (
          (/(date|Date)$/i.test(key) ||
            /\d{4}-\d{2}-\d{2}/.test(String(value))) &&
          value
        ) {
          return formatDateDisplay(value);
        }
        return value || "";
      });
    });

    // Create CSV content
    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent +=
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            const cellStr = String(cell || "");
            return cellStr.includes(",")
              ? `"${cellStr.replace(/"/g, '""')}"`
              : cellStr;
          })
          .join(",") + "\n";
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `releases_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    searchTerm,
    ...Object.values(dynamicFilterValues),
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

          {/* Date Range Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-600" style={{ color: "#495057" }}>
                📅 Start Date:
              </label>
              <input
                ref={(ref) => {
                  if (ref && !ref.dataset.clickHandlerAttached) {
                    ref.addEventListener("click", () => ref.showPicker?.());
                    ref.dataset.clickHandlerAttached = "true";
                  }
                }}
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
                style={{
                  borderRadius: "6px",
                  padding: "0.6rem",
                  cursor: "pointer",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-600" style={{ color: "#495057" }}>
                📅 End Date:
              </label>
              <input
                ref={(ref) => {
                  if (ref && !ref.dataset.clickHandlerAttached) {
                    ref.addEventListener("click", () => ref.showPicker?.());
                    ref.dataset.clickHandlerAttached = "true";
                  }
                }}
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
                style={{
                  borderRadius: "6px",
                  padding: "0.6rem",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
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
            <button
              className="btn text-white"
              onClick={exportToExcel}
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              📥 Export to Excel
            </button>
            <button
              className="btn text-white"
              onClick={() => setShowColumnModal(true)}
              style={{
                background: "linear-gradient(135deg, #17a2b8 0%, #20c997 100%)",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              ⚙️ Configure Filters & Columns
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

          {/* Dynamic Filters Section - Only show enabled filters */}
          {selectedDynamicFilters.length > 0 && (
            <div className="mb-4">
              <h6
                style={{
                  color: "#667eea",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                🔽 Additional Filters ({selectedDynamicFilters.length})
              </h6>
              <div className="row g-3">
                {selectedDynamicFilters.map((colName) => (
                  <div key={colName} className="col-md-6 col-lg-3">
                    <label
                      className="form-label fw-600"
                      style={{ color: "#495057" }}
                    >
                      {colName}:
                    </label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        value={dynamicFilterValues[colName] || ""}
                        onChange={(e) => {
                          setDynamicFilterValues({
                            ...dynamicFilterValues,
                            [colName]: e.target.value,
                          });
                        }}
                        style={{
                          borderRadius: "6px 0 0 6px",
                          padding: "0.6rem",
                        }}
                      >
                        <option value="">Select or type...</option>
                        {dynamicFilters[colName] &&
                          dynamicFilters[colName].map((val) => (
                            <option key={val} value={val}>
                              {val.toUpperCase()}
                            </option>
                          ))}
                      </select>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type value..."
                        value={dynamicFilterValues[colName] || ""}
                        onChange={(e) => {
                          setDynamicFilterValues({
                            ...dynamicFilterValues,
                            [colName]: e.target.value,
                          });
                        }}
                        style={{
                          borderRadius: "0 6px 6px 0",
                          padding: "0.6rem",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Column Configuration Modal */}
          {showColumnModal && (
            <div
              className="modal d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)", display: "block" }}
            >
              <div
                className="modal-dialog modal-lg"
                style={{ marginTop: "3rem" }}
              >
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                  <div
                    className="modal-header"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    <h5 className="modal-title">
                      ⚙️ Filters & Columns Configuration
                    </h5>
                    <button
                      className="btn-close btn-close-white"
                      onClick={() => setShowColumnModal(false)}
                    ></button>
                  </div>
                  <div
                    className="modal-body"
                    style={{ maxHeight: "75vh", overflowY: "auto" }}
                  >
                    {/* Dynamic Filters Configuration Section */}
                    <h6
                      className="mb-3"
                      style={{ color: "#667eea", fontWeight: "700" }}
                    >
                      🔹 Enable/Disable Dynamic Filters
                    </h6>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#666",
                        marginBottom: "1rem",
                      }}
                    >
                      Select which columns should appear as filters on the main
                      page
                    </p>
                    <div className="d-flex gap-2 mb-3">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          setSelectedDynamicFilters(Object.keys(dynamicFilters))
                        }
                      >
                        ✓ Enable All
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setSelectedDynamicFilters([])}
                      >
                        ✗ Disable All
                      </button>
                    </div>
                    <div
                      className="row g-2"
                      style={{
                        maxHeight: "350px",
                        overflowY: "auto",
                        border: "1px solid #dee2e6",
                        padding: "0.75rem",
                        borderRadius: "6px",
                        marginBottom: "2rem",
                      }}
                    >
                      {Object.keys(dynamicFilters).map((col) => (
                        <div key={col} className="col-md-6 col-lg-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`filter-${col}`}
                              checked={selectedDynamicFilters.includes(col)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDynamicFilters([
                                    ...selectedDynamicFilters,
                                    col,
                                  ]);
                                } else {
                                  setSelectedDynamicFilters(
                                    selectedDynamicFilters.filter(
                                      (c) => c !== col,
                                    ),
                                  );
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`filter-${col}`}
                              style={{ fontSize: "0.9rem" }}
                            >
                              {col}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr style={{ margin: "2rem 0" }} />

                    {/* Export Columns Section */}
                    <h6
                      className="mb-3"
                      style={{ color: "#667eea", fontWeight: "700" }}
                    >
                      📥 Excel Export Columns
                    </h6>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#666",
                        marginBottom: "1rem",
                      }}
                    >
                      Select which columns to include in Excel export
                    </p>
                    <div className="d-flex gap-2 mb-3">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => setExportColumns([...availableColumns])}
                      >
                        ✓ Select All
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setExportColumns([])}
                      >
                        ✗ Deselect All
                      </button>
                    </div>
                    <div
                      className="row g-2"
                      style={{
                        maxHeight: "350px",
                        overflowY: "auto",
                        border: "1px solid #dee2e6",
                        padding: "0.75rem",
                        borderRadius: "6px",
                      }}
                    >
                      {availableColumns.map((col) => (
                        <div key={col} className="col-md-6 col-lg-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`export-${col}`}
                              checked={exportColumns.includes(col)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setExportColumns([...exportColumns, col]);
                                } else {
                                  setExportColumns(
                                    exportColumns.filter((c) => c !== col),
                                  );
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`export-${col}`}
                              style={{ fontSize: "0.9rem" }}
                            >
                              {col}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowColumnModal(false)}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Filters Section - REMOVED, moved to modal */}

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
                {Object.keys(dynamicFilterValues).map((colName) => {
                  const value = dynamicFilterValues[colName];
                  if (!value) return null;
                  return (
                    <span
                      key={colName}
                      className="badge"
                      style={{
                        background: "#6f42c1",
                        color: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const newValues = { ...dynamicFilterValues };
                        delete newValues[colName];
                        setDynamicFilterValues(newValues);
                      }}
                    >
                      {colName}: {value} ✕
                    </span>
                  );
                })}
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
