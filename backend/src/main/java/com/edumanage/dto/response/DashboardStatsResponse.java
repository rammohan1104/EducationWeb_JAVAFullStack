package com.edumanage.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private long totalStudents;
    private long totalCourses;
    private long totalBatches;
    private long pendingPayments;
    private long approvedPayments;
    private long rejectedPayments;
    private long activeStudents;
    private BigDecimal totalRevenue;

    private List<Map<String, Object>> monthlyRevenue;
    private List<Map<String, Object>> courseEnrollmentDistribution;
    private List<Map<String, Object>> recentPayments;
    private List<Map<String, Object>> recentEnrollments;

    public DashboardStatsResponse() {}

    public static DashboardStatsResponseBuilder builder() { return new DashboardStatsResponseBuilder(); }

    public static class DashboardStatsResponseBuilder {
        private long totalStudents;
        private long totalCourses;
        private long totalBatches;
        private long pendingPayments;
        private long approvedPayments;
        private long rejectedPayments;
        private long activeStudents;
        private BigDecimal totalRevenue;
        private List<Map<String, Object>> monthlyRevenue;
        private List<Map<String, Object>> courseEnrollmentDistribution;
        private List<Map<String, Object>> recentPayments;
        private List<Map<String, Object>> recentEnrollments;

        public DashboardStatsResponseBuilder totalStudents(long totalStudents) { this.totalStudents = totalStudents; return this; }
        public DashboardStatsResponseBuilder totalCourses(long totalCourses) { this.totalCourses = totalCourses; return this; }
        public DashboardStatsResponseBuilder totalBatches(long totalBatches) { this.totalBatches = totalBatches; return this; }
        public DashboardStatsResponseBuilder pendingPayments(long pendingPayments) { this.pendingPayments = pendingPayments; return this; }
        public DashboardStatsResponseBuilder approvedPayments(long approvedPayments) { this.approvedPayments = approvedPayments; return this; }
        public DashboardStatsResponseBuilder rejectedPayments(long rejectedPayments) { this.rejectedPayments = rejectedPayments; return this; }
        public DashboardStatsResponseBuilder activeStudents(long activeStudents) { this.activeStudents = activeStudents; return this; }
        public DashboardStatsResponseBuilder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public DashboardStatsResponseBuilder monthlyRevenue(List<Map<String, Object>> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; return this; }
        public DashboardStatsResponseBuilder courseEnrollmentDistribution(List<Map<String, Object>> dist) { this.courseEnrollmentDistribution = dist; return this; }
        public DashboardStatsResponseBuilder recentPayments(List<Map<String, Object>> recentPayments) { this.recentPayments = recentPayments; return this; }
        public DashboardStatsResponseBuilder recentEnrollments(List<Map<String, Object>> recentEnrollments) { this.recentEnrollments = recentEnrollments; return this; }

        public DashboardStatsResponse build() {
            DashboardStatsResponse r = new DashboardStatsResponse();
            r.totalStudents = this.totalStudents;
            r.totalCourses = this.totalCourses;
            r.totalBatches = this.totalBatches;
            r.pendingPayments = this.pendingPayments;
            r.approvedPayments = this.approvedPayments;
            r.rejectedPayments = this.rejectedPayments;
            r.activeStudents = this.activeStudents;
            r.totalRevenue = this.totalRevenue;
            r.monthlyRevenue = this.monthlyRevenue;
            r.courseEnrollmentDistribution = this.courseEnrollmentDistribution;
            r.recentPayments = this.recentPayments;
            r.recentEnrollments = this.recentEnrollments;
            return r;
        }
    }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getTotalBatches() { return totalBatches; }
    public void setTotalBatches(long totalBatches) { this.totalBatches = totalBatches; }

    public long getPendingPayments() { return pendingPayments; }
    public void setPendingPayments(long pendingPayments) { this.pendingPayments = pendingPayments; }

    public long getApprovedPayments() { return approvedPayments; }
    public void setApprovedPayments(long approvedPayments) { this.approvedPayments = approvedPayments; }

    public long getRejectedPayments() { return rejectedPayments; }
    public void setRejectedPayments(long rejectedPayments) { this.rejectedPayments = rejectedPayments; }

    public long getActiveStudents() { return activeStudents; }
    public void setActiveStudents(long activeStudents) { this.activeStudents = activeStudents; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<Map<String, Object>> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<Map<String, Object>> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public List<Map<String, Object>> getCourseEnrollmentDistribution() { return courseEnrollmentDistribution; }
    public void setCourseEnrollmentDistribution(List<Map<String, Object>> courseEnrollmentDistribution) { this.courseEnrollmentDistribution = courseEnrollmentDistribution; }

    public List<Map<String, Object>> getRecentPayments() { return recentPayments; }
    public void setRecentPayments(List<Map<String, Object>> recentPayments) { this.recentPayments = recentPayments; }

    public List<Map<String, Object>> getRecentEnrollments() { return recentEnrollments; }
    public void setRecentEnrollments(List<Map<String, Object>> recentEnrollments) { this.recentEnrollments = recentEnrollments; }
}
