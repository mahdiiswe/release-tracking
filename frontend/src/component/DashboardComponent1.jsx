import { useState, useEffect } from "react";
import { ReleaseService } from "../services/ReleaseService";

const DashboardComponent = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReleases: 0,
    currentMonthReleases: 0,
    deliveredReleases: 0,
    pendingReleases: 0,
    clientWise: {},
    domainWise: {},
    statusWise: {},
    teamWise: {},
  });

  const getReleaseService = () => {
    return new ReleaseService();
  };

  useEffect(() => {
    fetchAndAnalyzeData();
  }, []);

  const fetchAndAnalyzeData = () => {
    setLoading(true);
    const service = getReleaseService();
    service
      .getAll()
      .then((response) => {
        const data = response.data;
        setReleases(data);
        analyzeData(data);
      })
      .catch((error) => {
        console.error("Error fetching releases:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const analyzeData = (data) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let currentMonthCount = 0;
    let deliveredCount = 0;
    let pendingCount = 0;
    const clientWiseData = {};
    const domainWiseData = {};
    const statusWiseData = {};
    const teamWiseData = {};

    data.forEach((release) => {
      // Current month count
      if (release.release_Date) {
        const releaseDate = new Date(release.release_Date);
        if (
          releaseDate.getMonth() === currentMonth &&
          releaseDate.getFullYear() === currentYear
        ) {
          currentMonthCount++;
        }
      }

      // Status count
      if (release.release_Status === "Delivered") {
        deliveredCount++;
      } else {
        pendingCount++;
      }

      // Client wise
      const client = release.client_Name || "Unknown";
      clientWiseData[client] = (clientWiseData[client] || 0) + 1;

      // Domain wise
      const domain = release.domain || "Unknown";
      domainWiseData[domain] = (domainWiseData[domain] || 0) + 1;

      // Status wise
      const status = release.release_Status || "Unknown";
      statusWiseData[status] = (statusWiseData[status] || 0) + 1;

      // Team wise
      const team = release.assigned_Team_Members || "Unknown";
      teamWiseData[team] = (teamWiseData[team] || 0) + 1;
    });

    setStats({
      totalReleases: data.length,
      currentMonthReleases: currentMonthCount,
      deliveredReleases: deliveredCount,
      pendingReleases: pendingCount,
      clientWise: clientWiseData,
      domainWise: domainWiseData,
      statusWise: statusWiseData,
      teamWise: teamWiseData,
    });
  };

  const StatCard = ({ title, count, icon, color }) => (
    <div className="col-md-6 col-lg-3 mb-4">
      <div
        className="p-4 rounded"
        style={{
          background: color,
          color: "white",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
          }}
        >
          {count}
        </div>
        <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{title}</div>
      </div>
    </div>
  );

  const SummaryList = ({ title, data, color }) => (
    <div
      className="card mb-4"
      style={{
        borderRadius: "12px",
        border: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="card-header"
        style={{
          background: color,
          color: "white",
          fontWeight: "600",
          borderRadius: "12px 12px 0 0",
        }}
      >
        {title}
      </div>
      <div className="card-body">
        {Object.entries(data).length === 0 ? (
          <p style={{ color: "#999" }}>No data available</p>
        ) : (
          Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([key, value], index) => (
              <div
                key={index}
                className="mb-3"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ color: "#333", fontWeight: "500" }}>
                    {key}
                  </span>
                </div>
                <div
                  style={{
                    background: color,
                    color: "white",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "4px",
                    fontWeight: "600",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {value}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );

  return (
    <div className="container-fluid mt-4 mb-5">
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
            📊 Release Management Dashboard
          </h3>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              opacity: 0.9,
              fontSize: "0.95rem",
            }}
          >
            Overview of all releases and analytics
          </p>
        </div>

        <div className="card-body p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Key Metrics Cards */}
              <div className="row">
                <StatCard
                  title="Total Releases"
                  count={stats.totalReleases}
                  icon="📦"
                  color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
                <StatCard
                  title="Current Month"
                  count={stats.currentMonthReleases}
                  icon="📅"
                  color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                />
                <StatCard
                  title="Delivered"
                  count={stats.deliveredReleases}
                  icon="✅"
                  color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                />
                <StatCard
                  title="Pending"
                  count={stats.pendingReleases}
                  icon="⏳"
                  color="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                />
              </div>

              {/* Summary Sections */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <SummaryList
                    title="Client-Wise Summary"
                    data={stats.clientWise}
                    color="#667eea"
                  />
                </div>
                <div className="col-md-6">
                  <SummaryList
                    title="Domain-Wise Summary"
                    data={stats.domainWise}
                    color="#764ba2"
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6">
                  <SummaryList
                    title="Status-Wise Summary"
                    data={stats.statusWise}
                    color="#f093fb"
                  />
                </div>
                <div className="col-md-6">
                  <SummaryList
                    title="Team Member-Wise Summary"
                    data={stats.teamWise}
                    color="#4facfe"
                  />
                </div>
              </div>

              {/* Distribution Charts */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <div
                    className="card"
                    style={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      className="card-header"
                      style={{
                        background: "#667eea",
                        color: "white",
                        fontWeight: "600",
                        borderRadius: "12px 12px 0 0",
                      }}
                    >
                      Status Distribution
                    </div>
                    <div className="card-body">
                      {Object.entries(stats.statusWise).map(
                        ([status, count], index) => {
                          const total = stats.totalReleases;
                          const percentage = ((count / total) * 100).toFixed(1);
                          const colors = ["#4facfe", "#f093fb", "#fa709a"];
                          return (
                            <div key={index} className="mb-3">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                <span style={{ fontWeight: "500" }}>
                                  {status}
                                </span>
                                <span style={{ fontWeight: "600" }}>
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  height: "20px",
                                  background: "#e9ecef",
                                  borderRadius: "4px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    background: colors[index % colors.length],
                                    transition: "width 0.3s ease",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="card"
                    style={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      className="card-header"
                      style={{
                        background: "#764ba2",
                        color: "white",
                        fontWeight: "600",
                        borderRadius: "12px 12px 0 0",
                      }}
                    >
                      Top 5 Clients
                    </div>
                    <div className="card-body">
                      {Object.entries(stats.clientWise)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([client, count], index) => {
                          const total = stats.totalReleases;
                          const percentage = ((count / total) * 100).toFixed(1);
                          return (
                            <div key={index} className="mb-3">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                <span style={{ fontWeight: "500" }}>
                                  {index + 1}. {client}
                                </span>
                                <span style={{ fontWeight: "600" }}>
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  height: "20px",
                                  background: "#e9ecef",
                                  borderRadius: "4px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    background: `hsl(${index * 60}, 70%, 50%)`,
                                    transition: "width 0.3s ease",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
