// Floating 3D Tech Stack Cards Animation (responsive + bounded)
document.addEventListener("DOMContentLoaded", () => {
  const root =
    document.querySelector("#skills .tech-stack-3d-cards") ||
    document.querySelector(".tech-stack-3d-cards");
  const cards = root ? root.querySelectorAll(".tech-card") : document.querySelectorAll(".tech-card");
  if (!cards.length) return;

  // Relative layout points (px computed from container size)
  const layoutDesktop = [
    [0.15, 0.18],
    [0.65, 0.16],
    [0.82, 0.42],
    // Tailwind CSS (spread a bit higher/left)
    [0.20, 0.60],
    [0.50, 0.80],
    // Next.js (nudge to the right)
    [0.60, 0.50],
    // MySQL (shift down-left)
    [0.30, 0.40],
    [0.72, 0.68],
    [0.08, 0.48],
  ];
  const layoutMobile = [
    [0.18, 0.18],
    [0.82, 0.18],
    [0.82, 0.44],
    [0.18, 0.52], // Tailwind: left-middle for clarity
    [0.50, 0.62],
    [0.50, 0.38],
    [0.22, 0.72],
    [0.78, 0.62],
    [0.10, 0.32],
  ];

  const placeCards = () => {
    const rect = root?.getBoundingClientRect();
    const cw = Math.max((rect?.width || window.innerWidth), 240);
    const ch = Math.max((rect?.height || 300), 220);
    const set = cw <= 380 || window.innerWidth <= 900 ? layoutMobile : layoutDesktop;
    cards.forEach((card, i) => {
      const [px, py] = set[i % set.length];
      const x = Math.max(0, Math.min(cw - card.offsetWidth, px * cw - card.offsetWidth / 2));
      const y = Math.max(0, Math.min(ch - card.offsetHeight, py * ch - card.offsetHeight / 2));
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      // Reset transform here; actual motion uses CSS vars combined in CSS
      card.style.transform = "";
      card.style.setProperty("--dx", "0px");
      card.style.setProperty("--dy", "0px");
    });
  };

  placeCards();
  window.addEventListener("resize", placeCards, { passive: true });

  // Subtle float motion using CSS variables so it composes with parallax
  function animateCard(card, i) {
    let angle = Math.random() * Math.PI * 2;
    let radius = 10 + Math.random() * 14; // smaller radius to avoid overflow
    function frame(t) {
      const dx = Math.cos(angle + t / 1800 + i) * radius;
      const dy = Math.sin(angle + t / 1800 + i) * radius;
      card.style.setProperty("--dx", `${dx}px`);
      card.style.setProperty("--dy", `${dy}px`);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  cards.forEach(animateCard);
});

// Animate Technologies Tag Cloud on scroll
document.addEventListener("DOMContentLoaded", () => {
  const techCloud = document.querySelector(".tech-cloud-list");
  if (techCloud) {
    const tags = Array.from(techCloud.children);
    tags.forEach((tag, i) => tag.style.setProperty("--i", i + 1));
    const animateTags = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tags.forEach((tag, i) => {
            tag.style.animationDelay = `${0.04 * i + 0.1}s`;
            tag.classList.add("visible");
          });
          observer.disconnect();
        }
      });
    };
    const observer = new IntersectionObserver(animateTags, { threshold: 0.2 });
    observer.observe(techCloud);
  }
});
// Main Portfolio Script
// =====================
// Features: Theme Toggle, Mobile Nav, Dynamic Projects, Form Validation, Scroll To Top

// Make sure this runs after the HTML is loaded
const typed = new Typed(".text", {
  strings: ["Data Analyst", "Data Science Undergraduate", "Full Stack Developer."],
  typeSpeed: 100, // typing speed (ms per character)
  backSpeed: 60, // backspacing speed
  backDelay: 1000, // pause before erasing
  loop: true, // repeat forever
});

(function () {
  "use strict";

  const body = document.body;
  const themeToggleBtn = document.getElementById("themeToggle");
  const navToggleBtn = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const projectsGrid = document.getElementById("projects-grid");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");
  const scrollTopBtn = document.querySelector(".scroll-top");
  const yearSpan = document.getElementById("year");
  const header = document.querySelector(".site-header");
  // Sync CSS --header-offset with actual header height to avoid extra top gap
  function updateHeaderOffsetVar() {
    try {
      const h = header?.offsetHeight || 0;
      document.documentElement.style.setProperty("--header-offset", `${h}px`);
    } catch {}
  }
  updateHeaderOffsetVar();
  window.addEventListener("resize", updateHeaderOffsetVar, { passive: true });

  // EmailJS configuration
  // Paste your values below from your EmailJS dashboard
  // - Public Key: emailjs.init({ publicKey: "YOUR_PUBLIC_KEY" })
  // - Service ID: e.g., "service_xxxxx"
  // - Template IDs: one for sending to you, one for auto-reply to sender
  const EMAILJS_PUBLIC_KEY = "Jb3Iz7SkqV5-nbP7y"; // <-- provided by you
  const EMAILJS_SERVICE_ID = "service_9npwo1k"; // <-- provided by you
  const EMAILJS_TEMPLATE_ID_OWNER = "template_q3sps2m"; // <-- provided by you
  const EMAILJS_TEMPLATE_ID_AUTOREPLY = "template_rek4ysa"; // <-- provided by you
  const PORTFOLIO_OWNER_NAME = "Sushan Tharuka"; // used in messages
  const PORTFOLIO_OWNER_EMAIL = "tharukasusa2023@gmail.com"; // used in messages

  try {
    // Initialize EmailJS when SDK is present and a key exists
    if (window.emailjs && EMAILJS_PUBLIC_KEY) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
  } catch (e) {
    console.warn("EmailJS init failed (SDK not loaded yet or bad key)", e);
  }

  // Set current year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Initial Theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
  }

  // Theme Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const isDark = body.classList.contains("dark-theme");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // Mobile Navigation Toggle
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener("click", () => {
      const expanded = navToggleBtn.getAttribute("aria-expanded") === "true";
      navToggleBtn.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("open");
    });

    // Close menu on link click (mobile)
    navMenu.addEventListener("click", (e) => {
      if (e.target.tagName === "A" && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        navToggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Dynamic Projects Load
  async function loadProjects() {
    if (!projectsGrid) return;
    try {
      const response = await fetch("assets/data/projects.json");
      if (!response.ok) throw new Error("Failed to load projects");
      const projects = await response.json();
      renderProjects(projects);
    } catch (err) {
      projectsGrid.innerHTML = `<p class="error">Unable to load projects right now.</p>`;
      console.error(err);
    }
  }

  function renderProjects(projects) {
    const fragment = document.createDocumentFragment();
    projects.forEach((p) => {
      const card = document.createElement("div");
      card.className = "project-card fade-in";
      const demoHref = p.demo || "";
      const codeHref = p.source || "";
      const thumbStyle = p.image
        ? `style=\"background-image:url('${p.image}')\"`
        : "";
      const demoBtn = demoHref
        ? `<a class="btn-demo" href="${demoHref}" target="_blank" rel="noopener" aria-label="Live demo for ${p.name}">
             <span class="btn-icon" aria-hidden="true">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M14 3h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 <path d="M14 10v7a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
             </span>
             <span class="btn-text">Live Demo</span>
           </a>`
        : "";
      const codeBtn = codeHref
        ? `<a class="btn-code" href="${codeHref}" target="_blank" rel="noopener" aria-label="View code for ${p.name}">
             <span class="btn-icon" aria-hidden="true">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 .5a12 12 0 0 0-3.794 23.41c.6.111.82-.26.82-.58l-.016-2.038c-3.338.726-4.042-1.61-4.042-1.61-.547-1.389-1.337-1.76-1.337-1.76-1.093-.747.082-.732.082-.732 1.208.085 1.844 1.24 1.844 1.24 1.074 1.84 2.819 1.309 3.507 1.001.108-.787.42-1.31.763-1.612-2.665-.303-5.466-1.332-5.466-5.932 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.007-.322 3.3 1.23.957-.266 1.983-.399 3.004-.404 1.02.005 2.046.138 3.005.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.236 1.911 1.236 3.221 0 4.61-2.807 5.625-5.48 5.922.432.372.818 1.103.818 2.222l-.015 3.293c0 .323.216.7.826.579A12 12 0 0 0 12 .5Z"/>
               </svg>
             </span>
             <span class="btn-text">Git</span>
           </a>`
        : "";

      card.innerHTML = `
        <div class="project-thumb" ${thumbStyle} aria-hidden="true"></div>
        <h3 class="project-title">${p.name}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">${p.tags
          .map((t) => `<span>${t}</span>`)
          .join("")}</div>
        <div class="project-links">
          ${demoBtn}${codeBtn}
        </div>
      `;
      fragment.appendChild(card);
    });
    projectsGrid.innerHTML = "";
    projectsGrid.appendChild(fragment);
  }

  // Contact Form Validation (null-safe)
  function validateField(field) {
    if (!contactForm || !field) return true;
    const errorEl = contactForm.querySelector(`.error[data-for="${field.name}"]`);
    let message = "";
    if (field.hasAttribute("required") && !field.value.trim()) {
      message = "This field is required";
    } else if (field.name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) message = "Enter a valid email address";
    } else if (field.name === "name" && field.value.trim().length < 2) {
      message = "Name must be at least 2 characters";
    } else if (field.name === "message" && field.value.trim().length < 10) {
      message = "Message must be at least 10 characters";
    }

    if (errorEl) errorEl.textContent = message;
    return message === "";
  }

  function setupForm() {
    if (!contactForm) return;

    const nameInput = contactForm.querySelector('[name="name"]');
    const emailInput = contactForm.querySelector('[name="email"]');
    const messageInput = contactForm.querySelector('[name="message"]');
    const phoneInput = contactForm.querySelector('[name="phone"]');
    const subjectInput = contactForm.querySelector('[name="_subject"]');

    const inputs = [nameInput, emailInput, messageInput].filter(Boolean);
    inputs.forEach((f) => {
      f.addEventListener("blur", () => validateField(f));
      f.addEventListener("input", () => validateField(f));
    });

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Use HTML5 validation and our minimal checks
      let allValid = true;
      inputs.forEach((f) => {
        if (!validateField(f)) allValid = false;
      });
      if (!contactForm.reportValidity() || !allValid) return;

      const submitBtn = contactForm.querySelector(".contact-submit");
      const originalText = submitBtn ? submitBtn.textContent : "";
      const statusEl = document.getElementById("form-status");
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = "Sending...";
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        // Gather values
        const nameVal = nameInput?.value?.trim() || "";
        const emailVal = emailInput?.value?.trim() || "";
        const msgVal = messageInput?.value?.trim() || "";
        const phoneVal = phoneInput?.value?.trim() || "";
        const subjectVal = subjectInput?.value?.trim() || "Portfolio Contact";

        if (!window.emailjs) throw new Error("EmailJS SDK not loaded");

        // Ensure templates receive expected variable names via hidden aliases
        const aliasDefs = [
          { name: "from_name", value: nameVal },
          { name: "from_email", value: emailVal },
          { name: "message", value: msgVal },
          { name: "subject", value: subjectVal },
          { name: "phone", value: phoneVal },
          // Auto-reply specific
          { name: "to_email", value: emailVal },
          { name: "to_name", value: nameVal },
          { name: "original_subject", value: subjectVal },
        ];
        const createdAliases = [];
        aliasDefs.forEach(({ name, value }) => {
          // Only create if not already in form
          if (!contactForm.querySelector(`[name="${name}"]`)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            contactForm.appendChild(input);
            createdAliases.push(input);
          }
        });

        // Use your variables for sendForm
        const serviceID = EMAILJS_SERVICE_ID;
        const templateID_Main = EMAILJS_TEMPLATE_ID_OWNER;
        const templateID_Reply = EMAILJS_TEMPLATE_ID_AUTOREPLY;

        // Start sending main email
        const sendPromise = emailjs.sendForm(serviceID, templateID_Main, contactForm);
        await sendPromise;

        // Auto-reply right after main succeeds
        await emailjs.sendForm(serviceID, templateID_Reply, contactForm);

        if (statusEl) statusEl.textContent = "Message Sent Successfully!";
        contactForm.reset();
        showSuccessModal();
      } catch (err) {
        // Improve error logging to surface EmailJS details
        console.error("EmailJS error:", err);
        if (err && typeof err === "object") {
          try {
            const msg = err.text || err.message || JSON.stringify(err);
            console.error("EmailJS details:", msg);
          } catch {}
        }
        if (statusEl)
          statusEl.textContent = "Sorry, sending failed. Please try again.";
      } finally {
        // Clean up any alias hidden inputs
        // Prevent accumulating hidden fields over repeated submissions
        const aliasNames = [
          "from_name",
          "from_email",
          "message",
          "subject",
          "phone",
          "to_email",
          "to_name",
          "original_subject",
        ];
        aliasNames.forEach((n) => {
          const el = contactForm.querySelector(`[name="${n}"]`);
          if (el && el.type === "hidden") el.remove();
        });
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText || "Send Message";
        }
        // Hide status after a few seconds
        setTimeout(() => {
          if (statusEl) {
            statusEl.hidden = true;
            statusEl.textContent = "";
          }
        }, 4000);
      }
    });
  }

  // Scroll To Top
  function setupScrollTop() {
    if (!scrollTopBtn) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Initialize
  loadProjects();
  setupForm();
  setupScrollTop();
  setupScrollSpy();
  setupScrollProgress();
})();

// Success modal helpers
function showSuccessModal() {
  const modal = document.getElementById("success-modal");
  const ok = document.getElementById("modal-ok");
  if (!modal || !ok) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  ok.focus();

  const close = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  // attach one-time listeners
  const backdrop = modal.querySelector(".modal-backdrop");
  const onKey = (e) => { if (e.key === "Escape") { close(); } };
  ok.addEventListener("click", close, { once: true });
  if (backdrop) backdrop.addEventListener("click", close, { once: true });
  document.addEventListener("keydown", onKey, { once: true });
}

// About CV buttons: download + view
document.addEventListener("DOMContentLoaded", () => {
  const btnDownload = document.getElementById("btnCvDownload");
  const btnView = document.getElementById("btnCvView");
  const cvPath = "assets/img/sushan%20tharuka%20cv%20spar.pdf";

  if (btnDownload) {
    btnDownload.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = cvPath;
      a.download = "Sushan_Tharuka_CV.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
  if (btnView) {
    btnView.addEventListener("click", () => {
      window.open(cvPath, "_blank", "noopener");
    });
  }
});

// Scroll Spy: highlight nav item based on section in view
function setupScrollSpy() {
  const nav = document.getElementById("nav-menu");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;
  const headerH = document.querySelector(".site-header")?.offsetHeight || 0;
  // Map section IDs to elements
  let sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // Remove non-section anchors if any
  sections = sections.filter((sec) => sec.id);

  function setActive(currentId) {
    links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${currentId}`)
    );
  }

  function onScroll() {
    const threshold = headerH + 8; // just below fixed header
    let current = sections[0]?.id || "";
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      const top = rect.top;
      const bottom = rect.bottom;
      if (top <= threshold && bottom > threshold) {
        // Do not break; prefer the deepest (last) matching section
        current = sec.id;
      }
    }
    // Handle bottom-of-page edge case
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      current = sections[sections.length - 1]?.id || current;
    }
    setActive(current);
  }

  // Smooth scroll: rely on CSS scroll-margin-top for header offset
  nav.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Set active immediately for responsiveness
      setActive(target.id);
      // Landing highlight glow
      target.classList.add("anchor-landing");
      setTimeout(() => target.classList.remove("anchor-landing"), 1000);
    }
  });

  ["scroll", "resize"].forEach((ev) =>
    window.addEventListener(ev, onScroll, { passive: true })
  );
  onScroll();
}

// Top scroll progress bar
function setupScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  const update = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const winHeight = window.innerHeight;
    const max = Math.max(docHeight - winHeight, 1);
    const pct = Math.min(Math.max((scrollTop / max) * 100, 0), 100);
    bar.style.width = pct + "%";
  };
  ["scroll", "resize", "load"].forEach((ev) =>
    window.addEventListener(ev, update, { passive: true })
  );
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  // Legacy orbit background disabled to match clean screenshot; do nothing here.

  // Animate modern skills progress bars
  const skillSection = document.getElementById("skills");
  const progressBars =
    skillSection?.querySelectorAll(".skills-modern-progress") || [];

  // Helper to fill bars safely
  const fillBars = () => {
    progressBars.forEach((bar) => {
      const width = bar.dataset.width || bar.getAttribute("data-width") || "0%";
      bar.style.width = width;
      const numeric = parseInt(width, 10);
      if (!isNaN(numeric)) bar.setAttribute("aria-valuenow", String(numeric));
    });
  };

  if (skillSection && progressBars.length) {
    // Prefer animating when section enters viewport, but be permissive
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          if (entries.some((e) => e.isIntersecting)) {
            fillBars();
            obs.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
      );
      observer.observe(skillSection);

      // Fallback: if already in view or observer doesn't fire quickly, fill after short delay
      setTimeout(() => {
        const rect = skillSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) fillBars();
      }, 200);
    } else {
      // No IntersectionObserver support
      fillBars();
    }
  }

  // Skills floating cards: subtle parallax using CSS variables
  // Logo grid hover tooltip: show name near cursor, hide fixed labels
  const logoGrid = document.querySelector("#skills .skills-logo-grid");
  if (logoGrid) {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const tooltip = document.createElement("div");
    tooltip.className = "logo-tooltip";
    tooltip.hidden = true;
    if (!isTouch) document.body.appendChild(tooltip);

    const handleMouse = (e) => {
      const target = e.target.closest(".logo-panel, .logo-card");
      let name = "";
      if (target) {
        const img = target.querySelector("img");
        name = img?.alt || target.closest(".logo-card")?.getAttribute("data-name") || "";
      }
      if (name) {
        tooltip.textContent = name;
        tooltip.style.left = `${e.clientX + 12}px`;
        tooltip.style.top = `${e.clientY + 12}px`;
        tooltip.hidden = false;
      } else {
        tooltip.hidden = true;
      }
    };

    if (!isTouch) {
      logoGrid.addEventListener("mousemove", handleMouse, { passive: true });
      logoGrid.addEventListener("mouseleave", () => (tooltip.hidden = true), { passive: true });
      window.addEventListener("scroll", () => (tooltip.hidden = true), { passive: true });
    }
  }
});

// Skills circular ring animation + counter (animate once when visible)
(function () {
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const getTargetPercent = (card) => {
    const circle = card.querySelector(".circle");
    let p = 0;
    const cssPCard = card.style.getPropertyValue("--p");
    if (cssPCard) p = parseInt(cssPCard, 10) || 0;
    if (!p && circle) {
      const cssP = circle.style.getPropertyValue("--p");
      if (cssP) p = parseInt(cssP, 10) || 0;
    }
    if (!p) {
      const txt = card.querySelector(".skill-percent")?.textContent || "";
      p = parseInt(txt, 10) || 0;
    }
    return Math.max(0, Math.min(p, 100));
  };

  function initCard(card) {
    const circle = card.querySelector(".circle");
    const label = card.querySelector(".skill-percent");
    if (!circle || !label) return;
    const target = getTargetPercent(card);
    card.dataset.targetPct = String(target);
    circle.style.setProperty("--p", "0");
    label.textContent = "0%";
    card.dataset.animated = "false";
  }

  function animateCard(card) {
    if (card.dataset.animated === "true") return;
    const circle = card.querySelector(".circle");
    const label = card.querySelector(".skill-percent");
    if (!circle || !label) return;
    const target = parseInt(card.dataset.targetPct || "0", 10);
    const duration = 1200;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(t);
      const val = Math.round(target * eased);
      circle.style.setProperty("--p", String(val));
      label.textContent = `${val}%`;
      if (t < 1) requestAnimationFrame(frame);
      else {
        card.dataset.animated = "true";
        circle.style.setProperty("--p", String(target));
        label.textContent = `${target}%`;
      }
    }
    requestAnimationFrame(frame);
  }

  function resetCard(card) {
    const circle = card.querySelector(".circle");
    const label = card.querySelector(".skill-percent");
    if (!circle || !label) return;
    circle.style.setProperty("--p", "0");
    label.textContent = "0%";
    card.dataset.animated = "false";
  }

  const SkillsAnimator = {
    observer: null,
    init() {
      const grid = document.getElementById("skills-grid");
      if (!grid) return;
      const cards = Array.from(grid.querySelectorAll(".skill-card"));
      if (!cards.length) return;

      cards.forEach(initCard);

      if ("IntersectionObserver" in window) {
        this.observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              const card = entry.target;
              if (!(card instanceof Element)) return;
              const isHidden = card.classList.contains("hidden");
              if (entry.isIntersecting && !isHidden) {
                animateCard(card);
                obs.unobserve(card);
              }
            });
          },
          { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
        );
        cards.forEach((c) => this.observer.observe(c));
      } else {
        // Fallback: animate immediately once
        cards.forEach(animateCard);
      }
    },
    onFilterChange() {
      const grid = document.getElementById("skills-grid");
      if (!grid) return;
      const cards = Array.from(grid.querySelectorAll(".skill-card"));
      cards.forEach((card) => {
        const isHidden = card.classList.contains("hidden");
        if (isHidden) {
          resetCard(card);
          if (this.observer) this.observer.observe(card);
          return;
        }
        // Visible: reset and animate once if in view; otherwise observe
        resetCard(card);
        const rect = card.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          animateCard(card);
          if (this.observer) this.observer.unobserve(card);
        } else if (this.observer) {
          this.observer.observe(card);
        }
      });
    },
  };

  window.SkillsAnimator = SkillsAnimator;
  document.addEventListener("DOMContentLoaded", () => SkillsAnimator.init());
})();

// animated background
const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");

let particlesArray;
let w, h;

// Mouse settings
const mouse = {
  x: null,
  y: null,
  radius: 120, // How close the mouse needs to be to push particles
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

function setCanvasSize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * +3;

    // Base movement speed
    this.speedX = Math.random() * 1 - 0.75;
    this.speedY = Math.random() * 1 - 0.75;

    // Resistance/Density (makes particles react differently)
    this.density = Math.random() * 20 + 1;
  }

  update() {
    // --- MOUSE REPEL LOGIC ---
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      // Calculate force and direction
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let force = (mouse.radius - distance) / mouse.radius;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      // Push particle away
      this.x -= directionX;
      this.y -= directionY;
    }

    // Apply constant floating movement
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off screen edges
    if (this.x > w || this.x < 0) this.speedX *= -1;
    if (this.y > h || this.y < 0) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = "#ff6b00";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 1);
    ctx.fill();
  }
}

function init() {
  setCanvasSize();
  particlesArray = [];
  let particleCount = Math.floor((w * h) / 15000);
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
  }
}

function connect() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.strokeStyle = `rgba(255, 107, 0, ${1 - distance / 150})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  // Fully clear frame to keep site background visible
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  connect();
  requestAnimationFrame(animate);
}

// Reset mouse coordinates when mouse leaves window
window.addEventListener("mouseout", () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

window.addEventListener("resize", () => {
  init();
});

init();
animate();

// About Read More toggle
document.addEventListener("DOMContentLoaded", () => {
  const desc = document.getElementById("about-desc");
  const btn = document.querySelector(".read-more-toggle");
  if (!desc || !btn) return;

  const update = () => {
    const isCollapsed = desc.classList.contains("collapsed");
    btn.textContent = isCollapsed ? "Read more" : "Show less";
    btn.setAttribute("aria-expanded", String(!isCollapsed));
  };

  // Initialize state
  desc.classList.add("collapsed");
  update();

  btn.addEventListener("click", () => {
    desc.classList.toggle("collapsed");
    update();
  });
});

// Global skills filtering for category buttons
function filterSkills(category) {
  try {
    const grid = document.getElementById("skills-grid");
    const cards = grid ? grid.querySelectorAll(".skill-card") : document.querySelectorAll(".skill-card");
    cards.forEach((card) => {
      const cat = card.getAttribute("data-category");
      const hide = category !== "all" && cat !== category;
      card.classList.toggle("hidden", hide);
    });

    // Also filter left-side logo grid
    const logoGrid = document.querySelector(".skills-logo-grid");
    if (logoGrid) {
      logoGrid.querySelectorAll(".logo-card").forEach((logo) => {
        const cat = logo.getAttribute("data-category");
        const hide = category !== "all" && cat !== category;
        logo.classList.toggle("hidden", hide);
      });
    }

    // Update active state on filter buttons
    const container = document.querySelector(".filter-buttons");
    if (container) {
      container.querySelectorAll(".btn").forEach((btn) => {
        const val = btn.getAttribute("data-filter") || (btn.getAttribute("onclick") || "").match(/'(.*?)'/)?.[1] || "";
        btn.classList.toggle("active", val === category);
      });
    }

    // Re-run skills ring animation logic for newly visible cards
    if (window.SkillsAnimator && typeof window.SkillsAnimator.onFilterChange === "function") {
      window.SkillsAnimator.onFilterChange();
    }
  } catch (e) {
    console.warn("filterSkills error", e);
  }
}

// Crypto Scanner Animation (mobile only): populate and detect side coloring
document.addEventListener("DOMContentLoaded", () => {
  try {
    const scanner = document.getElementById("cryptoScanner");
    if (!scanner) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    const track = scanner.querySelector(".belt-track");
    if (!track) return;

    const baseItems = [
      { type: "icon", cls: "devicon-html5-plain" },
      { type: "icon", cls: "devicon-css3-plain" },
      { type: "icon", cls: "devicon-javascript-plain" },
      { type: "icon", cls: "devicon-react-plain" },
      { type: "icon", cls: "devicon-tailwindcss-plain" },
      { type: "icon", cls: "devicon-php-plain" },
      { type: "icon", cls: "devicon-nodejs-plain" },
      { type: "icon", cls: "devicon-mysql-plain" },
      { type: "icon", cls: "devicon-mongodb-plain" },
      { type: "icon", cls: "devicon-kotlin-plain" },
      { type: "icon", cls: "devicon-git-plain" },
      { type: "icon", cls: "devicon-vscode-plain" },
      { type: "icon", cls: "devicon-figma-plain" },
    ];

    const repetitions = 20; // Repeat base set 20 times
    for (let r = 0; r < repetitions; r++) {
      baseItems.forEach((item) => {
        const span = document.createElement("span");
        span.className = "crypto-item right-muted"; // start muted (right side default)
        if (item.type === "text") {
          span.classList.add(item.cls);
          span.textContent = item.text;
        } else {
          const i = document.createElement("i");
          i.className = item.cls;
          span.appendChild(i);
        }
        track.appendChild(span);
      });
    }
    // Duplicate content for seamless loop (animate to -50%)
    track.innerHTML += track.innerHTML;

    const items = scanner.querySelectorAll(".crypto-item");
    let centerX = 0;
    const updateCenter = () => {
      const rect = scanner.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
    };
    updateCenter();
    window.addEventListener("resize", updateCenter, { passive: true });

    const detect = () => {
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const left = midX < centerX;
        el.classList.toggle("left-bright", left);
        el.classList.toggle("right-muted", !left);
        // Toggle Devicon colored variant when crossing the scan line
        const icon = el.querySelector("i");
        if (icon) {
          if (left) icon.classList.add("colored");
          else icon.classList.remove("colored");
        }
      });
    };

    // Set initial side states immediately, then keep updating
    detect();
    const timer = setInterval(detect, 8); // ~125Hz updates

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReduce = () => {
      if (reduced.matches) {
        track.style.animation = "none";
        clearInterval(timer);
        // Default muted; briefly highlight left side once
        detect();
      }
    };
    reduced.addEventListener("change", handleReduce);
    handleReduce();
  } catch (e) {
    console.warn("Crypto scanner init failed:", e);
  }
});
