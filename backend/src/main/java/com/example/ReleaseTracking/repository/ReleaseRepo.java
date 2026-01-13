package com.example.ReleaseTracking.repository;

import com.example.ReleaseTracking.entity.Release_Tracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReleaseRepo extends JpaRepository<Release_Tracking,Long> {
}
