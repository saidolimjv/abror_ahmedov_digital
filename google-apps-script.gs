/**
 * GOOGLE SHEETS — lid qabul qiluvchi skript
 *
 * O'rnatish:
 *  1. Google Sheets'da yangi jadval oching.
 *  2. Kengaytmalar (Extensions) -> Apps Script.
 *  3. Ichidagi hamma narsani o'chirib, shu kodni joylang.
 *  4. Pastdagi SECRET ni o'zingiz o'ylab topgan maxfiy so'zga almashtiring.
 *  5. Deploy -> New deployment -> Type: Web app
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Deploy bosing, chiqqan havolani nusxalang.
 *  6. O'sha havolani Vercel'da SHEETS_WEBHOOK_URL ga,
 *     maxfiy so'zni esa LEAD_SECRET ga yozing.
 */

var SECRET = "SHU_YERGA_MAXFIY_SOZ";   // <-- o'zgartiring

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (SECRET && data.secret !== SECRET) {
      return json({ ok: false, error: "forbidden" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Birinchi marta — sarlavha qatorini yozamiz
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Sana", "Ism", "Telefon", "Manba", "Referrer", "IP", "Qurilma"]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      data.name || "",
      "'" + (data.phone || ""),   // ' — Sheets raqamni buzmasligi uchun
      data.source || "",
      data.ref || "",
      data.ip || "",
      data.ua || ""
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, msg: "alive" });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
