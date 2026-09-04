/* ============================================================
   DIGITAL EKSPERT — barcha matnlar shu yerda.
   Saytdagi biror so'zni o'zgartirish uchun faqat CONFIG ni tahrirlang.
   ============================================================ */

const CONFIG = {

  /* ---- HERO ---- */
  instagram:    "@sincerelyabror",

  heroTitle:    "3 oyda yangi kasb o'rganib, oyiga $1000+ topish mumkinmi?",
  heroSubtitle: "SMM'ni 0 dan o'rganib, ilk mijozlarni topish va barqaror daromadga chiqishning aniq yo'lini bilib oling",

  /* ---- CTA tugmalar (hammasi bir xil matn) ---- */
  ctaGreen:     "Bepul sovg'ani olish",
  ctaRed:       "Bepul sovg'ani olish",
  ctaNote:      "kursga oldindan ro'yxatdan o'ting 👆",

  /* ---- Taymer ---- */
  timerSeconds: 120,          // 02:00

  /* ---- 2-bo'lim: nima olasiz ---- */
  benefitsTitle: "Bepul ro'yxatdan o'tish orqali <em>qo'lga kiritasiz:</em>",
  benefits: [
    { icon: "📋💻", text: "Kurs dasturi va batafsil ma'lumot" },
    { icon: "💰📉", text: "Eng arzon narxda kursga qo'shilish imkoniyati" },
    { icon: "📈📱", text: "SMM orqali daromad qilish bo'yicha bepul qo'llanma va shablonlar ro'yxati" },
    { icon: "🎁✨", text: "Hech qayerda berilmagan sirli bonuslar (sizga yoqishi aniq)", bonus: true }
  ],

  /* ---- 3-bo'lim: natijalar (testimonial skrinshotlar, gorizontal scroll) ---- */
  resultsTitle: "O'quvchilar <em>natijasi</em>",
  results: [
    { img: "/assets/img/testimonial-1.webp" },
    { img: "/assets/img/testimonial-2.webp" },
    { img: "/assets/img/testimonial-3.webp" },
    { img: "/assets/img/testimonial-4.webp" },
    { img: "/assets/img/testimonial-5.webp" },
    { img: "/assets/img/testimonial-6.webp" },
    { img: "/assets/img/testimonial-7.webp" },
    { img: "/assets/img/testimonial-8.webp" }
  ],

  /* ---- 4-bo'lim: ekspert ---- */
  expertName: "Abror Ahmedov",
  credentials: [
    { icon: "🏢", text: "\"Core Digital\" agentligi asoschisi" },
    { icon: "🗓", text: "8 yil tajribaga ega digital ekspert" },
    { icon: "🚀", text: "200 dan ortiq SMM va shaxsiy brend loyihalari" },
    { icon: "📈", text: "500 dan ortiq o'quvchining daromadga chiqishiga yordam bergan" }
  ],

  /* ---- 5-bo'lim: mehmon ekspertlar ---- */
  guestsTitle: "Kursda <em>mehmon ekspertlar</em> ishtirok etadi",
  guests: [
    { img: "/assets/img/guest-1.webp", name: "Komron Yuldoshev", role: "Bozordagi eng top prodyuserlardan biri" },
    { img: "/assets/img/guest-2.webp", name: "Doniyor Abdug'aniyev", role: "1000ga yaqin shogird chiqargan mobilograf va shaxsiy brend mutaxassisi" },
    { img: "/assets/img/guest-3.webp", name: "Isroil Abdullayev", role: "Sun'iy intellekt bo'yicha bozordagi eng top mutaxassislardan biri va mln$ lik AI startap asoschisi" },
    { img: "/assets/img/guest-4.webp", name: "Islomxo'ja Madaminov", role: "O'zbekistondagi eng kuchli xotira egalaridan biri" }
  ],

  /* ---- Forma ---- */
  formTitle:  "Bepul sovg'ani olish uchun ma'lumotlaringizni kiriting",
  formButton: "Davom etish",

  /* ---- Footer ---- */
  phones: ["+998 78-113-70-44"],
  legal:  "ONLINE EDU NTM · Manzil: Chinabad, 88E",

  /* ---- Texnik ----
     Meta Pixel bazaviy kodi (fbq bootstrap + init + PageView) CONFIG'da
     EMAS — u index.html va rahmat.html ning <head> qismida, Meta bergan
     xom kod bilan aynan turibdi (Pixel ID: 4437457179825041). Agar Pixel ID
     o'zgarsa, uni ikkala HTML faylda ham qo'lda almashtirish kerak.       */
  thanksUrl: "/rahmat.html",
  metaConversionEvent: "CompleteRegistration"  // Forma yuborilganda otiladigan asosiy event (Lead emas!)
};

/* ============================================================
   Bundan pastini o'zgartirish shart emas
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- 1. Oddiy matnlarni joylash ---------- */
$$("[data-cfg]").forEach(el => {
  const val = CONFIG[el.dataset.cfg];
  if (val == null) return;
  el.innerHTML = val;
});

/* ---------- 2. CTA bloklarini yasash ---------- */
$$(".cta-block").forEach(block => {
  const red   = block.dataset.cta === "red";
  const label = red ? CONFIG.ctaRed : CONFIG.ctaGreen;

  if (block.dataset.arrows) {
    const arrows = document.createElement("div");
    arrows.className = "cta-arrows";
    arrows.setAttribute("aria-hidden", "true");
    arrows.innerHTML = "<span>↓</span>".repeat(5);
    block.appendChild(arrows);
  }

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn " + (red ? "btn--red" : "btn--green");
  btn.textContent = label;
  btn.addEventListener("click", openModal);
  block.appendChild(btn);

  if (!block.dataset.notimer) {
    const t = document.createElement("div");
    t.className = "timer";
    t.innerHTML = '<span>⏱</span><span class="timer__val">02:00</span>';
    block.appendChild(t);
  }

  const note = document.createElement("p");
  note.className = "cta-note";
  note.textContent = CONFIG.ctaNote;
  block.appendChild(note);
});

/* ---------- 3. Taymer (bitta umumiy, 00:00 da to'xtaydi) ---------- */
(function timer() {
  let left = CONFIG.timerSeconds;
  const vals  = $$(".timer__val");
  const boxes = $$(".timer");

  const paint = () => {
    const m = String(Math.floor(left / 60)).padStart(2, "0");
    const s = String(left % 60).padStart(2, "0");
    vals.forEach(v => (v.textContent = `${m}:${s}`));
  };

  paint();
  const id = setInterval(() => {
    left--;
    if (left <= 0) {
      left = 0;
      paint();
      boxes.forEach(b => b.classList.add("is-done"));
      clearInterval(id);
      return;
    }
    paint();
  }, 1000);
})();

/* ---------- 4. Ro'yxatlarni chizish ---------- */
$("#benefits").innerHTML = CONFIG.benefits.map(b => `
  <div class="benefit${b.bonus ? " benefit--bonus" : ""}">
    <div class="benefit__icon">${b.icon}</div>
    <p class="benefit__text">${b.text}</p>
  </div>`).join("");

/* ---------- 4a. Natijalar: tugmali carousel ---------- */
if (CONFIG.results.length) {
  let tcIndex = 0;
  const tcImages = CONFIG.results.map(r => r.img);
  const tcImg = $("#tc-img");
  const tcDots = $("#tc-dots");

  tcDots.innerHTML = tcImages.map((_, i) =>
    `<span class="tc-dot${i === 0 ? " is-active" : ""}"></span>`).join("");
  const dotEls = $$(".tc-dot", tcDots);

  function renderTC() {
    tcImg.style.opacity = "0";
    setTimeout(() => {
      tcImg.src = tcImages[tcIndex];
      tcImg.style.opacity = "1";
    }, 150);
    dotEls.forEach((d, i) => d.classList.toggle("is-active", i === tcIndex));
  }

  tcImg.src = tcImages[0];

  $("#tc-prev").addEventListener("click", () => {
    tcIndex = (tcIndex - 1 + tcImages.length) % tcImages.length;
    renderTC();
  });
  $("#tc-next").addEventListener("click", () => {
    tcIndex = (tcIndex + 1) % tcImages.length;
    renderTC();
  });
} else {
  $("#results-section").hidden = true;
}

/* ---------- 4b. Qolgan ro'yxatlarni chizish ---------- */

$("#credentials").innerHTML = CONFIG.credentials.map(c => `
  <li><span class="ico">${c.icon}</span><span>${c.text}</span></li>`).join("");

if (CONFIG.guests.length) {
  $("#guests-section").hidden = false;
  $("#guests").innerHTML = CONFIG.guests.map(g => `
    <div class="guest">
      <img src="${g.img}" alt="${g.name}" loading="lazy">
      <div>
        <p class="guest__name">${g.name}</p>
        <p class="guest__role">${g.role}</p>
      </div>
    </div>`).join("");
}

/* ---------- 5. Footer ---------- */
$("#footer-phones").innerHTML = CONFIG.phones
  .map(p => `<a href="tel:${p.replace(/[^\d+]/g, "")}">${p}</a>`).join("<br>");
$("#footer-legal").textContent = CONFIG.legal;
$("#year").textContent = new Date().getFullYear();

/* ---------- 6. Modal ---------- */
const modal = $("#modal");
let lastFocus = null;

function openModal() {
  lastFocus = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => $("#lead-name").focus(), 60);
  track("InitiateCheckout");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

$$("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

/* ---------- 7. Telefon maskasi: XX XXX-XX-XX ---------- */
const phoneInput = $("#lead-phone");
phoneInput.addEventListener("input", () => {
  const d = phoneInput.value.replace(/\D/g, "").slice(0, 9);
  let out = d.slice(0, 2);
  if (d.length > 2) out += " " + d.slice(2, 5);
  if (d.length > 5) out += "-" + d.slice(5, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  phoneInput.value = out;
  clearError();
});
$("#lead-name").addEventListener("input", clearError);

function clearError() {
  $("#lead-error").hidden = true;
  $("#lead-name").classList.remove("is-invalid");
  phoneInput.classList.remove("is-invalid");
}

function showError(msg, field) {
  const box = $("#lead-error");
  box.textContent = msg;
  box.hidden = false;
  if (field) field.classList.add("is-invalid");
}

/* ---------- 8. Yuborish ---------- */
const submitBtn = $("#lead-submit");

submitBtn.addEventListener("click", async () => {
  const name   = $("#lead-name").value.trim();
  const digits = phoneInput.value.replace(/\D/g, "");

  if (name.length < 2)   return showError("Ismingizni kiriting", $("#lead-name"));
  if (digits.length !== 9) return showError("Telefon raqamni to'liq kiriting (9 ta raqam)", phoneInput);

  submitBtn.disabled = true;
  submitBtn.textContent = "Yuborilmoqda...";

  const phone   = "+998" + digits;
  const eventId = makeEventId();

  const leadPayload = {
    name,
    phone,
    source: location.pathname + location.search,
    ref: document.referrer || "",
    ua: navigator.userAgent
  };

  // Sheets va CAPI parallel yuboriladi — biri ikkinchisini kutmaydi
  const sheetsPromise = fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leadPayload)
  }).catch(e => console.warn("Sheets yuborishda xatolik:", e));

  const capiPromise = fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_id: eventId,
      event_name: CONFIG.metaConversionEvent,
      phone,
      event_source_url: location.href,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc")
    })
  }).catch(e => console.warn("CAPI yuborishda xatolik:", e));

  // Brauzer pikseli — CAPI bilan bir xil event_id, Facebook dublikatni o'zi bir joyga jamlaydi
  track(CONFIG.metaConversionEvent, eventId);

  try { await Promise.race([Promise.all([sheetsPromise, capiPromise]), sleep(1500)]); } catch (e) {}

  try { sessionStorage.setItem("leadName", name); } catch (e) {}
  location.href = CONFIG.thanksUrl;
});

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ---------- 9. Meta Pixel + CAPI yordamchilari ----------
   Diqqat: pixel bazaviy kodi (fbq bootstrap + init + PageView)
   endi index.html va rahmat.html ning <head> qismida, Meta'ning
   o'zi bergan xom kod bilan aynan turibdi. Bu yerda uni QAYTA
   ishga tushirmaymiz — aks holda PageView ikki marta hisoblanadi.
   Shu sababli bu yerda faqat window.fbq allaqachon borligidan
   foydalanadigan yordamchi funksiyalar qoladi.               */
function makeEventId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "ev_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

function getCookie(name) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

function track(event, eventId) {
  if (!window.fbq) return;
  if (eventId) fbq("track", event, {}, { eventID: eventId });
  else fbq("track", event);
}
