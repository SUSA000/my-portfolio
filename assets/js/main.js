// Floating 3D Tech Stack Cards Animation (responsive + bounded)
document.addEventListener("DOMContentLoaded", () => {
  const root =
    document.querySelector('#skills .tech-stack-3d-cards') ||
    document.querySelector('.tech-stack-3d-cards');
  const cards = root ? root.querySelectorAll('.tech-card') : document.querySelectorAll('.tech-card');
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
      card.style.transform = '';
      card.style.setProperty('--dx', '0px');
      card.style.setProperty('--dy', '0px');
    });
  };

  placeCards();
  window.addEventListener('resize', placeCards, { passive: true });

  // Subtle float motion using CSS variables so it composes with parallax
  function animateCard(card, i) {
    let angle = Math.random() * Math.PI * 2;
    let radius = 10 + Math.random() * 14; // smaller radius to avoid overflow
    function frame(t) {
      const dx = Math.cos(angle + t / 1800 + i) * radius;
      const dy = Math.sin(angle + t / 1800 + i) * radius;
      card.style.setProperty('--dx', `${dx}px`);
      card.style.setProperty('--dy', `${dy}px`);
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
  strings: ["Frontend Developer.", "Data Scientist", "Data Analyst."],
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
      const reviewHref = p.demo || p.source || "#";
      const thumbStyle = p.image
        ? `style=\"background-image:url('${p.image}')\"`
        : "";
      card.innerHTML = `
        <div class="project-thumb" ${thumbStyle} aria-hidden="true"></div>
        <h3 class="project-title">${p.name}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">${p.tags
          .map((t) => `<span>${t}</span>`)
          .join("")}</div>
        <div class="project-links">
          <a href="${reviewHref}" target="_blank" rel="noopener" aria-label="Review ${
        p.name
      }">Review Project</a>
        </div>
      `;
      fragment.appendChild(card);
    });
    projectsGrid.innerHTML = "";
    projectsGrid.appendChild(fragment);
  }

  // Contact Form Validation
  function validateField(field) {
    const errorEl = contactForm.querySelector(
      `.error[data-for="${field.name}"]`
    );
    let message = "";
    if (field.hasAttribute("required") && !field.value.trim()) {
      message = "This field is required";
    } else if (field.name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim()))
        message = "Enter a valid email address";
    } else if (field.name === "name" && field.value.trim().length < 2) {
      message = "Name must be at least 2 characters";
    } else if (field.name === "message" && field.value.trim().length < 10) {
      message = "Message must be at least 10 characters";
    }

    if (errorEl) {
      errorEl.textContent = message;
    }
    return message === "";
  }

  function setupForm() {
    if (!contactForm) return;

    const fields = ["name", "email", "message"].map((n) =>
      contactForm.querySelector(`[name="${n}"]`)
    );
    fields.forEach((f) => {
      f.addEventListener("blur", () => validateField(f));
      f.addEventListener("input", () => validateField(f));
    });

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Use HTML5 validation and our minimal checks
      let allValid = true;
      fields.forEach((f) => {
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
        const endpoint = "https://formsubmit.co/ajax/tharukasusa2023@gmail.com";
        const formData = new FormData(contactForm);
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) {
          if (statusEl) statusEl.textContent = "Message sent successfully. Thank you!";
          contactForm.reset();
        } else {
          throw new Error(data.message || "Unknown error");
        }
      } catch (err) {
        console.error("FormSubmit error:", err);
        if (statusEl) statusEl.textContent = "Sorry, sending failed. Please try again.";
      } finally {
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
    const y = window.scrollY + headerH + 8; // small buffer
    let current = sections[0]?.id || "";
    for (const sec of sections) {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (y >= top && y < bottom) {
        current = sec.id;
        break;
      }
    }
    // Handle bottom-of-page edge case
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      current = sections[sections.length - 1]?.id || current;
    }
    setActive(current);
  }

  // Smooth scroll with header offset where needed (optional enhancement)
  nav.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const y =
        target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
      // Set active immediately for responsiveness
      setActive(target.id);
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
  const progressBars = skillSection?.querySelectorAll(".skills-modern-progress") || [];

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
      const observer = new IntersectionObserver((entries, obs) => {
        if (entries.some((e) => e.isIntersecting)) {
          fillBars();
          obs.disconnect();
        }
      }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
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
  const skillsCardsRoot = document.querySelector('#skills .tech-stack-3d-cards');
  if (skillsCardsRoot) {
    const cards = skillsCardsRoot.querySelectorAll('.tech-card');

    // Tooltip element that follows cursor
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const tooltip = document.createElement('div');
    tooltip.className = 'tech-tooltip';
    tooltip.hidden = true;
    if (!isTouch) document.body.appendChild(tooltip);

    const handleMouse = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      // Parallax drift
      cards.forEach((card, i) => {
        const speed = (i + 1) * 0.01; // staggered parallax
        const x = (window.innerWidth - mouseX * speed) / 50;
        const y = (window.innerHeight - mouseY * speed) / 50;
        card.style.setProperty('--tx', `${x}px`);
        card.style.setProperty('--ty', `${y}px`);
      });

      // Detect hovered card via bounding box and show its name
      let hoveredName = '';
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        if (mouseX >= r.left && mouseX <= r.right && mouseY >= r.top && mouseY <= r.bottom) {
          hoveredName = card.querySelector('img')?.alt || card.getAttribute('data-logo') || '';
          break;
        }
      }
      if (hoveredName) {
        tooltip.textContent = hoveredName;
        tooltip.style.left = `${e.clientX + 12}px`;
        tooltip.style.top = `${e.clientY + 12}px`;
        tooltip.hidden = false;
      } else {
        tooltip.hidden = true;
      }
    };
    if (!isTouch) {
      window.addEventListener('mousemove', handleMouse, { passive: true });
      window.addEventListener('mouseleave', () => { tooltip.hidden = true; }, { passive: true });
      window.addEventListener('scroll', () => { tooltip.hidden = true; }, { passive: true });
    }
  }
});

// animated background 
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let particlesArray;
let w, h;

// Mouse settings
const mouse = {
    x: null,
    y: null,
    radius: 120 // How close the mouse needs to be to push particles
};

window.addEventListener('mousemove', (event) => {
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
        this.size = Math.random() * + 3;
        
        // Base movement speed
        this.speedX = (Math.random() * 1) - 0.75;
        this.speedY = (Math.random() * 1.) - 0.75;
        
        // Resistance/Density (makes particles react differently)
        this.density = (Math.random() * 20) + 1;
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
        ctx.fillStyle = '#ff6b00';
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
                ctx.strokeStyle = `rgba(255, 107, 0, ${1 - distance/150})`;
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
window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

window.addEventListener('resize', () => {
    init();
});

init();
animate();

// About Read More toggle
document.addEventListener('DOMContentLoaded', () => {
  const desc = document.getElementById('about-desc');
  const btn = document.querySelector('.read-more-toggle');
  if (!desc || !btn) return;

  const update = () => {
    const isCollapsed = desc.classList.contains('collapsed');
    btn.textContent = isCollapsed ? 'Read more' : 'Show less';
    btn.setAttribute('aria-expanded', String(!isCollapsed));
  };

  // Initialize state
  desc.classList.add('collapsed');
  update();

  btn.addEventListener('click', () => {
    desc.classList.toggle('collapsed');
    update();
  });
});
