// إعدادات بوت التليجرام
const TELEGRAM_BOT_TOKEN = "7703103368:AAExgkSsLOG3kacdjc9YcmqcPwNOa6VG_uk";
const TELEGRAM_CHAT_ID = "7063804804";

// دالة إرسال البيانات إلى التليجرام
async function sendToTelegram(formData) {
  try {
    // تنسيق الرسالة
    const transactionType =
      formData.get("transaction-type") === "buy" ? "شراء" : "بيع";
    const currency =
      formData.get("currency") === "sdg" ? "جنيه سوداني" : "جنيه مصري";
    const walletType =
      formData.get("wallet-type") === "centralized" ? "مركزية" : "لا مركزية";
    const orderid = formData.get("orderId");

    let walletDetails = "";
    if (formData.get("wallet-type") === "centralized") {
      const walletName =
        formData.get("centralized-wallet") === "other"
          ? formData.get("other-centralized")
          : document.getElementById("centralized-wallet").options[
              document.getElementById("centralized-wallet").selectedIndex
            ].text;

      walletDetails = `
🪪 اسم المحفظة: ${walletName}
📧 رقم الحساب/الإيميل: ${formData.get("centralized-account")}`;
    } else {
      const networkType =
        formData.get("network-type") === "other"
          ? formData.get("other-network")
          : document.getElementById("network-type").options[
              document.getElementById("network-type").selectedIndex
            ].text;

      walletDetails = `
🌐 شبكة التحويل: ${networkType}
📬 عنوان المحفظة: ${formData.get("wallet-address")}`;
    }

    const message = `
📌 *طلب جديد ${transactionType} USDT*

👤 الاسم: ${formData.get("name")}
📞 الهاتف: ${formData.get("phone")}

💼 نوع المحفظة: ${walletType}
${walletDetails}

💰 المبلغ: ${formData.get("amount")} USDT
نوع العمليه : ${formData.get("transaction-type")}
💸 المبلغ الإجمالي: ${
      document.getElementById("total-price").textContent
    } ${currency}
طريقة الدفع : ${formData.get("payment-method")}

🕒 الوقت: ${new Date().toLocaleString("ar-EG")}
رقم الطلب : ${document.getElementById("orderId").textContent}
`;

    // إرسال الرسالة إلى بوت التليجرام
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();
    if (!data.ok) {
      console.error("Error sending to Telegram:", data);
      alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
  }
}

// إضافة event listener للنموذج
document
  .getElementById("orderForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    // التأكد من صحة البيانات قبل الإرسال
    if (
      !formData.get("name") ||
      !formData.get("phone") ||
      !formData.get("amount")
    ) {
      alert("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }

    // إرسال البيانات إلى التليجرام
    await sendToTelegram(formData);

    // عرض رسالة نجاح للمستخدم
    alert("تم إرسال طلبك بنجاح، سنتصل بك قريبًا");

    // إعادة تعيين النموذج
    this.reset();
    document.getElementById("total-price").textContent = "0.00";
    document.getElementById("centralized-fields").classList.add("hidden");
    document.getElementById("decentralized-fields").classList.add("hidden");
  });
function updatePaymentMethods() {
  const currency = document.getElementById("currency").value;
  const paymentSelect = document.getElementById("payment-method");

  // إظهار الخيارات المناسبة وإخفاء الأخرى
  paymentSelect.querySelectorAll("option").forEach((option) => {
    option.style.display = "none";
    option.selected = false;
  });

  if (currency === "sdg") {
    paymentSelect.querySelectorAll(".sdg-option").forEach((option) => {
      option.style.display = "block";
    });
  } else {
    paymentSelect.querySelectorAll(".egp-option").forEach((option) => {
      option.style.display = "block";
    });
  }

  // إعادة تعيين القيمة المختارة
  paymentSelect.value = "";
}

// تحديث طرق الدفع عند تغيير العملة
document
  .getElementById("currency")
  .addEventListener("change", updatePaymentMethods);

// تحديث طرق الدفع عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", updatePaymentMethods);
// التحقق من الوقت المتبقي لإرسال طلب جديد
function checkRequestTime() {
  const phoneInput = document.getElementById("phone");
  const timeRestrictionMsg = document.createElement("div");
  timeRestrictionMsg.className = "time-restriction";
  timeRestrictionMsg.id = "timeRestrictionMsg";
  phoneInput.parentNode.insertBefore(
    timeRestrictionMsg,
    phoneInput.nextSibling
  );

  phoneInput.addEventListener("blur", function () {
    const phoneNumber = this.value.trim();
    if (phoneNumber) {
      const lastRequestTime = localStorage.getItem(
        `lastRequestTime_${phoneNumber}`
      );
      if (lastRequestTime) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - parseInt(lastRequestTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 1) {
          const remainingMinutes = Math.ceil(60 - hoursDiff * 60);
          document.getElementById("timeRestrictionMsg").style.display = "block";
          document.getElementById("timeRestrictionMsg").innerHTML = `
                                <i class="fas fa-clock"></i> 
                                يمكنك إرسال طلب جديد بعد ${remainingMinutes} دقيقة
                            `;
          document.getElementById("submitBtn").disabled = true;
        } else {
          document.getElementById("timeRestrictionMsg").style.display = "none";
        }
      }
    }
  });
}
// توليد رقم طلب عشوائي عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  generateOrderId();
});

function generateOrderId() {
  // تاريخ اليوم + 6 أرقام عشوائية
  const today = new Date();
  const datePart =
    today.getFullYear().toString().substr(-2) +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    today.getDate().toString().padStart(2, "0");
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  const orderId = "usdt" + datePart + randomPart;

  document.getElementById("orderId").textContent = orderId;

  // يمكنك حفظ رقم الطلب في localStorage إذا احتجت إليه لاحقًا
  localStorage.setItem("currentOrderId", orderId);
}

// تحميل أسعار الصرف
fetch("../data/exchangeRates.json")
  .then((response) => response.json())
  .then((data) => {
    // عرض أسعار الصرف
    document.getElementById("rate-buy-sdg").textContent =
      data.usd_to_sdg.buy + " ج ";
    document.getElementById("rate-sell-sdg").textContent =
      data.usd_to_sdg.sell + "  ج ";
    document.getElementById("rate-buy-egp").textContent =
      data.usd_to_egp.buy + "ج  ";
    document.getElementById("rate-sell-egp").textContent =
      data.usd_to_egp.sell + "ج  ";

    // حفظ الأسعار في localStorage لاستخدامها لاحقًا
    localStorage.setItem("exchangeRates", JSON.stringify(data));
  })
  .catch((error) => console.error("Error loading exchange rates:", error));

function toggleWalletFields() {
  const walletType = document.getElementById("wallet-type").value;
  const centralizedFields = document.getElementById("centralized-fields");
  const decentralizedFields = document.getElementById("decentralized-fields");

  // إخفاء جميع الحقول أولاً
  centralizedFields.classList.add("hidden");
  decentralizedFields.classList.add("hidden");

  // إظهار الحقول المناسبة بناءً على الاختيار
  if (walletType === "centralized") {
    centralizedFields.classList.remove("hidden");
    document.getElementById("wallet-address").removeAttribute("required");
    document.getElementById("centralized-account").setAttribute("required", "");
  } else if (walletType === "decentralized") {
    decentralizedFields.classList.remove("hidden");
    document.getElementById("centralized-account").removeAttribute("required");
    document.getElementById("wallet-address").setAttribute("required", "");
  }
}

// إضافة event listeners للخيارات "أخرى"
document
  .getElementById("centralized-wallet")
  .addEventListener("change", function () {
    const otherContainer = document.getElementById(
      "other-centralized-container"
    );
    if (this.value === "other") {
      otherContainer.classList.remove("hidden");
      document.getElementById("other-centralized").setAttribute("required", "");
    } else {
      otherContainer.classList.add("hidden");
      document.getElementById("other-centralized").removeAttribute("required");
    }
  });

document.getElementById("network-type").addEventListener("change", function () {
  const otherContainer = document.getElementById("other-network-container");
  if (this.value === "other") {
    otherContainer.classList.remove("hidden");
    document.getElementById("other-network").setAttribute("required", "");
  } else {
    otherContainer.classList.add("hidden");
    document.getElementById("other-network").removeAttribute("required");
  }
});

// تحديث رمز العملة عند تغيير العملة
document.getElementById("currency").addEventListener("change", function () {
  const currencySymbol = document.getElementById("currency-symbol");
  currencySymbol.textContent =
    this.value === "sdg" ? "جنيه سوداني" : "جنيه مصري";
});

// تفعيل زر الإرسال بعد التحقق من reCAPTCHA
function enableSubmit() {
  document.getElementById("submitBtn").disabled = false;
  document.getElementById("submitBtn").style.display = "block";
}

// معالجة إرسال النموذج
document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // التحقق من reCAPTCHA
  const response = grecaptcha.getResponse();
  if (response.length == 0) {
    alert("الرجاء التحقق من أنك لست روبوت");
    return false;
  }

  // هنا يمكنك إضافة كود إرسال البيانات إلى الخادم
  alert(
    "تم إرسال طلبك بنجاح! رقم الطلب يفضل اخذ اسكرين شوت : " +
      document.getElementById("orderId").textContent
  );

  // إعادة تحميل الصفحة لإنشاء طلب جديد
  setTimeout(function () {
    location.reload();
  }, 3000);
});
