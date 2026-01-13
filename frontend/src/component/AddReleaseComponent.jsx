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
      return <h2 className="text-center mt-3">Update Release</h2>;
    } else {
      return <h2 className="text-center mt-3">Add New Release</h2>;
    }
  }

  return (
    <div className="container">
      <br />
      <br />

      <div className="row">
        <div className="card col-md-12">
          {pageTitle()}

          <div className="card-body">
            <form>
              {/* Row 1 */}
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">SL:</label>
                  <input
                    type="number"
                    placeholder="Serial Number"
                    name="sl"
                    value={sl ?? ""}
                    className={`form-control ${errors.sl ? "is-invalid" : ""}`}
                    onChange={(e) =>
                      setSl(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                  {errors.sl && (
                    <div className="invalid-feedback">{errors.sl}</div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Release NUMBER:</label>
                  <input
                    type="text"
                    placeholder="e.g., REL-002"
                    name="releaseNumber"
                    value={release_Number}
                    className={`form-control ${
                      errors.release_Number ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setReleaseNumber(e.target.value)}
                  />
                  {errors.release_Number && (
                    <div className="invalid-feedback">
                      {errors.release_Number}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Release Date:</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={release_Date || ""}
                    className={`form-control ${
                      errors.release_Date ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setReleaseDate(e.target.value)}
                  />
                  {errors.release_Date && (
                    <div className="invalid-feedback">
                      {errors.release_Date}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">Project Name:</label>
                  <input
                    type="text"
                    placeholder="e.g., Project Name"
                    name="projectName"
                    value={project_Name}
                    className={`form-control ${
                      errors.project_Name ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  {errors.project_Name && (
                    <div className="invalid-feedback">
                      {errors.project_Name}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Domain:</label>
                  <input
                    type="text"
                    placeholder="e.g., HIKMAH"
                    name="domain"
                    value={domain}
                    className={`form-control ${
                      errors.domain ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                  {errors.domain && (
                    <div className="invalid-feedback">{errors.domain}</div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Release Title:</label>
                  <input
                    type="text"
                    placeholder="e.g., Release Title Here"
                    name="releaseTitle"
                    value={release_Title}
                    className={`form-control ${
                      errors.release_Title ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setReleaseTitle(e.target.value)}
                  />
                  {errors.release_Title && (
                    <div className="invalid-feedback">
                      {errors.release_Title}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3 */}
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">Delivery Type:</label>
                  <input
                    type="text"
                    placeholder="e.g., Delivery Type"
                    name="deliveryType"
                    value={delivery_Type}
                    className={`form-control ${
                      errors.delivery_Type ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setDeliveryType(e.target.value)}
                  />
                  {errors.delivery_Type && (
                    <div className="invalid-feedback">
                      {errors.delivery_Type}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Release Letter Link:</label>
                  <input
                    type="text"
                    placeholder="e.g., Release Letter Link"
                    name="releaseLetterLink"
                    value={release_Letter_Link}
                    className={`form-control ${
                      errors.release_Letter_Link ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setReleaseLetterLink(e.target.value)}
                  />
                  {errors.release_Letter_Link && (
                    <div className="invalid-feedback">
                      {errors.release_Letter_Link}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Version No:</label>
                  <input
                    type="text"
                    placeholder="e.g., 1.0.0"
                    name="versionNo"
                    value={version_No}
                    className={`form-control ${
                      errors.version_No ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setVersionNo(e.target.value)}
                  />
                  {errors.version_No && (
                    <div className="invalid-feedback">{errors.version_No}</div>
                  )}
                </div>
              </div>

              {/* Row 4 */}
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">Release Status:</label>
                  <input
                    type="text"
                    placeholder="e.g., Delivered"
                    name="releaseStatus"
                    value={release_Status}
                    className={`form-control ${
                      errors.release_Status ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setReleaseStatus(e.target.value)}
                  />
                  {errors.release_Status && (
                    <div className="invalid-feedback">
                      {errors.release_Status}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Assigned Team Members:</label>
                  <input
                    type="text"
                    placeholder="Assigned Team Members"
                    name="assignedTeamMembers"
                    value={assigned_Team_Members}
                    className={`form-control ${
                      errors.assigned_Team_Members ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setAssignedTeamMembers(e.target.value)}
                  />
                  {errors.assigned_Team_Members && (
                    <div className="invalid-feedback">
                      {errors.assigned_Team_Members}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Client Name:</label>
                  <input
                    type="text"
                    placeholder="e.g., Client Name"
                    name="clientName"
                    value={client_Name}
                    className={`form-control ${
                      errors.client_Name ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  {errors.client_Name && (
                    <div className="invalid-feedback">{errors.client_Name}</div>
                  )}
                </div>
              </div>

              {/* Row 5 */}
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">Client Stakeholder:</label>
                  <input
                    type="text"
                    placeholder="e.g., Client Stakeholder"
                    name="clientStakeholder"
                    value={client_Steckholder}
                    className={`form-control ${
                      errors.client_Steckholder ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setClientStakeholder(e.target.value)}
                  />
                  {errors.client_Steckholder && (
                    <div className="invalid-feedback">
                      {errors.client_Steckholder}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Release Type:</label>
                  <input
                    type="text"
                    placeholder="e.g., Major"
                    name="releaseType"
                    value={release_Type}
                    className={`form-control ${
                      errors.release_Type ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setReleaseType(e.target.value)}
                  />
                  {errors.release_Type && (
                    <div className="invalid-feedback">
                      {errors.release_Type}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Release For:</label>
                  <input
                    type="text"
                    placeholder="e.g., Internal Use"
                    name="releaseFor"
                    value={release_For}
                    className={`form-control ${
                      errors.release_For ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setReleaseFor(e.target.value)}
                  />
                  {errors.release_For && (
                    <div className="invalid-feedback">{errors.release_For}</div>
                  )}
                </div>
              </div>

              {/* Row 6 */}
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">Testing Status:</label>
                  <input
                    type="text"
                    placeholder="e.g., In Progress"
                    name="testingStatus"
                    value={testing_Status}
                    className={`form-control ${
                      errors.testing_Status ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setTestingStatus(e.target.value)}
                  />
                  {errors.testing_Status && (
                    <div className="invalid-feedback">
                      {errors.testing_Status}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Azure ID:</label>
                  <input
                    type="text"
                    placeholder="e.g., Azure ID"
                    name="azureId"
                    value={azure_Id}
                    className={`form-control ${
                      errors.azure_Id ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setAzureId(e.target.value)}
                  />
                  {errors.azure_Id && (
                    <div className="invalid-feedback">{errors.azure_Id}</div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Jira ID:</label>
                  <input
                    type="text"
                    placeholder="e.g., Jira ID"
                    name="jiraId"
                    value={jira_Id}
                    className={`form-control ${
                      errors.jira_Id ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setJiraId(e.target.value)}
                  />
                  {errors.jira_Id && (
                    <div className="invalid-feedback">{errors.jira_Id}</div>
                  )}
                </div>
              </div>

              {/* Row 7 */}
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">CERD Maintain:</label>
                  <input
                    type="text"
                    placeholder="e.g., CERD Maintain"
                    name="cerdMaintain"
                    value={cerd_Maintain}
                    className={`form-control ${
                      errors.cerd_Maintain ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setCerdMaintain(e.target.value)}
                  />
                  {errors.cerd_Maintain && (
                    <div className="invalid-feedback">
                      {errors.cerd_Maintain}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">CERD ID:</label>
                  <input
                    type="text"
                    placeholder="e.g., CERD ID"
                    name="cerdId"
                    value={cerd_Id}
                    className={`form-control ${
                      errors.cerd_Id ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setCerdId(e.target.value)}
                  />
                  {errors.cerd_Id && (
                    <div className="invalid-feedback">{errors.cerd_Id}</div>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <label className="form-label">Compliance Score:</label>
                  <input
                    type="text"
                    placeholder="e.g., Compliance Score"
                    name="complianceScore"
                    value={compliance_Score}
                    className={`form-control ${
                      errors.compliance_Score ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setComplianceScore(e.target.value)}
                  />
                  {errors.compliance_Score && (
                    <div className="invalid-feedback">
                      {errors.compliance_Score}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 8 (last row has 1 field; keep empty cols to maintain 3-column layout) */}
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label">Remarks:</label>
                  <input
                    type="text"
                    placeholder="e.g., Remarks"
                    name="remarks"
                    value={remarks}
                    className={`form-control ${
                      errors.remarks ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                  {errors.remarks && (
                    <div className="invalid-feedback">{errors.remarks}</div>
                  )}
                </div>
                <div className="col-md-4 mb-2" />
                <div className="col-md-4 mb-2" />
              </div>

              <button
                className="btn btn-success"
                type="submit"
                onClick={saveOrUpdateRelease}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => navigator("/")}
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReleaseComponent;
