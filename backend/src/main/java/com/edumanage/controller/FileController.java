package com.edumanage.controller;

import com.edumanage.dto.response.ApiResponse;
import com.edumanage.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Uploads", description = "File storage API for screenshots, PDFs, assignments and profile photos")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file with subfolder classification")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subfolder", defaultValue = "general") String subfolder
    ) {
        String fileUrl = fileStorageService.storeFile(file, subfolder);
        Map<String, String> response = new HashMap<>();
        response.put("fileUrl", fileUrl);
        response.put("fileName", file.getOriginalFilename());
        response.put("fileSize", String.valueOf(file.getSize()));
        return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully", response));
    }
}
