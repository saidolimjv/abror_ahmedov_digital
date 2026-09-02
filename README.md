# Digital Ekspert — lid yig'uvchi lending

Statik sayt (HTML/CSS/JS) + bitta Vercel serverless funksiya. Framework yo'q, build yo'q.

## Fayllar

```
index.html              asosiy sahifa
rahmat.html             forma to'ldirilgandan keyingi sahifa (Telegram tugmasi)
assets/css/styles.css   barcha stillar (ranglar eng yuqorida)
assets/js/script.js     BARCHA MATNLAR shu yerda — CONFIG obyektida
assets/img/             rasmlar
api/lead.js             lidni Google Sheets'ga yuboradi
google-apps-script.gs   Google Sheets tomonidagi kod
```

## Kerakli rasmlar

`assets/img/` ichiga shu nomlar bilan tashlang:

| Fayl | Nima | Tavsiya |
|---|---|---|
| `avatar.jpg` | Instagram badge uchun kichik yumaloq rasm | 200×200 |
| `hero.png` | 1-ekrandagi katta foto | foni olib tashlangan PNG |
| `bio.png` | "Abror Ahmedov" bo'limidagi foto | foni olib tashlangan PNG |
| `favicon.png` | brauzer ikonkasi | 64×64 |
| `result-1.jpg` … | o'quvchilar natijasi skrinshotlari | vertikal |
| `guest-1.jpg` … | mehmon ekspertlar avatarlari | 300×300 |

Natija va mehmon rasmlarini qo'shgandan keyin `script.js` dagi `results` va `guests`
massivlaridagi izohlarni oching (`//` ni olib tashlang) — bo'limlar avtomatik paydo bo'ladi.

## Matnni o'zgartirish

Hammasi `assets/js/script.js` faylining boshidagi `CONFIG` da:
sarlavha, subtitle, tugma matnlari, 4 ta karta, regaliyalar, telefon, manzil, taymer.

Taymer: `timerSeconds: 120` — 02:00 dan boshlanadi, 00:00 da to'xtaydi.

**Diqqat:** o'zbekcha apostroflarni (`o'`, `g'`) to'g'ridan-to'g'ri faylga yozing.

## Google Sheets ulash

1. Google Sheets'da yangi jadval oching.
2. Extensions → Apps Script → `google-apps-script.gs` ichidagi kodni joylang.
3. `SECRET` ni o'zingiz o'ylab topgan so'zga almashtiring.
4. Deploy → New deployment → **Web app**, Execute as: *Me*, Who has access: **Anyone** → Deploy.
5. Chiqqan havolani nusxalang.

Keyin Vercel'da: **Settings → Environment Variables**

| Nomi | Qiymati |
|---|---|
| `SHEETS_WEBHOOK_URL` | 5-qadamdagi havola |
| `LEAD_SECRET` | 3-qadamdagi maxfiy so'z |

Qo'shgandan keyin **Redeploy** qiling — env o'zgaruvchilar shundan keyin ishlaydi.

> Bu qiymatlarni hech qachon kod ichiga yozmang va hech kimga yubormang.

## Deploy (GitHub → Vercel)

```bash
git init
git add .
git commit -m "Digital Ekspert lending"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Vercel → Add New → Project → repo'ni tanlang.
Framework Preset: **Other**. Build Command va Output Directory — bo'sh qoldiring.

## Meta Pixel

`script.js` dagi `metaPixelId: ""` ga Pixel ID ni yozsangiz yetarli.
`PageView`, `InitiateCheckout` (forma ochilganda) va `Lead` (forma yuborilganda) avtomatik ishlaydi.
