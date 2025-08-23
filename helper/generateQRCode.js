import QRCode from "qrcode";

export async function generateQRCode(qrisString, margin = 2, scale = 6) {
  try {
    return await QRCode.toDataURL(qrisString, {
      errorCorrectionLevel: "M",
      type: "image/png",
      margin,
      scale,
    });
  } catch (err) {
    throw new Error("Error: " + err.message);
  }
}
