package com.example.ReleaseTracking.service;

import com.example.ReleaseTracking.entity.Release_Tracking;
import com.example.ReleaseTracking.repository.ReleaseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
}
