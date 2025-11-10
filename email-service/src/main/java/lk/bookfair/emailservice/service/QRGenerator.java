package lk.bookfair.emailservice.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Component;

@Component
public class QRGenerator {

    public byte[] generateQR(String text) throws Exception {
        QRCodeWriter qr = new QRCodeWriter();
        BitMatrix matrix = qr.encode(text, BarcodeFormat.QR_CODE, 250, 250);

        BufferedImage image = new BufferedImage(250, 250, BufferedImage.TYPE_INT_RGB);

        for (int x = 0; x < 250; x++) {
            for (int y = 0; y < 250; y++) {
                image.setRGB(x, y, matrix.get(x, y) ? 0x000000 : 0xFFFFFF);
            }
        }

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", bos);

        return bos.toByteArray();
    }
}
