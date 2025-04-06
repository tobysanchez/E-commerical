// دالة حساب المبلغ الإجمالي
function calculateTotal() {
  const amount = parseFloat(document.getElementById("amount").value);
  const transactionType = document.getElementById("transaction-type").value;
  const currency = document.getElementById("currency").value;

  if (isNaN(amount) || amount <= 0) {
    document.getElementById("total-price").textContent = "0.00";
    return;
  }

  // الحصول على أسعار الصرف من localStorage
  const exchangeRates = JSON.parse(localStorage.getItem("exchangeRates"));

  if (!exchangeRates) {
    console.error("Exchange rates not loaded yet");
    return;
  }

  let exchangeRate = 0;

  // تحديد سعر الصرف بناءً على العملة ونوع المعاملة (شراء أو بيع)
  if (currency === "sdg") {
    exchangeRate =
      transactionType === "buy"
        ? exchangeRates.usd_to_sdg.buy
        : exchangeRates.usd_to_sdg.sell;
  } else if (currency === "egp") {
    exchangeRate =
      transactionType === "buy"
        ? exchangeRates.usd_to_egp.buy
        : exchangeRates.usd_to_egp.sell;
  }

  // حساب المبلغ الإجمالي
  const totalPrice = amount * exchangeRate;

  // عرض المبلغ الإجمالي
  document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}
// توليد رقم عملية عشوائي
function generateTransactionId() {
  const prefix = "TRX";
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomNum}`;
}

// نسخ رقم العملية
function setupCopyButton() {
  const copyBtn = document.getElementById("copy-transaction-id");
  copyBtn.addEventListener("click", () => {
    const transactionId = document.getElementById("transaction-id").textContent;
    navigator.clipboard.writeText(transactionId).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  });
}
