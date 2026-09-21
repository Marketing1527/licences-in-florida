(function () {
  const WHATSAPP_NUMBER = "17862537699";
  const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hi! I'm interested in licensing and staffing support for my Florida clinic."
  );

  const navItems = [
    { href: "/services.html", label: "Services", id: "services" },
    { href: "/staffing.html", label: "Staffing", id: "staffing" },
    { href: "/licensing-path.html", label: "Licencing", id: "pathway" },
    { href: "/resources.html", label: "Resources", id: "resources" },
    { href: "/about.html", label: "About", id: "about" },
    { href: "/faq.html", label: "FAQ", id: "faq" },
  ];

  function isActive(id, page) {
    if (page === "home") return false;
    if (page === id) return true;
    if (["business-licensing", "clinic-licensing", "tax-services", "business-formation"].includes(page)) {
      return id === "services";
    }
    if (["how-it-works", "counties", "blog"].includes(page) || String(page).startsWith("blog-")) {
      return id === "resources";
    }
    return false;
  }

  function renderHeader(page) {
    const links = navItems
      .map(
        (item) =>
          `<li><a href="${item.href}" class="${isActive(item.id, page) ? "active" : ""}">${item.label}</a></li>`
      )
      .join("");

    const mobileLinks = navItems
      .map((item) => `<a href="${item.href}">${item.label}</a>`)
      .join("");

    return `
      <header class="header">
        <div class="container">
          <nav class="nav">
            <a href="/" class="logo" aria-label="Licenses in Florida home">
              <img src="/assets/logo.png" alt="Licenses in Florida" class="logo-img" width="220" height="52">
            </a>
            <ul class="nav-links">${links}</ul>
            <div class="nav-actions">
              <a href="/contact.html" class="btn btn-outline">Contact</a>
              <a href="/get-started.html" class="btn btn-primary">Get Started</a>
            </div>
            <button class="menu-toggle" aria-label="Open menu" type="button">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            </button>
          </nav>
          <div class="mobile-menu">${mobileLinks}
            <a href="/get-started.html" class="btn btn-primary" style="text-align:center">Get Started</a>
          </div>
        </div>
      </header>`;
  }

  function renderFooter() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="/" class="footer-logo">
                <img src="/assets/logo.png" alt="Licenses in Florida" width="200" height="48">
              </a>
              <p>Helping clinics and medical locations navigate Florida licensing, compliance, and staffing — so you can focus on patient care.</p>
            </div>
            <div class="footer-links">
              <h4>Services</h4>
              <ul>
                <li><a href="/business-licensing.html">Business Licensing</a></li>
                <li><a href="/clinic-licensing.html">Clinic Licensing</a></li>
                <li><a href="/business-formation.html">Sunbiz &amp; Corp/LLC</a></li>
                <li><a href="/tax-services.html">Tax Services</a></li>
                <li><a href="/staffing.html">Staffing</a></li>
              </ul>
            </div>
            <div class="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="/about.html">About Us</a></li>
                <li><a href="/how-it-works.html">How It Works</a></li>
                <li><a href="/counties.html">Service Areas</a></li>
                <li><a href="/resources.html">Resources</a></li>
                <li><a href="/faq.html">FAQ</a></li>
              </ul>
            </div>
            <div class="footer-links">
              <h4>Contact</h4>
              <ul>
                <li><a href="/get-started.html">Get Started</a></li>
                <li><a href="/contact.html">Contact</a></li>
                <li><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">(786) 253-7699</a></li>
                <li><a href="mailto:info@licensingflorida.com">info@licensingflorida.com</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-legal">
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
            <a href="/disclaimer.html">Disclaimer</a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
          <div class="footer-bottom">
            <p>© 2026 Licenses in Florida. All rights reserved.</p>
            <p class="footer-credit">Made by <a href="https://marketingsvc.com" target="_blank" rel="noopener noreferrer">Essential Marketing</a></p>
          </div>
        </div>
      </footer>`;
  }

  function renderWhatsApp() {
    return `
      <a
        href="https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}"
        class="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span class="whatsapp-tooltip">Chat with us</span>
      </a>`;
  }

  const page = document.body.dataset.page || "home";
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");

  if (headerEl) headerEl.innerHTML = renderHeader(page);
  if (footerEl) footerEl.innerHTML = renderFooter();

  document.body.insertAdjacentHTML("beforeend", renderWhatsApp());
})();
