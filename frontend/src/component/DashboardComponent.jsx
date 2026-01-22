import { useState, useEffect } from "react";
import { getReleases } from "../services/ReleaseService";

{
  /*========= HELPER (LIKE % behavior) ========= */
}
const normalizeKey = (value) => {
  if (!value) return "unknown";
  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

const normalizeClientKey = (value) => {
  if (!value) return "unknown";

  return (
    value
      .toString()
      .toLowerCase()
      // common legal suffix remove
      .replace(/\b(plc|limited|ltd|bank limited)\b/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim()
  );
};

const DashboardComponent = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReleases: 0,
    currentMonthReleases: 0,
    previousMonthDeliveredReleases: 0,
    pendingReleases: 0,
    clientWise: {},
    domainWise: {},
    statusWise: {},
    teamWise: {},
  });

  useEffect(() => {
    fetchAndAnalyzeData();
  }, []);

  const fetchAndAnalyzeData = () => {
    setLoading(true);
    getReleases()
      .then((res) => analyzeData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const analyzeData = (data) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = (currentMonth + 11) % 12;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthCount = 0;
    let previousMonthDeliveredCount = 0;
    let pendingCount = 0;

    const clientWise = {};
    const domainWise = {};
    const statusWise = {};
    const teamWise = {};

    const clientDisplay = {};
    const domainDisplay = {};
    const statusDisplay = {};
    const teamDisplay = {};

    data.forEach((r) => {
      /* DATE BASED */
      if (r.release_Date) {
        const d = new Date(r.release_Date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          currentMonthCount++;
        }
        if (
          r.release_Status === "Delivered" &&
          d.getMonth() === previousMonth &&
          d.getFullYear() === previousYear
        ) {
          previousMonthDeliveredCount++;
        }
      }

      if (r.release_Status === "Pending") pendingCount++;

      /* CLIENT */
      const rawClient = r.client_Name || "Unknown";
      //  const clientKey = normalizeKey(rawClient);
      const clientKey = normalizeClientKey(rawClient);
      clientDisplay[clientKey] ??= rawClient.trim();
      clientWise[clientKey] = (clientWise[clientKey] || 0) + 1;

      /* DOMAIN */
      const rawDomain = r.domain || "Unknown";
      const domainKey = normalizeKey(rawDomain);
      domainDisplay[domainKey] ??= rawDomain.trim();
      domainWise[domainKey] = (domainWise[domainKey] || 0) + 1;

      /* STATUS */
      const rawStatus = r.release_Status || "Unknown";
      const statusKey = normalizeKey(rawStatus);
      statusDisplay[statusKey] ??= rawStatus;
      statusWise[statusKey] = (statusWise[statusKey] || 0) + 1;

      /* TEAM */
      const rawTeam = r.assigned_Team_Members || "Unknown";
      const teamKey = normalizeKey(rawTeam);
      teamDisplay[teamKey] ??= rawTeam;
      teamWise[teamKey] = (teamWise[teamKey] || 0) + 1;
    });

    setStats({
      totalReleases: data.length,
      currentMonthReleases: currentMonthCount,
      previousMonthDeliveredReleases: previousMonthDeliveredCount,
      pendingReleases: pendingCount,
      clientWise: formatForUI(clientWise, clientDisplay),
      domainWise: formatForUI(domainWise, domainDisplay),
      statusWise: formatForUI(statusWise, statusDisplay),
      teamWise: formatForUI(teamWise, teamDisplay),
    });
  };

  const formatForUI = (data, displayMap) => {
    const result = {};
    Object.keys(data).forEach((k) => {
      result[displayMap[k] || k] = data[k];
    });
    return result;
  };

  /* ========= UI COMPONENTS ========= */

  const StatCard = ({ title, count, icon, color }) => (
    <div className="col-md-6 col-lg-3 mb-4">
      <div
        className="p-4 rounded text-center text-white"
        style={{ background: color, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <div style={{ fontSize: "1.5rem" }}>{icon}</div>
        <div style={{ fontSize: "2rem", fontWeight: 700 }}>{count}</div>
        <div>{title}</div>
      </div>
    </div>
  );

  const SummaryList = ({ title, data, color }) => (
    <div className="card mb-4" style={{ borderRadius: 12 }}>
      <div
        className="card-header text-white"
        style={{ background: color, fontWeight: 600 }}
      >
        {title}
      </div>
      <div className="card-body">
        {Object.entries(data)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([k, v], i) => (
            <div key={i} className="d-flex justify-content-between mb-2">
              <span>{k}</span>
              <span
                className="text-white px-2 rounded"
                style={{ background: color }}
              >
                {v}
              </span>
            </div>
          ))}
      </div>
    </div>
  );

  /* ========= RENDER ========= */

  return (
    <div className="container-fluid mt-4 mb-5">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="row">
            <StatCard
              title="Total Releases"
              count={stats.totalReleases}
              icon="📦"
              color="linear-gradient(135deg,#667eea,#764ba2)"
            />
            <StatCard
              title="Current Month"
              count={stats.currentMonthReleases}
              icon="📅"
              color="linear-gradient(135deg,#f093fb,#f5576c)"
            />
            <StatCard
              title="Previous Month Delivered"
              count={stats.previousMonthDeliveredReleases}
              icon="✅"
              color="linear-gradient(135deg,#4facfe,#00f2fe)"
            />
            <StatCard
              title="Pending"
              count={stats.pendingReleases}
              icon="⏳"
              color="linear-gradient(135deg,#fa709a,#fee140)"
            />
          </div>

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

          <div className="row">
            <div className="col-md-6">
              <SummaryList
                title="Status-Wise Summary"
                data={stats.statusWise}
                color="#f093fb"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
