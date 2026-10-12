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
