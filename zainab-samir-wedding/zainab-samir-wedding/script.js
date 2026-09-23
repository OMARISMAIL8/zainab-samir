// ===== عدّل بيانات المناسبة من هنا =====
const EVENT = {
  // اكتب التاريخ بهذا الشكل: YYYY-MM-DDTHH:mm:ss
  date: "2026-12-25T20:00:00",
  timeText: "8:00 مساءً",
  venue: "اسم القاعة أو المكان",
  address: "أضف عنوان القاعة هنا.",
  mapsQuery: "اسم القاعة أو المكان، القاهرة، مصر"
};

const $ = (selector) => document.querySelector(selector);

function formatArabicDate(date) {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function setEventInfo() {
  const eventDate = new Date(EVENT.date);
  $("#eventDateText").textContent = formatArabicDate(eventDate);
  $("#eventTime").textContent = EVENT.timeText;
  $("#venueText").textContent = EVENT.venue;
  $("#venueHeading").textContent = EVENT.venue;
  $("#venueAddress").textContent = EVENT.address;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`;
  $("#directionsLink").href = mapsUrl;

  // رابط تقويم Google Calendar
  const start = new Date(EVENT.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const toCal = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  const calUrl = new URL("https://calendar.google.com/calendar/render");
  calUrl.searchParams.set("action", "TEMPLATE");
  calUrl.searchParams.set("text", "زينب & سمير | حفل الزفاف");
  calUrl.searchParams.set("dates", `${toCal(start)}/${toCal(end)}`);
  calUrl.searchParams.set("details", "دعوة زفاف زينب وسمير");
  calUrl.searchParams.set("location", EVENT.address);
  $("#calendarLink").href = calUrl.toString();
}

function startCountdown() {
  const target = new Date(EVENT.date).getTime();
  const update = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      $("#days").textContent = "0";
      $("#hours").textContent = "0";
      $("#minutes").textContent = "0";
      $("#seconds").textContent = "0";
      $("#countdownMessage").textContent = "اليوم هو يومنا الكبير ♥";
      return;
    }
    const day = 86400000;
    const hour = 3600000;
    const minute = 60000;
    $("#days").textContent = Math.floor(diff / day);
    $("#hours").textContent = Math.floor((diff % day) / hour);
    $("#minutes").textContent = Math.floor((diff % hour) / minute);
    $("#seconds").textContent = Math.floor((diff % minute) / 1000);
    $("#countdownMessage").textContent = "لسه شوية ونكون مع بعض ♥";
  };
  update();
  setInterval(update, 1000);
}

$("#openInvite").addEventListener("click", () => {
  $("#welcome").animate(
    [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.03)" }],
    { duration: 550, easing: "ease" }
  ).onfinish = () => {
    $("#welcome").remove();
    $("#invitation").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
});

$("#rsvpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#guestName").value.trim();
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
  const message = attendance === "yes"
    ? `شكرًا يا ${name} ♥ مستنيينك معانا!`
    : `شكرًا يا ${name} ♥ هنفتقد وجودك معانا.`;
  $("#rsvpMessage").textContent = message;
  e.target.reset();
});

function renderWishes() {
  const list = JSON.parse(localStorage.getItem("zainabSamirWishes") || "[]");
  const container = $("#wishList");
  if (!list.length) {
    container.innerHTML = '<div class="empty-wishes">لسه مفيش تهاني — كن أول شخص يكتب كلمة جميلة ♥</div>';
    return;
  }
  container.innerHTML = list.map(item => `
    <article class="wish-item">
      <strong>${escapeHtml(item.name)}</strong>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  }[char]));
}

$("#wishForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#wishName").value.trim();
  const text = $("#wishText").value.trim();
  const list = JSON.parse(localStorage.getItem("zainabSamirWishes") || "[]");
  list.unshift({ name, text });
  localStorage.setItem("zainabSamirWishes", JSON.stringify(list.slice(0, 50)));
  e.target.reset();
  renderWishes();
});

setEventInfo();
startCountdown();
renderWishes();
