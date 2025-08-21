export function toTLV(obj) {
  let str = "";

  for (const [, content] of Object.entries(obj)) {
    let value;
    let length;

    let tagTlv = content[0];
    length = content[1]?.length;
    value = content[1]?.value;

    if (typeof content[1] === "object" && !("value" in content[1])) {
      const data = Object.entries(content[1]).sort(([a], [b]) =>
        a.localeCompare(b)
      );
      length = String(length).padStart(2, "0");
      str += tagTlv + length + toTLV(data);
    } else {
      if (content[0] !== "length") {
        length = String(length).padStart(2, "0");
        str += `${tagTlv}${length}${value}`;
      }
    }
  }

  return str;
}
