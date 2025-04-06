// كشف التمرير لتحريك الكروت
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll("article.card");

  const showCardsOnScroll = () => {
    cards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < window.innerHeight - 150) {
        card.classList.add("show");
      }
    });
  };

  window.addEventListener("scroll", showCardsOnScroll);
  showCardsOnScroll();
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 70) {
    headerElement.classList.add("scroll-down");
  } else {
    headerElement.classList.remove("scroll-down");
  }
});
