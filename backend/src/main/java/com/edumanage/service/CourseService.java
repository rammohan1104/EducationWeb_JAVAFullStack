package com.edumanage.service;

import com.edumanage.dto.request.CourseRequest;
import com.edumanage.entity.Course;
import com.edumanage.exception.ResourceNotFoundException;
import com.edumanage.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllActiveCourses() {
        return courseRepository.findByIsActiveTrue();
    }

    public List<Course> getAllCoursesAdmin() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    @Transactional
    public Course createCourse(CourseRequest request) {
        String slug = request.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        Course course = Course.builder()
                .title(request.getTitle())
                .slug(slug)
                .shortDescription(request.getShortDescription())
                .description(request.getDescription())
                .duration(request.getDuration())
                .fees(request.getFees())
                .category(request.getCategory())
                .level(request.getLevel())
                .thumbnailUrl(request.getThumbnailUrl())
                .syllabus(request.getSyllabus())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Long id, CourseRequest request) {
        Course course = getCourseById(id);
        course.setTitle(request.getTitle());
        course.setShortDescription(request.getShortDescription());
        course.setDescription(request.getDescription());
        course.setDuration(request.getDuration());
        course.setFees(request.getFees());
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());
        if (request.getThumbnailUrl() != null && !request.getThumbnailUrl().isBlank()) {
            course.setThumbnailUrl(request.getThumbnailUrl());
        }
        course.setSyllabus(request.getSyllabus());
        if (request.getIsActive() != null) {
            course.setIsActive(request.getIsActive());
        }

        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }

    @Transactional
    public Course toggleCourseStatus(Long id) {
        Course course = getCourseById(id);
        course.setIsActive(!Boolean.TRUE.equals(course.getIsActive()));
        return courseRepository.save(course);
    }
}
