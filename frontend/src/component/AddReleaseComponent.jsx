import React, { useEffect, useState } from "react";
import {
  addRelease,
  getRelease,
  updateRelease,
} from "../services/ReleaseService";
import { useNavigate, useParams } from "react-router-dom";

const AddReleaseComponent = () => {
  const [sl, setSl] = useState(null);
  const [release_Number, setReleaseNumber] = useState("");
  const [release_Date, setReleaseDate] = useState("");
  const [project_Name, setProjectName] = useState("");
  const [domain, setDomain] = useState("");
  const [release_Title, setReleaseTitle] = useState("");
  const [delivery_Type, setDeliveryType] = useState("");
  const [release_Letter_Link, setReleaseLetterLink] = useState("");
  const [version_No, setVersionNo] = useState("");
  const [release_Status, setReleaseStatus] = useState("");
  const [assigned_Team_Members, setAssignedTeamMembers] = useState("");
  const [client_Name, setClientName] = useState("");
  const [client_Steckholder, setClientStakeholder] = useState("");
  const [release_Type, setReleaseType] = useState("");
  const [release_For, setReleaseFor] = useState("");
  const [testing_Status, setTestingStatus] = useState("");
  const [azure_Id, setAzureId] = useState("");
  const [jira_Id, setJiraId] = useState("");
  const [cerd_Maintain, setCerdMaintain] = useState("");
  const [cerd_Id, setCerdId] = useState("");
  const [compliance_Score, setComplianceScore] = useState("");
  const [remarks, setRemarks] = useState("");

  const { id } = useParams();

  const [errors, setErrors] = useState({
    sl: "",
    release_Number: "",
    release_Date: "",
    project_Name: "",
    domain: "",
    release_Title: "",
    delivery_Type: "",
    release_Letter_Link: "",
    version_No: "",
    release_Status: "",
    assigned_Team_Members: "",
    client_Name: "",
    client_Steckholder: "",
    release_Type: "",
    release_For: "",
    testing_Status: "",
    azure_Id: "",
    jira_Id: "",
    cerd_Maintain: "",
    cerd_Id: "",
    compliance_Score: "",
    remarks: "",
  });

  const navigator = useNavigate();

  function toIsoDate(dateStr) {
    if (!dateStr) return "";
    // যদি dd-MM-yyyy হয়
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split("-");
      return `${yyyy}-${mm}-${dd}`;
    }
    // যদি আগেই yyyy-MM-dd হয়
    return dateStr;
  }

  useEffect(() => {
    // If 'id' exists, fetch the existing release data to populate the form for editing
    if (id) {
      // Fetch release data by ID and populate form fields
      getRelease(id)
        .then((response) => {
          setSl(response.data.sl || "");
          setReleaseNumber(response.data.release_Number || "");
          //  setReleaseDate(response.data.release_Date);
          setReleaseDate(toIsoDate(response.data.release_Date));
          setProjectName(response.data.project_Name || "");
          setDomain(response.data.domain || "");
          setReleaseTitle(response.data.release_Title || "");
          setDeliveryType(response.data.delivery_Type || "");
          setReleaseLetterLink(response.data.release_Letter_Link || "");
          setVersionNo(response.data.version_No || "");
          setReleaseStatus(response.data.release_Status || "");
          setAssignedTeamMembers(response.data.assigned_Team_Members || "");
          setClientName(response.data.client_Name || "");
          setClientStakeholder(response.data.client_Steckholder || "");
          setReleaseType(response.data.release_Type || "");
          setReleaseFor(response.data.release_For || "");
          setTestingStatus(response.data.testing_Status || "");
          setAzureId(response.data.azure_Id || "");
          setJiraId(response.data.jira_Id || "");
          setCerdMaintain(response.data.cerd_Maintain || "");
          setCerdId(response.data.cerd_Id || "");
          setComplianceScore(response.data.compliance_Score || "");
          setRemarks(response.data.remarks || "");
        })
        .catch((error) => {
          console.error("Error fetching release data", error);
        });
    }
  }, [id]);

  function saveOrUpdateRelease(e) {
    e.preventDefault();

    {
      /* const formattedDate = release_Date.split("-").reverse().join("-"); */
    }

    if (validateForm()) {
      const release = {
        sl,
        release_Number,
        release_Date: toIsoDate(release_Date),
        project_Name,
        domain,
        release_Title,
        delivery_Type,
        release_Letter_Link,
        version_No,
        release_Status,
        assigned_Team_Members,
        client_Name,
        client_Steckholder,
        release_Type,
        release_For,
        testing_Status,
        azure_Id,
        jira_Id,
        cerd_Maintain,
        cerd_Id,
        compliance_Score,
        remarks,
      };
      console.log("Release => " + JSON.stringify(release));

      if (id) {
        updateRelease(id, release)
          .then((response) => {
            console.log("Release updated successfully", response.data);
            navigator("/");
          })
          .catch((error) => {
            console.error("Error updating release", error);
          });
      } else {
        addRelease(release)
          .then((response) => {
            console.log("Release added successfully", response.data);
            navigator("/");
          })
          .catch((error) => {
            console.error("Error adding release", error);
          });
      }
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (sl === null || isNaN(sl)) {
      errorsCopy.sl = "SL is required";
      valid = false;
    } else if (sl <= 0) {
      errorsCopy.sl = "SL must be greater than 0";
      valid = false;
    }

    if (release_Number.trim()) {
      errorsCopy.release_Number = "";
    } else {
      errorsCopy.release_Number = "Release Number is required";
      valid = false;
    }

    if (release_Date.trim()) {
      errorsCopy.release_Date = "";
    } else {
      errorsCopy.release_Date = "Release Date is required";
      valid = false;
    }

    if (project_Name.trim()) {
      errorsCopy.project_Name = "";
    } else {
      errorsCopy.project_Name = "Project Name is required";
      valid = false;
    }

    if (domain.trim()) {
      errorsCopy.domain = "";
    } else {
      errorsCopy.domain = "Domain is required";
      valid = false;
    }

    if (release_Title.trim()) {
      errorsCopy.release_Title = "";
    } else {
      errorsCopy.release_Title = "Release Title is required";
      valid = false;
    }

    if (delivery_Type.trim()) {
      errorsCopy.delivery_Type = "";
    } else {
      errorsCopy.delivery_Type = "Delivery Type is required";
      valid = false;
    }

    {
      /* if (release_Letter_Link.trim()) {
      errorsCopy.release_Letter_Link = "";
    } else {
      errorsCopy.release_Letter_Link = "Release Letter Link is required";
      valid = false;
    }
    */
    }

    if (version_No.trim()) {
      errorsCopy.version_No = "";
    } else {
      errorsCopy.version_No = "Version No is required";
      valid = false;
    }

    if (release_Status.trim()) {
      errorsCopy.release_Status = "";
    } else {
      errorsCopy.release_Status = "Release Status is required";
      valid = false;
    }

    if (assigned_Team_Members.trim()) {
      errorsCopy.assigned_Team_Members = "";
    } else {
      errorsCopy.assigned_Team_Members = "Assigned Team Members is required";
      valid = false;
    }

    if (client_Name.trim()) {
      errorsCopy.client_Name = "";
    } else {
      errorsCopy.client_Name = "Client Name is required";
      valid = false;
    }

    if (client_Steckholder.trim()) {
      errorsCopy.client_Steckholder = "";
    } else {
      errorsCopy.client_Steckholder = "Client Stakeholder is required";
      valid = false;
    }

    if (release_Type.trim()) {
      errorsCopy.release_Type = "";
    } else {
      errorsCopy.release_Type = "Release Type is required";
      valid = false;
    }

    if (release_For.trim()) {
      errorsCopy.release_For = "";
    } else {
      errorsCopy.release_For = "Release For is required";
      valid = false;
    }

    if (testing_Status.trim()) {
      errorsCopy.testing_Status = "";
    } else {
      errorsCopy.testing_Status = "Testing Status is required";
      valid = false;
    }

    {
      /* if (azure_Id.trim()) {
      errorsCopy.azure_Id = "";
    } else {
      errorsCopy.azure_Id = "Azure ID is required";
      valid = false;
    }

    if (jira_Id.trim()) {
      errorsCopy.jira_Id = "";
    } else {
      errorsCopy.jira_Id = "Jira ID is required";
      valid = false;
    }

    if (cerd_Maintain.trim()) {
      errorsCopy.cerd_Maintain = "";
    } else {
      errorsCopy.cerd_Maintain = "CERD Maintain is required";
      valid = false;
    }

    if (cerd_Id.trim()) {
      errorsCopy.cerd_Id = "";
    } else {
      errorsCopy.cerd_Id = "CERD ID is required";
      valid = false;
    }
    */
    }
    if (compliance_Score.trim()) {
      errorsCopy.compliance_Score = "";
    } else {
      errorsCopy.compliance_Score = "Compliance Score is required";
      valid = false;
    }

    {
      /*  if (remarks.trim()) {
      errorsCopy.remarks = "";
    } else {
      errorsCopy.remarks = "Remarks is required";
      valid = false;
    }
  */
    }

    setErrors(errorsCopy);
    return valid;
  }

  function pageTitle() {
    if (id) {
      return (
        <h3 style={{ color: "#764ba2", fontWeight: "600" }}>
          📝 Update Release
        </h3>
      );
    } else {
      return (
        <h3 style={{ color: "#764ba2", fontWeight: "600" }}>
          ➕ Add New Release
        </h3>
      );
    }
  }

  return (
    <div className="container mt-4 mb-5">
      <div
        className="card shadow-lg"
        style={{ borderRadius: "12px", border: "none", marginBottom: "2rem" }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          {pageTitle()}
          <p
            style={{
              margin: "0.5rem 0 0 0",
              opacity: 0.9,
              fontSize: "0.95rem",
            }}
          >
            Fill in the form below to {id ? "update" : "create"} a new release
          </p>
        </div>

        <div className="card-body p-4">
          <form>
            {/* Row 1 */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>SL:</b>
                </label>
                <input
                  type="number"
                  placeholder="Serial Number"
                  name="sl"
                  value={sl ?? ""}
                  className={`form-control ${errors.sl ? "is-invalid" : ""}`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) =>
                    setSl(e.target.value === "" ? null : Number(e.target.value))
                  }
                />
                {errors.sl && (
                  <div className="invalid-feedback d-block">{errors.sl}</div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Release NUMBER:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., REL-002"
                  name="releaseNumber"
                  value={release_Number}
                  className={`form-control ${
                    errors.release_Number ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setReleaseNumber(e.target.value)}
                />
                {errors.release_Number && (
                  <div className="invalid-feedback d-block">
                    {errors.release_Number}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Release Date:</b>
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={release_Date || ""}
                  className={`form-control ${
                    errors.release_Date ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
                {errors.release_Date && (
                  <div className="invalid-feedback d-block">
                    {errors.release_Date}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Project Name:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Project Name"
                  name="projectName"
                  value={project_Name}
                  className={`form-control ${
                    errors.project_Name ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                {errors.project_Name && (
                  <div className="invalid-feedback d-block">
                    {errors.project_Name}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Domain:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., HIKMAH"
                  name="domain"
                  value={domain}
                  className={`form-control ${
                    errors.domain ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setDomain(e.target.value)}
                />
                {errors.domain && (
                  <div className="invalid-feedback d-block">
                    {errors.domain}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Release Title:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Release Title Here"
                  name="releaseTitle"
                  value={release_Title}
                  className={`form-control ${
                    errors.release_Title ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setReleaseTitle(e.target.value)}
                />
                {errors.release_Title && (
                  <div className="invalid-feedback d-block">
                    {errors.release_Title}
                  </div>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Delivery Type:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Delivery Type"
                  name="deliveryType"
                  value={delivery_Type}
                  className={`form-control ${
                    errors.delivery_Type ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                {errors.delivery_Type && (
                  <div className="invalid-feedback d-block">
                    {errors.delivery_Type}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Release Letter Link:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Release Letter Link"
                  name="releaseLetterLink"
                  value={release_Letter_Link}
                  className={`form-control ${
                    errors.release_Letter_Link ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setReleaseLetterLink(e.target.value)}
                />
                {errors.release_Letter_Link && (
                  <div className="invalid-feedback d-block">
                    {errors.release_Letter_Link}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Version No:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1.0.0"
                  name="versionNo"
                  value={version_No}
                  className={`form-control ${
                    errors.version_No ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setVersionNo(e.target.value)}
                />
                {errors.version_No && (
                  <div className="invalid-feedback d-block">
                    {errors.version_No}
                  </div>
                )}
              </div>
            </div>

            {/* Row 4 */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Release Status:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Delivered"
                  name="releaseStatus"
                  value={release_Status}
                  className={`form-control ${
                    errors.release_Status ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setReleaseStatus(e.target.value)}
                />
                {errors.release_Status && (
                  <div className="invalid-feedback d-block">
                    {errors.release_Status}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Assigned Team Members:</b>
                </label>
                <input
                  type="text"
                  placeholder="Assigned Team Members"
                  name="assignedTeamMembers"
                  value={assigned_Team_Members}
                  className={`form-control ${
                    errors.assigned_Team_Members ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setAssignedTeamMembers(e.target.value)}
                />
                {errors.assigned_Team_Members && (
                  <div className="invalid-feedback d-block">
                    {errors.assigned_Team_Members}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Client Name:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Client Name"
                  name="clientName"
                  value={client_Name}
                  className={`form-control ${
                    errors.client_Name ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setClientName(e.target.value)}
                />
                {errors.client_Name && (
                  <div className="invalid-feedback d-block">
                    {errors.client_Name}
                  </div>
                )}
              </div>
            </div>

            {/* Row 5 */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Client Stakeholder:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Client Stakeholder"
                  name="clientStakeholder"
                  value={client_Steckholder}
                  className={`form-control ${
                    errors.client_Steckholder ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setClientStakeholder(e.target.value)}
                />
                {errors.client_Steckholder && (
                  <div className="invalid-feedback d-block">
                    {errors.client_Steckholder}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Release Type:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Major"
                  name="releaseType"
                  value={release_Type}
                  className={`form-control ${
                    errors.release_Type ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setReleaseType(e.target.value)}
                />
                {errors.release_Type && (
                  <div className="invalid-feedback d-block">
                    {errors.release_Type}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Release For:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Internal Use"
                  name="releaseFor"
                  value={release_For}
                  className={`form-control ${
                    errors.release_For ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setReleaseFor(e.target.value)}
                />
                {errors.release_For && (
                  <div className="invalid-feedback d-block">
                    {errors.release_For}
                  </div>
                )}
              </div>
            </div>

            {/* Row 6 */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Testing Status:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., In Progress"
                  name="testingStatus"
                  value={testing_Status}
                  className={`form-control ${
                    errors.testing_Status ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setTestingStatus(e.target.value)}
                />
                {errors.testing_Status && (
                  <div className="invalid-feedback d-block">
                    {errors.testing_Status}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Azure ID:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Azure ID"
                  name="azureId"
                  value={azure_Id}
                  className={`form-control ${
                    errors.azure_Id ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setAzureId(e.target.value)}
                />
                {errors.azure_Id && (
                  <div className="invalid-feedback d-block">
                    {errors.azure_Id}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Jira ID:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Jira ID"
                  name="jiraId"
                  value={jira_Id}
                  className={`form-control ${
                    errors.jira_Id ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setJiraId(e.target.value)}
                />
                {errors.jira_Id && (
                  <div className="invalid-feedback d-block">
                    {errors.jira_Id}
                  </div>
                )}
              </div>
            </div>

            {/* Row 7 */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>CERD Maintain:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., CERD Maintain"
                  name="cerdMaintain"
                  value={cerd_Maintain}
                  className={`form-control ${
                    errors.cerd_Maintain ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setCerdMaintain(e.target.value)}
                />
                {errors.cerd_Maintain && (
                  <div className="invalid-feedback d-block">
                    {errors.cerd_Maintain}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>CERD ID:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., CERD ID"
                  name="cerdId"
                  value={cerd_Id}
                  className={`form-control ${
                    errors.cerd_Id ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setCerdId(e.target.value)}
                />
                {errors.cerd_Id && (
                  <div className="invalid-feedback d-block">
                    {errors.cerd_Id}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Compliance Score:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Compliance Score"
                  name="complianceScore"
                  value={compliance_Score}
                  className={`form-control ${
                    errors.compliance_Score ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setComplianceScore(e.target.value)}
                />
                {errors.compliance_Score && (
                  <div className="invalid-feedback d-block">
                    {errors.compliance_Score}
                  </div>
                )}
              </div>
            </div>

            {/* Row 8 */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label
                  className="form-label fw-600"
                  style={{ color: "#495057", fontSize: "0.9rem" }}
                >
                  <b>Remarks:</b>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Remarks"
                  name="remarks"
                  value={remarks}
                  className={`form-control ${
                    errors.remarks ? "is-invalid" : ""
                  }`}
                  style={{ borderRadius: "6px", padding: "0.6rem" }}
                  onChange={(e) => setRemarks(e.target.value)}
                />
                {errors.remarks && (
                  <div className="invalid-feedback d-block">
                    {errors.remarks}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 justify-content-between border-top pt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigator("/")}
                style={{ borderRadius: "6px", minWidth: "120px" }}
              >
                ← Back
              </button>
              <button
                className="btn text-white"
                type="submit"
                onClick={saveOrUpdateRelease}
                style={{
                  borderRadius: "6px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  minWidth: "120px",
                  fontWeight: "600",
                }}
              >
                {id ? "💾 Update" : "✔️ Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReleaseComponent;
