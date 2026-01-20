package com.example.ReleaseTracking.controller;

import com.example.ReleaseTracking.entity.Release_Tracking;
import com.example.ReleaseTracking.repository.ReleaseRepo;
import com.example.ReleaseTracking.service.ReleaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST,
                RequestMethod.PUT, RequestMethod.DELETE})
@RestController
public class ReleaseController {

    @Autowired
    ReleaseService releaseService;

    @Autowired
    ReleaseRepo releaseRepo;

    @PostMapping("/add")
    public Release_Tracking addRelease(@RequestBody Release_Tracking release_tracking){
        return releaseService.addRelease(release_tracking);
    }

    @GetMapping("/get_release")
    public List <Release_Tracking> getAllRelease(){
        return releaseService.getAllRelease();
    }

    @GetMapping("/get_release/{id}")
    public Release_Tracking getById(@PathVariable Long id){
        return releaseService.getById(id);
    }

    @DeleteMapping("/get_release/{id}")
    public void delById(@PathVariable Long id){
         releaseService.delById(id);
    }

    @PutMapping("/get_release/{id}")
    public ResponseEntity<Release_Tracking> updateById(
            @PathVariable Long id,
            @RequestBody Release_Tracking releaseTracking) {

        Release_Tracking existing = releaseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Release not found with ID: " + id));

        existing.setRelease_Id(releaseTracking.getRelease_Id());
        existing.setAssigned_Team_Members(releaseTracking.getAssigned_Team_Members());
        existing.setRemarks(releaseTracking.getRemarks());

        Release_Tracking updated = releaseRepo.save(existing);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/upload_release_excel")
    public ResponseEntity<String> uploadReleaseExcel(@RequestParam("file")MultipartFile file){

        try{
            releaseService.saveFromExcel(file);
            return ResponseEntity.ok("Excel Uploaded Successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
