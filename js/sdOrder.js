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
  checkRequestTime();
  generateOrderId();
  setupPaymentMethodFields();
});

function generateOrderId() {
  // تاريخ اليوم + 6 أرقام عشوائية
  const today = new Date();
  const datePart =
    today.getFullYear().toString().substr(-2) +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    today.getDate().toString().padStart(2, "0");
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  const orderId = "sdeg" + datePart + randomPart;

  document.getElementById("orderId").textContent = orderId;
  localStorage.setItem("currentOrderId", orderId);
}

// إعداد حقول طريقة الدفع
function setupPaymentMethodFields() {
  const paymentMethod = document.getElementById("payment-method");
  const bankFields = document.getElementById("bank-fields");
  const mobileMoneyFields = document.getElementById("mobile-money-fields");

  paymentMethod.addEventListener("change", function () {
    bankFields.classList.add("hidden");
    mobileMoneyFields.classList.add("hidden");

    if (this.value === "bank") {
      bankFields.classList.remove("hidden");
    } else if (this.value !== "") {
      mobileMoneyFields.classList.remove("hidden");
    }
  });
}

// حساب المبلغ الإجمالي
function calculateTotal() {
  const amount = parseFloat(document.getElementById("amount").value) || 0;
  const currency = document.getElementById("currency").value;
  const transactionType = document.getElementById("transaction-type").value;

  let rate = 0;

  if (currency === "sdg") {
    rate = transactionType === "buy" ? 580 : 570;
  } else {
    rate = transactionType === "buy" ? 48 : 47;
  }

  const total = amount * rate;
  document.getElementById("total-price").textContent = total.toFixed(2);
  document.getElementById("currency-symbol").textContent =
    currency === "sdg" ? "جنيه سوداني" : "جنيه مصري";
}

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

  const phoneNumber = document.getElementById("phone").value.trim();
  const currentTime = new Date().getTime();
  localStorage.setItem(
    `lastRequestTime_${phoneNumber}`,
    currentTime.toString()
  );

  alert(
    "تم إرسال طلبك بنجاح! رقم الطلب: " +
      document.getElementById("orderId").textContent +
      "\nيرجى حفظ رقم الطلب للمتابعة"
  );

  setTimeout(function () {
    location.reload();
  }, 3000);
});

// جلب أسعار الصرف من ملف JSON
async function fetchExchangeRates() {
  try {
    const response = await fetch("../data/exchange-rates-sdeg.json");
    const data = await response.json();
    exchangeRates = data.rates;
    updateRateDisplay();
  } catch (error) {
    console.error("فشل جلب أسعار الصرف:", error);
    alert("تعذر تحميل أسعار الصرف، سيتم استخدام القيم الافتراضية");
  }
}

// تحديث عرض الأسعار في الواجهة
function updateRateDisplay() {
  document.getElementById("rate-buy-sdg").textContent =
    exchangeRates.sdg.buy + " ج";
  document.getElementById("rate-sell-sdg").textContent =
    exchangeRates.sdg.sell + " ج";
  document.getElementById("rate-buy-egp").textContent =
    exchangeRates.egp.buy + " ج";
  document.getElementById("rate-sell-egp").textContent =
    exchangeRates.egp.sell + " ج";
}

// عدل دالة calculateTotal لاستخدام الأسعار من JSON
function calculateTotal() {
  const amount = parseFloat(document.getElementById("amount").value) || 0;
  const currency = document.getElementById("currency").value;
  const transactionType = document.getElementById("transaction-type").value;

  const rate = exchangeRates[currency][transactionType];

  const total = amount * rate;
  document.getElementById("total-price").textContent = total.toFixed(2);
  document.getElementById("currency-symbol").textContent =
    currency === "sdg" ? "جنيه سوداني" : "جنيه مصري";
}

// أضف استدعاء الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  fetchExchangeRates();
  // ... باقي الكود
});

// جلب أسعار الصرف من ملف JSON
async function fetchExchangeRates() {
  try {
    const response = await fetch("../data/exchange-rates-sdeg.json");
    const data = await response.json();
    exchangeRates = data.rates;
    updateRateDisplay();
  } catch (error) {
    console.error("فشل جلب أسعار الصرف:", error);
    alert("تعذر تحميل أسعار الصرف، سيتم استخدام القيم الافتراضية");
  }
}

// تحديث عرض الأسعار في الواجهة
function updateRateDisplay() {
  document.getElementById("rate-buy-sdg").textContent =
    exchangeRates.sdg.buy + " ج";
  document.getElementById("rate-sell-sdg").textContent =
    exchangeRates.sdg.sell + " ج";
  document.getElementById("rate-buy-egp").textContent =
    exchangeRates.egp.buy + " ج";
  document.getElementById("rate-sell-egp").textContent =
    exchangeRates.egp.sell + " ج";
}

// عدل دالة calculateTotal لاستخدام الأسعار من JSON
function calculateTotal() {
  const amount = parseFloat(document.getElementById("amount").value) || 0;
  const currency = document.getElementById("currency").value;
  const transactionType = document.getElementById("transaction-type").value;

  const rate = exchangeRates[currency][transactionType];

  const total = amount * rate;
  document.getElementById("total-price").textContent = total.toFixed(2);
  document.getElementById("currency-symbol").textContent =
    currency === "sdg" ? "جنيه سوداني" : "جنيه مصري";
}

// أضف استدعاء الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  fetchExchangeRates();
  // ... باقي الكود
});
document
  .getElementById("orderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // استبدل بتوكن البوت ومعرف الدردشة الخاص بك
    const BOT_TOKEN = "7703103368:AAExgkSsLOG3kacdjc9YcmqcPwNOa6VG_uk";
    const CHAT_ID = "7063804804";
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // جلب البيانات من النموذج
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const transactionType = document.getElementById("transaction-type").value;
    const currency = document.getElementById("currency").value;
    const paymentMethod = document.getElementById("payment-method").value;
    const amount = document.getElementById("amount").value;
    const totalPrice = document.getElementById("total-price").textContent;
    const orderId = document.getElementById("orderId").textContent;

    const message = `\n\n\u2709 طلب جديد\n-----------------------\n\uD83D\uDC64 الاسم: ${name}\n\uD83D\uDCF1 الهاتف: ${phone}\n\uD83D\uDCB3 نوع العملية: ${transactionType}\n\uD83D\uDCB0 العملة: ${currency}\n\uD83D\uDCB8 طريقة الدفع: ${paymentMethod}\n\uD83D\uDCB5 المبلغ المطلوب: ${amount} USD\n\uD83D\uDCB6 المبلغ الإجمالي: ${totalPrice}\n\uD83C\uDF10 رقم الطلب: ${orderId}\n-----------------------`;

    // إرسال الطلب إلى تيليجرام
    fetch(TELEGRAM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert("تم إرسال الطلب بنجاح!");
          document.getElementById("orderForm").reset();
        } else {
          alert("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("تعذر الاتصال بتيليجرام.");
      });
  });
