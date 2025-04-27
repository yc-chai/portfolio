// Reset hash when page loads
document.location.hash = "";

// ==========================
// Function Definitions
// ==========================

// Scrollspy: Update nav active link based on scroll
function setupScrollSpy() {
  const navLinkEls = document.querySelectorAll(".nav-link");
  const sectionEls = document.querySelectorAll(".main-section");
  let currentSection = "about";

  window.addEventListener("scroll", () => {
    sectionEls.forEach((sectionEl) => {
      if (window.scrollY >= sectionEl.offsetTop - sectionEl.clientHeight / 5) {
        currentSection = sectionEl.id;
      }
    });

    navLinkEls.forEach((navLinkEl) => {
      if (navLinkEl.href.includes(currentSection)) {
        const activeEl = document.querySelector(".active");
        if (activeEl) activeEl.classList.remove("active");
        navLinkEl.classList.add("active");
      }
    });
  });
}

// Load and render content from content.json
async function loadContent() {
  try {
    const response = await fetch("content.json");
    if (!response.ok) {
      throw new Error("Failed to fetch content.json");
    }
    const data = await response.json();
    renderContent(data);
  } catch (error) {
    showError(error);
  }
}

// Render content into the page
function renderContent(data) {
  renderSocialLinks(data.socials);
  renderAboutSection(data.about);
  renderExperienceSection(data.experience);
  renderProjectsSection(data.projects);
}

// Render social links
function renderSocialLinks(links) {
  const container = document.getElementById("social-links");
  container.innerHTML = ""; // Clear skeletons

  links.forEach((link) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.innerHTML = `
      <span class="sr-only">${link.platform}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${link.viewBox}" class="social-media">
        <title>${link.platform}</title>
        <path d="${link.svgPath}"></path>
      </svg>
    `;
    li.appendChild(a);
    container.appendChild(li);
  });
}

// Render about section
function renderAboutSection(about) {
  const container = document.querySelector(".description.about");
  container.innerHTML = about.map((para) => `<p>${para}</p>`).join("");
}

// Render experience section
function renderExperienceSection(experiences) {
  const container = document.querySelector(".list.experience");
  container.innerHTML = experiences
    .map(
      (exp) => `
        <li>
          <div class="date">${exp.duration}</div>
          <div class="details">
            <h3 class="position"><span>${exp.role}, ${exp.company}</span></h3>
            <p class="job-description">${exp.description}</p>
          </div>
        </li>
      `
    )
    .join("");
}

// Render projects section
function renderProjectsSection(projects) {
  const container = document.querySelector(".list.projects");
  container.innerHTML = projects
    .map(
      (proj) => `
        <li>
          <a href="${proj.link}" target="_blank" class="project-link">
            <div class="details">
              <h3 class="project-topic">${proj.topic}</h3>
              <p class="project-description">${proj.description}</p>
            </div>
          </a>
        </li>
      `
    )
    .join("");
}

// Show error fallback UI
function showError(error) {
  console.error(error);
  const content = document.querySelector(".content");
  content.innerHTML = `
    <div class="error-msg" style="text-align: center; margin: auto;">
      <p>Failed to load content. Please try refreshing or contact <a href="mailto:yongchen99.work@gmail.com">yongchen99.work@gmail.com</a></p>
    </div>
  `;
}

// ==========================
// App Initialization
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  setupScrollSpy();
  loadContent();
});
