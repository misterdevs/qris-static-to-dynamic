export function isTLV(input) {
  let i = 0;

  while (i < input.length) {
    // At least 2 digits tag + 2 digits length
    if (i + 4 > input.length) {
      return { valid: false, message: "Insufficient data for Tag/Length" };
    }

    const tag = input.substring(i, i + 2);
    if (!/^\d{2}$/.test(tag)) {
      return {
        valid: false,
        message: `Invalid tag: ${tag} (must be 2 digits)`,
      };
    }
    i += 2;

    const lenStr = input.substring(i, i + 2);
    if (!/^\d{2}$/.test(lenStr)) {
      return { valid: false, message: `Invalid length at tag ${tag}` };
    }
    const len = parseInt(lenStr, 10);
    i += 2;

    if (i + len > input.length) {
      return { valid: false, message: `Length mismatch at tag ${tag}` };
    }
    const value = input.substring(i, i + len);
    i += len;

    // check nested TLV for tag 26–51
    const tagNum = parseInt(tag, 10);
    if (tagNum >= 26 && tagNum <= 51) {
      const nested = isTLV(value);
      if (!nested.valid) {
        return {
          valid: false,
          message: `Invalid nested TLV at tag ${tag}: ${nested.message}`,
        };
      }
    }
  }

  return { valid: true, message: "Valid TLV format" };
}
