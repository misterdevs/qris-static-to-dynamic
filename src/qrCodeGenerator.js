import { generateQRCode } from "../helper/generateQRCode.js";
import { isTLV } from "../helper/isTLV.js";

export function qrCodeGenerator(qris, margin, scale) {
  if (!isTLV(qris)?.valid) {
    throw new Error(`The QRIS is not valid: ${isTLV(qris)?.message}`);
  }
  return generateQRCode(qris, margin, scale);
}
