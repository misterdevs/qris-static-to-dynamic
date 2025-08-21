````markdown
# QRIS Static to Dynamic Generator

Library untuk mengubah **QRIS Statis** menjadi **QRIS Dinamis**, dengan dukungan:

- Menambahkan **Transaction Amount (Tag 54)**.
- Menambahkan **Service Fee (Tag 55)** → Fixed fee atau Percentage fee.
- Hitung ulang **CRC16-CCITT (Tag 63)** otomatis agar valid.

---

## ✨ Fitur

- Parse dan generate ulang string QRIS.
- Mendukung **fixed fee** (`feeType = 2`) dan **percentage fee** (`feeType = 3`).
- Hasil QRIS siap dipakai untuk transaksi.

---

## 📦 Instalasi

```bash
npm install @misterdevs/qris-static-to-dynamic
```
````

---

## 🚀 Cara Pakai

```js
import { qrisdynamicgenerator } from "@misterdevs/qris-static-to-dynamic";

const qrisDynamic = qrisdynamicgenerator(
  "00020101021126610014COM.GO-JEK.WWW01189360091234285490450210G6285936550303UMI51440014ID.CO.QRIS.WWW0215ID10253801632580303UMI5204504553033605802ID5910Misterdevs6007JAKARTA61051234562070703A016304M2B3", // QRIS statis
  1000, // Transaction Amount (Rp 1.000)
  2, // Jenis fee → 2 = fixed fee, 3 = percentage fee
  5000 // Nilai fee (Rp 5.000 jika fixed, atau 5000% jika percentage)
);

console.log(qrisDynamic);
```

---

## 📚 Parameter

### `qrisdynamicgenerator(qrisStatic, amount, feeType?, feeValue?)`

| Parameter    | Tipe     | Wajib | Deskripsi                                                                         |
| ------------ | -------- | ----- | --------------------------------------------------------------------------------- |
| `qrisStatic` | `string` | ✅    | QRIS statis original (hasil dari merchant/QRIS provider).                         |
| `amount`     | `number` | ✅    | Nominal transaksi (Tag `54`).                                                     |
| `feeType`    | `number` | ❌    | Jenis biaya tambahan: <br>• `2` → Fixed Fee <br>• `3` → Percentage Fee            |
| `feeValue`   | `number` | ❌    | Nilai fee sesuai tipe. Jika fixed = nominal rupiah, jika percentage = persentase. |

---

## 📄 Contoh Hasil

### 1. Tanpa Fee

```js
qrisdynamicgenerator(staticQris, 1000);
```

Output:

```
...54051000...6304XXXX
```

- `54051000` → Transaction Amount Rp 1.000
- `6304XXXX` → CRC dihitung ulang

---

### 2. Dengan Fixed Fee

```js
qrisdynamicgenerator(staticQris, 1000, 2, 5000);
```

Output:

```
...54051000...5502035000...6304XXXX
```

- `54051000` → Transaction Amount Rp 1.000
- `5502035000` → Service Fee Rp 5.000 (fixed)
- `6304XXXX` → CRC dihitung ulang

---

### 3. Dengan Percentage Fee

```js
qrisdynamicgenerator(staticQris, 1000, 3, 200);
```

Output:

```
...54051000...550303200...6304XXXX
```

- `54051000` → Transaction Amount Rp 1.000
- `550303200` → Service Fee 200%
- `6304XXXX` → CRC dihitung ulang

---

## ⚠️ Catatan

- Jika tidak butuh fee, cukup panggil `qrisdynamicgenerator(qris, amount)` saja.
- CRC dihitung otomatis dengan standar BI (CRC16-CCITT XModem).
- Hasil QRIS ini **hanya manipulasi string**, belum diverifikasi ke Bank Indonesia.

---
