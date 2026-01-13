import React, { useEffect, useState } from "react";
import { delRelease, getReleases } from "../services/ReleaseService";
import { useNavigate } from "react-router-dom";

const ListReleaseComponent = () => {
  const [releases, setRelease] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const navigator = useNavigate();

  function formatDateDisplay(value) {
    if (!value) return "";
    // accept yyyy-mm-dd or ISO strings
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
    getAllReleases();
  }, []);

  // এই ফাংশনটি আপনার কোডে মিসিং ছিল
  function getAllReleases() {
    getReleases()
      .then((response) => {
        setRelease(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }

  function addNewRelease() {
    navigator("/add-release");
  }

  function relaseUpdate(id) {
    navigator(`/edit-release/${id}`);
  }

  function removeRelease(id) {
    if (window.confirm("Are you sure you want to delete this release?")) {
      delRelease(id)
        .then(() => {
          getAllReleases();
        })
        .catch((error) => {
          console.error("Error deleting release:", error);
        });
    }
  }

  return (
    <div className="container mt-4">
      <div
        className="card shadow-sm mb-3"
        style={{ border: "1px solid #e6edf2", borderRadius: 8 }}
      >
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#fff", borderBottom: "1px solid #eef3f6" }}
        >
          <h5 className="mb-0">Release List</h5>
          <button
            className="btn btn-primary btn-sm"
            onClick={addNewRelease}
            style={{ minWidth: 90 }}
          >
            Add Release
          </button>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <div>
                <label className="me-2">Rows per page:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="form-select d-inline-block"
                  style={{ width: "80px" }}
                >
                  <option value={6}>6</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search releases..."
                  style={{ width: 260 }}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div>
              <small className="text-muted">
                Total records:{" "}
                {
                  releases.filter((r) => {
                    const q = searchTerm.trim().toLowerCase();
                    if (!q) return true;
                    const hay =
                      `${r.sl} ${r.release_Id} ${r.release_Title} ${r.domain} ${r.assigned_Team_Members} ${r.client_Name}`.toLowerCase();
                    return hay.includes(q);
                  }).length
                }
              </small>
            </div>
          </div>

          <div className="table-responsive" style={{ padding: 0 }}>
            <table
              className="table table-striped table-bordered table-hover mb-0"
              style={{
                minWidth: "1000px",
                width: "100%",
                margin: 0,
                borderCollapse: "collapse",
              }}
            >
              <thead className="table-light">
                <tr>
                  <th style={{ width: "60px" }}>SL</th>
                  <th style={{ width: "140px" }}>Release ID</th>
                  <th style={{ width: "120px" }}>Date</th>
                  <th style={{ width: "120px" }}>Domain</th>
                  <th>Release Title</th>
                  <th style={{ width: "120px" }}>Team Members</th>
                  <th style={{ width: "150px" }}>Client</th>
                  <th style={{ width: "130px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered = releases.filter((r) => {
                    const q = searchTerm.trim().toLowerCase();
                    if (!q) return true;
                    const hay =
                      `${r.sl} ${r.release_Id} ${r.release_Title} ${r.domain} ${r.assigned_Team_Members} ${r.client_Name}`.toLowerCase();
                    return hay.includes(q);
                  });

                  const start = (currentPage - 1) * pageSize;
                  const end = start + pageSize;
                  const pageItems = filtered.slice(start, end);

                  if (pageItems.length === 0) {
                    return (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No data found
                        </td>
                      </tr>
                    );
                  }

                  return pageItems.map((release) => (
                    <tr key={release.id}>
                      <td>{release.sl}</td>
                      <td>{release.release_Id}</td>
                      <td>{formatDateDisplay(release.release_Date)}</td>
                      <td>{release.domain}</td>
                      <td
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {release.release_Title}
                      </td>
                      <td>{release.assigned_Team_Members}</td>
                      <td>{release.client_Name}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {/* Actions: details (eye), edit (pen), delete (trash) as compact icons */}
                          <button
                            className="btn btn-light btn-sm border"
                            title="Details"
                            onClick={() =>
                              navigator(`/release-details/${release.id}`)
                            }
                            style={{ padding: "6px 8px", lineHeight: 1 }}
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
                          </button>
                          <button
                            className="btn btn-light btn-sm border"
                            title="Edit"
                            onClick={() => relaseUpdate(release.id)}
                            style={{ padding: "6px 8px", lineHeight: 1 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#0d6efd"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l2.0 2.0a.5.5 0 0 1 0 .708L4.207 13.5H2v-2.207L12.146.146zM11.207 2L3 10.207V12h1.793L13 3.793 11.207 2z" />
                            </svg>
                          </button>
                          <button
                            className="btn btn-light btn-sm border"
                            title="Delete"
                            onClick={() => removeRelease(release.id)}
                            style={{ padding: "6px 8px", lineHeight: 1 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#dc3545"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5zm3 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5z" />
                              <path
                                fillRule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2h3.379a1 1 0 0 1 .894-.553h2.454c.39 0 .744.226.894.553H14.5a1 1 0 0 1 1 1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {releases.length > 0 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(1)}
                  >
                    First
                  </button>
                </li>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                </li>

                {(() => {
                  const totalPages = Math.ceil(releases.length / pageSize);
                  const pages = [];
                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 ||
                      i === totalPages ||
                      (i >= currentPage - 2 && i <= currentPage + 2)
                    ) {
                      pages.push(
                        <li
                          key={i}
                          className={`page-item ${
                            currentPage === i ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(i)}
                          >
                            {i}
                          </button>
                        </li>
                      );
                    } else if (i === currentPage - 3 || i === currentPage + 3) {
                      pages.push(
                        <li key={i} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                  }
                  return pages;
                })()}

                <li
                  className={`page-item ${
                    currentPage === Math.ceil(releases.length / pageSize)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(Math.ceil(releases.length / pageSize), p + 1)
                      )
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListReleaseComponent;
