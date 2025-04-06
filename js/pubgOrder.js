document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    // بيانات الطلب
    let name = document.querySelector("input[name='name']").value;
    let phone = document.querySelector("input[name='phone']").value;
    let email = document.querySelector("input[name='email']").value;
    let offer = document.querySelector("select[name='offer']").value;
    let payment = document.querySelector("select[name='payment']").value;
    let gameId = document.querySelector("input[name='game-id']").value;

    // 🔹 توكن البوت (ضع توكن بوتك هنا)
    let botToken = "7703103368:AAExgkSsLOG3kacdjc9YcmqcPwNOa6VG_uk";

    // 🔹 Chat ID (ضع الـ ID الذي تريد استقبال الرسائل عليه)
    let chatId = "7063804804";

    // 🔹 تنسيق الرسالة
    let message =
      `📌 *طلب جديد:*\n\n` +
      `👤 *الاسم:* ${name}\n` +
      `📞 *رقم الهاتف:* ${phone}\n` +
      `📧 *البريد الإلكتروني:* ${email}\n` +
      `🎮 *العرض:* ${offer} شدة\n` +
      `💳 *طريقة الدفع:* ${payment}\n` +
      `🆔 *ID الحساب:* ${gameId}`;

    // 🔹 رابط API التليجرام
    let apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // 🔹 إرسال البيانات باستخدام Fetch API
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert("✅ تم إرسال الطلب بنجاح!");
          document.querySelector("form").reset(); // تفريغ الحقول
        } else {
          alert("❌ حدث خطأ أثناء الإرسال!");
        }
      })
      .catch((error) => {
        alert("❌ فشل الاتصال بالتليجرام!");
        console.error("Telegram Error:", error);
      });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const offerSelect = document.querySelector('select[name="offer"]');

  if (!offerSelect) {
    console.error("لم يتم العثور على القائمة المنسدلة للعروض!");
    return;
  }

  // استخراج اسم اللعبة من اسم الملف
  let game = window.location.pathname.split("/").pop().split(".").shift();
  console.log("اللعبة المستهدفة:", game); // للتأكد من استخراج الاسم الصحيح

  // جلب العروض من الملف JSON
  fetch("../data/offers.json") // تأكد من المسار الصحيح
    .then((response) => {
      if (!response.ok) throw new Error("لم يتم العثور على الملف");
      return response.json();
    })
    .then((data) => {
      console.log("البيانات المحمّلة:", data); // لمراجعة البيانات
      if (data[game]) {
        offerSelect.innerHTML = ""; // مسح القائمة قبل إضافة البيانات
        data[game].forEach((offer) => {
          let option = document.createElement("option");
          option.value = offer.name; // تعيين اسم العرض كقيمة
          option.textContent = `${offer.name} - ${offer.price}`; // عرض الاسم والسعر
          offerSelect.appendChild(option);
        });
      } else {
        console.warn(`لم يتم العثور على عروض للعبة: ${game}`);
        offerSelect.innerHTML = "<option>لا توجد عروض متاحة</option>";
      }
    })
    .catch((error) => {
      console.error("خطأ في تحميل العروض:", error);
      offerSelect.innerHTML = "<option>حدث خطأ، حاول لاحقًا</option>";
    });
});
