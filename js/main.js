document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mobileMenu.classList.remove("open"));
    });
  }

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach((faq) => faq.classList.remove("open"));

      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Message sent — we'll be in touch!";
      btn.disabled = true;
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 4000);
    });
  }

  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
      } else {
        header.style.boxShadow = "none";
      }
    });
  }
});
