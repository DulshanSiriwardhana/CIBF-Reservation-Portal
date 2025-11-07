package com.example.reservation.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import java.io.File;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class QRCodeGenerator {

    public static String generateQRCodeImage(String text, int width, int height, String folder) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.MARGIN, 1);

        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);
        File dir = new File(folder);
        if (!dir.exists()) dir.mkdirs();

        String filename = "qr_" + UUID.randomUUID() + ".png";
        Path path = new File(dir, filename).toPath();
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
        return filename;
    }
}
