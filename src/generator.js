import { qrisgettagname, qrisparser } from "@misterdevs/qris-parser";
import { toTLV } from "../helper/toTLV.js";
import { generateCRC16 } from "../helper/generateCRC16.js";

export function generator(qris, amount, feeType = 0, feeAmount) {
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
  if (feeType !== 0) {
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
