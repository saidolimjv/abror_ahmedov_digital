/**
 * POST /api/lead
 * Formadan kelgan lidni Google Sheets'ga (Apps Script webhook orqali) yuboradi.
 *
 * Vercel'da kerakli Environment Variable:
 *   SHEETS_WEBHOOK_URL  — Google Apps Script "Web app" havolasi
 *   LEAD_SECRET         — (ixtiyoriy) Apps Script bilan mos keladigan maxfiy so'z
 *
 * Bu qiymatlarni faqat Vercel Settings -> Environment Variables bo'limiga kiriting.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const name  = String(body.name  || "").trim().slice(0, 80);
    const phone = String(body.phone || "").trim().slice(0, 20);

    if (name.length < 2 || !/^\+998\d{9}$/.test(phone)) {
      return res.status(400).json({ ok: false, error: "Invalid name or phone" });
    }

    const webhook = process.env.SHEETS_WEBHOOK_URL;
    if (!webhook) {
      console.error("SHEETS_WEBHOOK_URL o'rnatilmagan — lid saqlanmadi:", name, phone);
      return res.status(200).json({ ok: false, error: "Webhook not configured" });
    }

    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket?.remoteAddress || "";

    const payload = {
      secret: process.env.LEAD_SECRET || "",
      name,
      phone,
      source: String(body.source || "").slice(0, 200),
      ref:    String(body.ref    || "").slice(0, 200),
      ua:     String(body.ua     || "").slice(0, 300),
      ip,
      createdAt: new Date().toISOString()
    };

    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("Sheets webhook xatosi:", r.status, txt.slice(0, 300));
      return res.status(200).json({ ok: false, error: "Sheets error" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("api/lead xatosi:", err);
    return res.status(200).json({ ok: false, error: "Server error" });
  }
}
