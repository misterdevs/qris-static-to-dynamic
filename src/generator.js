import { qrisgettagname, qrisparser } from "@misterdevs/qris-parser";
import { toTLV } from "../helper/toTLV.js";
import { generateCRC16 } from "../helper/generateCRC16.js";
import { isTLV } from "../helper/isTLV.js";

export function generator(qris, amount, feeType, feeAmount) {
  if (!qris) {
    throw new Error("The qris must be have a value.");
  }
  if (!isTLV(qris)?.valid) {
    throw new Error(`The QRIS is not valid: ${isTLV(qris)?.message}`);
  }
  if (amount && amount < 1) {
    throw new Error("The amount value must bigger than 0.");
  }

  if (feeType && ![1, 2].includes(feeType)) {
    throw new Error("The fee Type only support 1 or 2.");
  }

  if (feeType && !feeAmount) {
    throw new Error("The fee amount value must bigger than 0.");
  }

  if (feeAmount && feeAmount < 1) {
    throw new Error("The fee amount value must bigger than 0.");
  }

  const qrisparse = qrisparser(qris);

  if (amount) {
    //change payment method to dynamic
    qrisparse["01"].value = "12";

    //insert amount to tag 54
    const amountPadded = String(amount).padStart(2, "0");
    qrisparse["54"] = {
      name: qrisgettagname("54"),
      length: amountPadded.length,
      value: amountPadded,
    };
  }

  //insert fee
  if (feeType) {
    // feeType 2 for fixed and 3 for percentage
    const feeTag = feeType === 2 ? "56" : "57";
    const feeAmountPadded = String(feeAmount).padStart(2, "0");
    qrisparse["55"] = {
      name: qrisgettagname("55"),
      length: 2,
      value: String(feeType).padStart(2, "0"),
    };
    qrisparse[feeTag] = {
      name: qrisgettagname(feeTag),
      length: feeAmountPadded.length,
      value: feeAmountPadded,
    };
  }

  const sortedqrisparse = Object.entries(qrisparse).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const qristlv = toTLV(sortedqrisparse).slice(0, -4);
  const result = qristlv + generateCRC16(qristlv);

  return result;
}
