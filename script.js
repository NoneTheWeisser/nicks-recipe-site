// DOM ready log
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is loaded!");

  // Get base path depending on where the HTML file is
  const basePath = window.location.pathname.includes("/recipes/") ? "../" : "";

  // Load partials
  loadPartial("nav-placeholder", `${basePath}partials/nav.html`, basePath);
  loadPartial("cta-placeholder", `${basePath}partials/cta.html`, basePath);
  loadPartial("footer-placeholder", `${basePath}partials/footer.html`, basePath);

  // Check if .info-cards exists before building the recipe cards
  const container = document.querySelector(".info-cards");

  if (container) {
    // Build Recipe Cards
    fetch("recipes.json")
      .then((res) => res.json())
      .then((data) => {
        container.innerHTML = ""; // Clear existing HTML

        data.forEach((recipe) => {
          const card = document.createElement("div");
          card.classList.add("card");

          card.innerHTML = `
            <a href="${recipe.link}">
              <img class="card-image" src="${recipe.image}" alt="${recipe.category} Image">
            </a>
            <p>${recipe.category}</p>
          `;

          container.appendChild(card);
        });
      })
      .catch((err) => console.error("Error loading recipes.json:", err));
  } else {
    console.log('.info-cards not found on this page.');
  }

  // Fallback image logic
  document.addEventListener(
    "error",
    function (e) {
      const target = e.target;
      if (target.tagName === "IMG") {
        target.src = "img/default.jpg";
      }
    },
    true
  );
});

// Load partials into placeholders
function loadPartial(id, url, basePath) {
  console.log(`Loading partial: ${url}`);  // Debugging line
  fetch(url)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;

      // Update nav links dynamically
      const links = document.querySelectorAll('.nav-links a');
      links.forEach(link => {
        link.href = basePath + link.getAttribute('href');
      });

      // Run JS that depends on those elements being present
      if (id === "nav-placeholder") {
        setupHamburgerMenu(); // Only call hamburger logic after nav is loaded
      }
    })
    .catch((err) => console.error(`Error loading ${url}:`, err));
}

// Hamburger menu setup
function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!hamburger || !navLinks) return;

  // Set initial state
  hamburger.innerHTML = "&#9776;";
  navLinks.classList.remove("show");
  hamburger.classList.remove("open");

  // Handle hamburger click
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    hamburger.classList.toggle("open");

    hamburger.innerHTML = hamburger.classList.contains("open")
      ? "&times;"
      : "&#9776;";
  });

  // Close menu when nav link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      hamburger.classList.remove("open");
      hamburger.innerHTML = "&#9776;";
    });
  });
}
