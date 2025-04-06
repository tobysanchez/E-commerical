// تعيين معلومات بوت التليجرام
const BOT_TOKEN = "7703103368:AAExgkSsLOG3kacdjc9YcmqcPwNOa6VG_uk";
const CHAT_ID = "7063804804";

// دالة لإرسال البيانات إلى التليجرام
function sendToTelegram() {
  const card = document.querySelector(".card");
  const title = card.querySelector(".title").textContent;
  const description = card.querySelector(".description").textContent;
  const price = card.querySelector(".price").textContent;
  const message = `\u{1F6D2} *طلب جديد*\n*المنتج:* ${title}\n*الوصف:* ${description}\n*السعر:* ${price})`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("تم إرسال الطلب:", data))
    .catch((error) => console.error("حدث خطأ:", error));
}
