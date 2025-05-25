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
      if (window.scrollY >= sectionEl.offsetTop - sectionEl.clientHeight / 2) {
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
    const response = await fetch("/src/data/content.json");
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
  renderSkillsSection(data.skills);
  renderExperienceSection(data.experience);
  renderProjectsSection(data.projects);
  renderAboutWebsiteSection(data.about_website);
}

// Helper function to process keywords in text
function processKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return text;

  // Create a map of keywords to their replacements
  const replacements = {};
  keywords.forEach((keyword) => {
    const escaped = escapeRegExp(keyword.text);
    if (keyword.type === "link") {
      replacements[escaped] =
        `<a href="${keyword.url}" class="link-keyword" target="_blank">${keyword.text}</a>`;
    } else {
      replacements[escaped] =
        `<span class="highlight-keyword">${keyword.text}</span>`;
    }
  });

  // Create a regex pattern that matches any of the keywords (whole words only)
  const pattern = new RegExp(
    `\\b(${Object.keys(replacements).join("|")})\\b`,
    "gi"
  );

  return text.replace(
    pattern,
    (matched) => replacements[escapeRegExp(matched)]
  );
}

// Helper to escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${link.viewBox}" class="social-media" width="${link.width}" height="${link.height}" style="${link.style}" ${link.svgAttr}>
        ${link.svgPath}
      </svg>
    `;
    li.appendChild(a);
    container.appendChild(li);
  });
}

// Render about section
function renderAboutSection(about) {
  const container = document.querySelector(".description.about");
  container.innerHTML = about
    .map((para) => `<p>${processKeywords(para.content, para.keywords)}</p>`)
    .join("");
}

// Render skills section
function renderSkillsSection(skills) {
  const container = document.querySelector(".list.skills");
  container.innerHTML = skills
    .map(
      (skill) => `
      <li>
        <div class="skill">${skill}</div></li>`
    )
    .join("");
}

// Render experience section with consistent keyword highlighting
function renderExperienceSection(experiences) {
  const container = document.querySelector(".list.experience");
  container.innerHTML = experiences
    .map((exp) => {
      return `
        <li>
          <div class="date">${exp.duration}</div>
          <div class="details">
            <h3 class="position"><span>${exp.role}, ${exp.company}</span></h3>
            <p class="job-description">${processKeywords(
              exp.description,
              exp.keywords
            )}</p>
          </div>
        </li>
      `;
    })
    .join("");
}

// Render projects section
function renderProjectsSection(projects) {
  const container = document.querySelector(".list.projects");
  container.innerHTML = projects
    .map(
      (proj) => `
        <li>
          <a href="${proj.link}" target="_blank" class="project-link"></a>
          <div class="details">
            <span class="inline-icon">
              <svg class="bold-right-arrow" xmlns="http://www.w3.org/2000/svg"><path d="m2.828 15.555 7.777-7.779L2.828 0 0 2.828l4.949 4.948L0 12.727l2.828 2.828z"/></svg>
              <h3 class="project-topic">${proj.topic}</h3>
            </span>
            <p class="project-description">${processKeywords(
              proj.description,
              proj.keywords
            )}</p>
          </div>
        </li>
      `
    )
    .join("");
}

// Render about_website section
function renderAboutWebsiteSection(content) {
  const container = document.querySelector(
    ".about-website-content .description"
  );
  let html = "";

  content.forEach((item) => {
    html += `<span>`;
    switch (item.type) {
      case "paragraph":
        html += `<p class="para-content">${processKeywords(
          item.content,
          item.keywords
        )}</p>`;
        break;
      case "list":
        html += `<p class="heading">${processKeywords(
          item.heading,
          item.keywords
        )}</p>`;
        html += `<ul class="content-list">`;
        item.items.forEach((point) => {
          html += `<li class="content-point">${processKeywords(
            point.content,
            point.keywords
          )}</li>`;
        });
        html += "</ul>";
        break;
    }
    html += `</span>`;
  });

  container.innerHTML = html;
}

// Show error fallback UI
function showError() {
  const content = document.querySelector(".content");
  content.innerHTML = ``;

  const errorContent = document.querySelector(".error-container");
  errorContent.style.display = "flex";
}

// ==========================
// App Initialization
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  setupScrollSpy();
  loadContent();
});
