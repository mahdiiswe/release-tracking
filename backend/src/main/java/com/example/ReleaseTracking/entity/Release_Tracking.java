package com.example.ReleaseTracking.entity;


import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

@Entity
@Table(name = "RELEASE_TRACKING")
@Data
public class Release_Tracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "R_ID")
    private Long id;

    @Column(name = "SL", length = 100)
    private Long sl;

    @Column(name = "RELEASE_NUMBER", length = 50)
    private String release_Number;

    @Column(name = "RELEASE_ID", insertable = false, updatable = false)
    private String release_Id;

    @Column(name = "RELEASE_DATE")
   // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate release_Date;

    @Column(name = "PROJECT_NAME", length = 200)
    private String project_Name;

    @Column(name = "DOMAIN", length = 100)
    private String domain;

    @Column(name = "RELEASE_TITLE", length = 500)
    private String release_Title;

    @Column(name = "DELIVERY_TYPE", length = 50)
    private String delivery_Type;

    @Column(name = "RELEASE_LETTER_LINK", length = 500)
    private String release_Letter_Link;

    @Column(name = "VERSION_NO", length = 50)
    private String version_No;

    @Column(name = "RELEASE_STATUS", length = 100)
    private String release_Status;

    @Column(name = "ASSIGNED_TEAM_MEMBERS", length = 500)
    private String assigned_Team_Members;

    @Column(name = "CLIENT_NAME", length = 200)
    private String client_Name;

    @Column(name = "CLIENT_STECKHOLDER", length = 200)
    private String client_Steckholder;

    @Column(name = "RELEASE_TYPE", length = 100)
    private String release_Type;

    @Column(name = "RELEASE_FOR", length = 100)
    private String release_For;

    @Column(name = "TESTING_STATUS", length = 100)
    private String testing_Status;

    @Column(name = "AZURE_ID", length = 150)
    private String azure_Id;

    @Column(name = "JIRA_ID", length = 100)
    private String jira_Id;

    @Column(name = "CERD_MAINTAIN", length = 50)
    private String cerd_Maintain;

    @Column(name = "CERD_ID", length = 100)
    private String cerd_Id;

    @Column(name = "COMPLIANCE_SCORE", length = 50)
    private String compliance_Score;

    @Column(name = "REMARKS", length = 500)
    private String remarks;

}
