package com.edumanage.service;

import com.edumanage.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
            Files.createDirectories(this.rootLocation.resolve("thumbnails"));
            Files.createDirectories(this.rootLocation.resolve("profiles"));
            Files.createDirectories(this.rootLocation.resolve("notes"));
            Files.createDirectories(this.rootLocation.resolve("payments"));
            Files.createDirectories(this.rootLocation.resolve("assignments"));
            log.info("Upload directory initialized at: {}", this.rootLocation);
        } catch (IOException e) {
            log.error("Could not initialize upload storage location", e);
        }
    }

    public String storeFile(MultipartFile file, String subfolder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Cannot store file with relative path outside directory: " + originalFilename);
        }

        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i >= 0) {
            extension = originalFilename.substring(i);
        }

        String storedFilename = UUID.randomUUID() + extension;
        Path targetLocation = this.rootLocation.resolve(subfolder != null ? subfolder : "").resolve(storedFilename);

        try {
            Files.createDirectories(targetLocation.getParent());
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }
            String urlPath = "/uploads/" + (subfolder != null && !subfolder.isEmpty() ? subfolder + "/" : "") + storedFilename;
            log.info("Stored file at: {} with URL: {}", targetLocation, urlPath);
            return urlPath;
        } catch (IOException e) {
            log.error("Failed to store file {}", originalFilename, e);
            throw new BadRequestException("Failed to store file: " + originalFilename);
        }
    }
}
