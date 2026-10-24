package com.edumanage.controller;

import com.edumanage.dto.request.PaymentSubmitRequest;
import com.edumanage.dto.request.PaymentVerifyRequest;
import com.edumanage.dto.response.ApiResponse;
import com.edumanage.entity.Payment;
import com.edumanage.entity.PaymentStatus;
import com.edumanage.security.UserDetailsImpl;
import com.edumanage.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Payments", description = "Endpoints for manual UPI submission, UTR verification and payment approvals")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Student: Submit UPI Payment
    @PostMapping("/student/payments/submit")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Student: Submit manual UPI payment with UTR number and receipt")
    public ResponseEntity<ApiResponse<Payment>> submitPayment(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody PaymentSubmitRequest request
    ) {
        Payment payment = paymentService.submitPayment(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Payment submitted successfully! Admin will verify and activate your enrollment shortly.", payment));
    }

    @GetMapping({"/student/payments", "/student/payments/my-payments"})
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Student: Get payment history and status receipts")
    public ResponseEntity<ApiResponse<List<Payment>>> getMyPayments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Payment> payments = paymentService.getUserPayments(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(payments));
    }

    // Admin: Payment Verification & History
    @GetMapping("/admin/payments")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all payments or filter by query param status")
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments(
            @RequestParam(name = "status", required = false) PaymentStatus status
    ) {
        List<Payment> payments = status != null ? paymentService.getPaymentsByStatus(status) : paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.ok(payments));
    }

    @GetMapping("/admin/payments/status/{status}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Filter payments by path status (PENDING, APPROVED, REJECTED)")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        List<Payment> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(ApiResponse.ok(payments));
    }

    @RequestMapping(value = "/admin/payments/{id}/verify", method = {RequestMethod.POST, RequestMethod.PUT})
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Approve or reject payment request with UTR verification")
    public ResponseEntity<ApiResponse<Payment>> verifyPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl adminDetails,
            @Valid @RequestBody PaymentVerifyRequest request
    ) {
        Payment payment = paymentService.verifyPayment(id, adminDetails.getId(), request);
        String msg = request.getStatus() == PaymentStatus.APPROVED ?
                "Payment approved successfully! Student is now enrolled and assigned to batch." :
                "Payment rejected. Reason recorded.";
        return ResponseEntity.ok(ApiResponse.ok(msg, payment));
    }
}
