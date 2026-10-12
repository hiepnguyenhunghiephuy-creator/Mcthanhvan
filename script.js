// ===== Video dẫn — fileId sẽ được điền khi có dữ liệu từ Google Drive =====
const VIDEOS = [
  { title: "Hoạt náo khuấy động chương trình YEP", fileId: null },
  { title: "MC chương trình Hào Khí Việt Nam — Khu đô thị FPT", fileId: null },
  { title: "MC Gala", fileId: null },
  { title: "MC hoạt náo ngoài trời cùng Phạm Quỳnh Anh", fileId: null },
  { title: "MC hoạt náo ngoài trời", fileId: null },
  { title: "MC Hội thảo", fileId: null },
  { title: "MC Khai trương", fileId: null },
  { title: "MC sự kiện POD Omni Channel", fileId: null },
];

const grid = document.getElementById("videosGrid");
VIDEOS.forEach((v, i) => {
  const card = document.createElement("article");
  card.className = "glass-card video-card reveal";
  card.innerHTML = `
    <div class="video-thumb">
      ${v.fileId ? "" : '<span class="video-soon">Sắp cập nhật</span>'}
      <span class="play-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
    </div>
    <div class="video-body"><h3>${v.title}</h3></div>`;
  card.addEventListener("click", () => openVideo(v));
  grid.appendChild(card);
});

// ===== Modal xem video =====
const modal = document.getElementById("videoModal");
const modalTitle = document.getElementById("modalTitle");
const modalFrame = document.getElementById("modalFrame");

function openVideo(v) {
  if (!v.fileId) {
    modalTitle.textContent = v.title;
    modalFrame.src = "";
    modalFrame.style.display = "none";
    const box = modal.querySelector(".modal-video");
    box.innerHTML = '<p style="padding:60px 20px;text-align:center;color:var(--muted)">Video đang được cập nhật — quay lại sau nhé!</p>';
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    // restore iframe container for next open
    setTimeout(() => {
      box.innerHTML = '<iframe id="modalFrame" src="" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>';
    }, 100);
    return;
  }
  modalTitle.textContent = v.title;
  const frame = document.getElementById("modalFrame");
  if (frame) {
    frame.style.display = "";
    frame.src = `https://drive.google.com/file/d/${v.fileId}/preview`;
  }
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeVideo() {
  modal.hidden = true;
  document.body.style.overflow = "";
  const frame = document.getElementById("modalFrame");
  if (frame) frame.src = "";
}
document.getElementById("modalClose").addEventListener("click", closeVideo);
document.getElementById("modalBackdrop").addEventListener("click", closeVideo);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeVideo(); });

// ===== Nav =====
const nav = document.getElementById("nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
  })
);

// ===== Reveal on scroll =====
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Booking form =====
const form = document.getElementById("bookingForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const dateStr = d.get("date")
    ? new Date(d.get("date") + "T00:00:00").toLocaleDateString("vi-VN")
    : "—";
  const text =
`YÊU CẦU ĐẶT LỊCH — MC THANH VÂN
------------------------------
Họ tên: ${d.get("name")}
SĐT: ${d.get("phone")}
Loại sự kiện: ${d.get("type")}
Ngày dự kiến: ${dateStr}
Địa điểm: ${d.get("venue") || "—"}
Ghi chú: ${d.get("note") || "—"}`;
  document.getElementById("bookingText").textContent = text;
  document.getElementById("formResult").hidden = false;
  document.getElementById("formResult").scrollIntoView({ behavior: "smooth", block: "nearest" });
});
document.getElementById("copyBooking").addEventListener("click", async (btn) => {
  const text = document.getElementById("bookingText").textContent;
  try {
    await navigator.clipboard.writeText(text);
    btn.target.textContent = "Đã sao chép ✓";
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    btn.target.textContent = "Đã sao chép ✓";
  }
  setTimeout(() => (btn.target.textContent = "Sao chép nội dung"), 2500);
});
