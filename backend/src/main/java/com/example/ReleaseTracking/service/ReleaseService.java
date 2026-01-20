package com.example.ReleaseTracking.service;

import com.example.ReleaseTracking.entity.Release_Tracking;
import com.example.ReleaseTracking.repository.ReleaseRepo;

import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ReleaseService {

    @Autowired
    ReleaseRepo releaseRepo;

    public Release_Tracking addRelease(Release_Tracking releaseTracking) {
        return releaseRepo.save(releaseTracking);
    }

    public List<Release_Tracking> getAllRelease() {
        return releaseRepo.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Release_Tracking getById(Long id) {
        return releaseRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Release not found with ID: " + id));
    }

    public void delById(Long id) {
        releaseRepo.deleteById(id);
    }


    @Transactional
    public void saveFromExcel(MultipartFile file) throws Exception {
        List<Release_Tracking> releases = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || isRowEmpty(row)) continue;

                Release_Tracking r = new Release_Tracking();

                // আপনার নতুন ফরম্যাট অনুযায়ী ম্যাপিং (Index শুরু ০ থেকে)
                // Id (Index 0), SL# (Index 1)
                r.setSl(getNumericValue(row.getCell(1)));                  // SL# (Col B)
                r.setRelease_Number(getStringValue(row.getCell(2)));       // Release Number (Col C)
                r.setRelease_Id(getStringValue(row.getCell(3)));           // Release ID (Col D)

                // Date (Column E = Index 4)
                Cell dateCell = row.getCell(4);
                if (dateCell != null && DateUtil.isCellDateFormatted(dateCell)) {
                    r.setRelease_Date(dateCell.getDateCellValue()
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate());
                }

                r.setProject_Name(getStringValue(row.getCell(5)));         // Project Name (Col F)
                r.setDomain(getStringValue(row.getCell(6)));               // Domain (Col G)
                r.setRelease_Title(getStringValue(row.getCell(7)));        // Release Title (Col H)
                r.setDelivery_Type(getStringValue(row.getCell(8)));        // Delivery Type (Col I)
                r.setRelease_Letter_Link(getStringValue(row.getCell(9)));  // Release Letter Link (Col J)
                r.setVersion_No(getStringValue(row.getCell(10)));          // Version (Col K)
                r.setRelease_Status(getStringValue(row.getCell(11)));      // Release Status (Col L)
                r.setAssigned_Team_Members(getStringValue(row.getCell(12)));// Assigned Team Members (Col M)
                r.setClient_Name(getStringValue(row.getCell(13)));         // Client Name (Col N)
                r.setClient_Steckholder(getStringValue(row.getCell(14)));  // Client Stakeholder (Col O)
                r.setRelease_Type(getStringValue(row.getCell(15)));        // Release Type (Col P)
                r.setRelease_For(getStringValue(row.getCell(16)));         // Release For (Col Q)
                r.setTesting_Status(getStringValue(row.getCell(17)));      // Testing Status (Col R)
                r.setAzure_Id(getStringValue(row.getCell(18)));            // Azure ID (Col S)
                r.setJira_Id(getStringValue(row.getCell(19)));             // Jira ID (Col T)
                r.setCerd_Maintain(getStringValue(row.getCell(20)));       // CERD Maintain (Col U)
                r.setCerd_Id(getStringValue(row.getCell(21)));             // CERD ID (Col V)

                // Compliance % (Index 22) - এটা যদি সংখ্যা হয় তবে getNumericValue ব্যবহার করুন
                r.setCompliance_Score(getStringValue(row.getCell(22)));    // Compliance % (Col W)
                r.setRemarks(getStringValue(row.getCell(23)));             // Remarks (Col X)

                releases.add(r);
            }
            releaseRepo.saveAll(releases);
        }
    }

    // helper method
    private String getStringValue(Cell cell) {
        if (cell == null) return "";
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue();
    }

    private Long getNumericValue(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) return 0L;
        return (long) cell.getNumericCellValue();
    }

    private boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) return false;
        }
        return true;
    }

}
