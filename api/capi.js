/**
 * POST /api/capi
 * Meta Conversions API (CAPI) — forma yuborilganda server tomonidan
 * qo'shimcha signal yuboradi. Brauzer pikseli bilan BIR XIL event_id
 * ishlatiladi, shunda Facebook ikkalasini bitta event sifatida hisoblaydi
 * (dublikat bo'lmaydi), lekin ad-blocker yoki Safari ITP tufayli
 * brauzer signali yo'qolsa ham, server signali baribir yetib boradi.
 *
 * Vercel'da kerakli Environment Variable'lar:
 *   META_PIXEL_ID    — Pixel ID (masalan: 4437457179825041)
 *   META_CAPI_TOKEN   — Meta Events Manager > Settings > Conversions API
 *                        bo'limidan olinadigan "Generate access token"
 *
 * Bu qiymatlarni faqat Vercel Settings -> Environment Variables bo'limiga kiriting.
 */

import crypto from "crypto";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const eventId   = String(body.event_id || "").slice(0, 100);
    const eventName = String(body.event_name || "CompleteRegistration").slice(0, 60);
    const phone     = String(body.phone || "").trim();

    if (!eventId || !/^\+998\d{9}$/.test(phone)) {
      return res.status(400).json({ ok: false, error: "Invalid event_id or phone" });
    }

    const pixelId = process.env.META_PIXEL_ID;
    const token   = process.env.META_CAPI_TOKEN;

    if (!pixelId || !token) {
      console.error("META_PIXEL_ID yoki META_CAPI_TOKEN o'rnatilmagan — CAPI event yuborilmadi");
      return res.status(200).json({ ok: false, error: "CAPI not configured" });
    }

    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket?.remoteAddress || "";
    const ua = String(body.user_agent || req.headers["user-agent"] || "").slice(0, 400);

    // Meta talabi: telefon raqam SHA-256 bilan hash qilinadi (+ belgisisiz, faqat raqamlar)
    const phoneDigits = phone.replace(/\D/g, "");

    const userData = {
      ph: [sha256(phoneDigits)],
      client_ip_address: ip,
      client_user_agent: ua
    };
    if (body.fbp) userData.fbp = String(body.fbp).slice(0, 200);
    if (body.fbc) userData.fbc = String(body.fbc).slice(0, 200);

    const payload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: String(body.event_source_url || "").slice(0, 500),
        user_data: userData
      }]
    };

    const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("Meta CAPI xatosi:", r.status, txt.slice(0, 300));
      return res.status(200).json({ ok: false, error: "CAPI error" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("api/capi xatosi:", err);
    return res.status(200).json({ ok: false, error: "Server error" });
  }
}
