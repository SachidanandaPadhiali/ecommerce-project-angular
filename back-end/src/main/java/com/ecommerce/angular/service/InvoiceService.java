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
import com.itextpdf.io.font.FontProgram;
import com.itextpdf.io.font.FontProgramFactory;
import com.itextpdf.io.font.PdfEncodings;

import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;

import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.element.Image;

import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import java.text.NumberFormat;
import java.util.Locale;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.font.FontProgram;
import com.itextpdf.io.font.FontProgramFactory;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.font.constants.FontStyles;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.layout.properties.VerticalAlignment;
import java.net.MalformedURLException;

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

        PdfFont font = null;
        try {
            FontProgram fontProgram = FontProgramFactory.createFont("src/main/resources/NotoSans-Regular.ttf");
            font = PdfFontFactory.createFont(
                    fontProgram,
                    PdfEncodings.IDENTITY_H,
                    PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        User seller = userRepo.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAddress shippingAddress = userAddressRepo.findById(request.getShippingId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        UserAddress billingAddress = userAddressRepo.findDefaultAddressByOrderItemId(request.getOrderItemId());

        String shippingAdd = shippingAddress.getUserName() + "\n" + shippingAddress.getFlatNo()
                + "\n" + shippingAddress.getAddressLine1() + ", " + shippingAddress.getAddressLine2()
                + "\n" + shippingAddress.getCity() + "," + shippingAddress.getState() + "," + shippingAddress.getCountry() + "-" + shippingAddress.getZipCode()
                + "\n" + shippingAddress.getPhoneNumber();

        String billingAdd = billingAddress.getUserName() + "\n" + billingAddress.getFlatNo()
                + "\n" + billingAddress.getAddressLine1() + ", " + billingAddress.getAddressLine2()
                + "\n" + billingAddress.getCity() + "," + billingAddress.getState() + "," + billingAddress.getCountry() + "-" + shippingAddress.getZipCode()
                + "\n" + billingAddress.getPhoneNumber();

        Image eshopLogo;
        // Load image from file
        try {
            String imagePath = "src/main/resources/eshopLogo.png";
            ImageData imageData = ImageDataFactory.create(imagePath);
            eshopLogo = new Image(imageData);
        } catch (MalformedURLException e) {
            e.printStackTrace();
            eshopLogo = null;
        }

        // Optional styling
        eshopLogo.setWidth(60);
        eshopLogo.setAutoScale(true);

        // Header
        Table headerTable = new Table(2);
        headerTable.setWidth(UnitValue.createPercentValue(100));

        headerTable.addCell(new Cell().add(eshopLogo)
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE));

        headerTable.addCell(new Cell().add(new Paragraph()
                .add(new Text("Tax Invoice/Bill of supply/Cash Memo\n").setBold())
                .add(new Text("(Original For Recipient)"))
                .setTextAlignment(TextAlignment.RIGHT)).setBorder(Border.NO_BORDER)
        );

        doc.add(headerTable.setMarginBottom(20));

        // Seller & Buyer Info
        Table infoTable = new Table(2);
        infoTable.setWidth(UnitValue.createPercentValue(100));
        infoTable.addCell(new Cell().add(
                new Paragraph()
                        .add(new Text("Seller:\n").setBold())
                        .add(new Text(seller.getName()))
        ).setBorder(Border.NO_BORDER));

        infoTable.addCell(new Cell().add(new Paragraph()
                .add(new Text("Billing Address:\n").setBold().setFontSize(11))
                .add(new Text(billingAdd).setFontSize(8))
                .add(new Text("\nShipping Address:\n").setBold().setFontSize(11))
                .add(new Text(shippingAdd).setFontSize(8))
                .add(new Text("\nInvoice #: ").setBold().setFontSize(10))
                .add(new Text("" + request.getInvoiceNumber()).setFontSize(8))
                .add(new Text("\nInvoice Date: ").setBold().setFontSize(10))
                .add(new Text("" + LocalDate.now()).setFontSize(8))
                .setTextAlignment(TextAlignment.RIGHT)).setBorder(Border.NO_BORDER)
        );

        doc.add(infoTable.setMarginBottom(20));

        // Item Table
        float[] columnWidths = {5F, 50F, 5F, 20F, 20F};
        Table itemTable = new Table(columnWidths);
        itemTable.setWidth(UnitValue.createPercentValue(100));

        DeviceRgb headerBg = new DeviceRgb(180, 180, 180);
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Sl. No")).setBackgroundColor(headerBg).setBold().setTextAlignment(TextAlignment.CENTER));
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Description")).setBackgroundColor(headerBg).setBold().setTextAlignment(TextAlignment.CENTER));
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Unit Price")).setBackgroundColor(headerBg).setBold().setTextAlignment(TextAlignment.CENTER));
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Qty.")).setBackgroundColor(headerBg).setBold().setTextAlignment(TextAlignment.CENTER));
        itemTable.addHeaderCell(new Cell().add(new Paragraph("Item Total")).setBackgroundColor(headerBg).setBold().setTextAlignment(TextAlignment.CENTER));

        OrderItem item = orderItemRepo.getReferenceById(request.getOrderItemId());
        double total = 0;

        double amount = item.getPrice();
        total += amount;
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        itemTable.addCell("1");
        itemTable.addCell(item.getProduct().getName());
        itemTable.addCell(new Paragraph()
                .add(new Text("₹" + item.getProduct().getDiscPrice()).setBold().setFont(font)));
        itemTable.addCell(String.valueOf(item.getQuantity()));
        itemTable.addCell(new Paragraph()
                .add(new Text("₹" + amount).setBold().setFont(font)));

        itemTable.addCell(new Cell(1, 4).add(new Paragraph("TOTAL:")).setBold().setTextAlignment(TextAlignment.LEFT));
        itemTable.addCell(new Cell().add(new Paragraph(formatter.format(total))).setBold().setBackgroundColor(headerBg).setBold().setTextAlignment(TextAlignment.RIGHT));

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
