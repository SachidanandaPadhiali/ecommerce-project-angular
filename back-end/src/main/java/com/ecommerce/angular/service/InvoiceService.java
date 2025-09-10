package com.ecommerce.angular.service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.ecommerce.angular.dto.InvoiceRequest;
import com.ecommerce.angular.entity.OrderItem;
import com.ecommerce.angular.entity.User;
import com.ecommerce.angular.entity.UserAddress;
import com.ecommerce.angular.repo.OrderItemRepo;
import com.ecommerce.angular.repo.UserAddressRepo;
import com.ecommerce.angular.repo.UserRepo;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class InvoiceService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    UserAddressRepo userAddressRepo;

    @Autowired
    OrderItemRepo orderItemRepo;

    public byte[] generateInvoicePdf(InvoiceRequest request) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document doc = new Document(pdfDoc);

        User seller = userRepo.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAddress shippingAddress = userAddressRepo.findById(request.getShippingId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Header
        doc.add(new Paragraph("INVOICE").setFontSize(20).setBold().setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph("Invoice #: " + request.getInvoiceNumber()));
        doc.add(new Paragraph("Date: " + LocalDate.now()));

        // Seller & Buyer Info
        Table infoTable = new Table(2);
        infoTable.addCell(new Cell().add(new Paragraph("Seller:\n" + seller.getName())));
        infoTable.addCell(new Cell().add(new Paragraph("Shipping Address:\n" + shippingAddress)));

        doc.add(infoTable.setMarginBottom(20));

        // Item Table
        Table itemTable = new Table(new float[]{4, 2, 2, 2});
        itemTable.setWidth(UnitValue.createPercentValue(100));
        itemTable.addHeaderCell("Description");
        itemTable.addHeaderCell("Quantity");
        itemTable.addHeaderCell("Unit Price");
        itemTable.addHeaderCell("Amount");

        OrderItem item = orderItemRepo.getReferenceById(request.getOrderItemId());
        double total = 0;

        double amount = item.getPrice();
        total += amount;

        itemTable.addCell(item.getProduct().getName());
        itemTable.addCell(String.valueOf(item.getQuantity()));
        itemTable.addCell("₹" + item.getProduct().getDiscPrice());
        itemTable.addCell("₹" + amount);

        doc.add(itemTable);

        // Summary
        doc.add(new Paragraph("Subtotal: ₹" + total));
        doc.add(new Paragraph("Tax (18% GST): ₹" + (total * 0.18)));
        doc.add(new Paragraph("Total: ₹" + (total * 1.18)).setBold());

        // Footer
        doc.add(new Paragraph("\nThank you for your purchase!").setTextAlignment(TextAlignment.CENTER));

        doc.close();
        return baos.toByteArray();
    }
}
