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
  renderSkillsSection(data.skills);
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

// // Render experience section
// function renderExperienceSection(experiences) {
//   const container = document.querySelector(".list.experience");
//   container.innerHTML = experiences
//     .map(
//       (exp) => `
//         <li>
//           <div class="date">${exp.duration}</div>
//           <div class="details">
//             <h3 class="position"><span>${exp.role}, ${exp.company}</span></h3>
//             <p class="job-description">${exp.description}</p>
//           </div>
//         </li>
//       `
//     )
//     .join("");
// }

function renderExperienceSection(experiences) {
  const container = document.querySelector(".list.experience");
  container.innerHTML = experiences
    .map((exp) => {
      let formattedDescription = exp.description;
      exp.keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
        formattedDescription = formattedDescription.replace(
          regex,
          `<span class="highlight-keyword">$1</span>`
        );
      });

      return `
        <li>
          <div class="date">${exp.duration}</div>
          <div class="details">
            <h3 class="position"><span>${exp.role}, ${exp.company}</span></h3>
            <p class="job-description">${formattedDescription}</p>
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
              <svg xmlns="http://www.w3.org/2000/svg"><path d="m2.828 15.555 7.777-7.779L2.828 0 0 2.828l4.949 4.948L0 12.727l2.828 2.828z"/></svg>
              <h3 class="project-topic">${proj.topic}</h3>
            </span>
            <p class="project-description">${proj.description}</p>
          </div>
        </li>
      `
    )
    .join("");
}

// Show error fallback UI
function showError(error) {
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
