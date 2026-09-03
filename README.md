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
api/capi.js             Meta Conversions API (server-side CompleteRegistration eventi)
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

## Meta Pixel va Conversions API (CAPI)

Pixel ID kodda allaqachon o'rnatilgan: `4437457179825041`.

Forma yuborilganda **`Lead` emas, `CompleteRegistration`** eventi otiladi — bu `script.js` dagi
`CONFIG.metaConversionEvent` da belgilangan, xohlasangiz shu yerdan o'zgartirasiz.

Bu event ikki kanaldan yuboriladi va ikkalasi **bir xil `event_id`** ishlatadi, shuning uchun
Facebook ularni bitta event sifatida hisoblaydi (dublikat bo'lmaydi):

1. **Brauzer pikseli** (`fbq('track', 'CompleteRegistration', {}, {eventID: ...})`) — tezkor, lekin ad-blocker yoki Safari ITP uni bloklashi mumkin.
2. **Server CAPI** (`api/capi.js`) — ad-blockerdan mustaqil, har doim yetib boradi.

### CAPI uchun kerakli sozlash

1. Meta Events Manager → tanlangan Pixel → **Settings** → **Conversions API** bo'limiga o'ting.
2. **"Generate access token"** tugmasini bosing, chiqqan tokenni nusxalang.
3. Vercel'da: **Settings → Environment Variables**

| Nomi | Qiymati |
|---|---|
| `META_PIXEL_ID` | `4437457179825041` |
| `META_CAPI_TOKEN` | 2-qadamda olingan token |

Qo'shgandan keyin **Redeploy** qiling.

> Tokenni hech qachon kod ichiga yozmang yoki birov bilan ulashmang — u orqali pixelingizga
> istalgan event yuborish mumkin.

### Tekshirish

Deploy qilingandan keyin Events Manager → **Test Events** bo'limida telefon raqamingizni real
formaga kiritib yuboring — bir necha soniyada ham "Browser" ham "Server" ustunida
`CompleteRegistration` eventi ko'rinishi kerak, ikkalasi bitta qatorda birlashtirilgan holda
(bu — dedup ishlayotganining belgisi).


