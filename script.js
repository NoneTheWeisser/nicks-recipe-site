// Determine the base path depending on where the HTML file is
const basePath =
  window.location.hostname === "nonetheweisser.github.io"
    ? "/nicks-recipe-site/" // For GitHub Pages
    : "/"; // For local testing
// DOM ready log
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is loaded!");

  // Load partials (nav, cta, footer) with correct base path
  loadPartial("nav-placeholder", `${basePath}partials/nav.html`);
  loadPartial("cta-placeholder", `${basePath}partials/cta.html`);
  loadPartial("footer-placeholder", `${basePath}partials/footer.html`);

  // Check if .info-cards exists before building the recipe cards
  const container = document.querySelector(".info-cards");

  if (container) {
    // Build Recipe Cards
    fetch(`${basePath}recipes.json`)
      .then((res) => res.json())
      .then((data) => {
        container.innerHTML = ""; // Clear existing HTML

        data.forEach((recipe) => {
          const card = document.createElement("div");
          card.classList.add("card");

          // Use basePath for constructing dynamic recipe card links
          card.innerHTML = `
              <a href="${basePath}${recipe.link}">
              <img class="card-image" src="${basePath}${recipe.image}" alt="${recipe.category} Image">
            </a>
            <p>${recipe.category}</p>
          `;

          container.appendChild(card);
        });
      })
      .catch((err) => console.error("Error loading recipes.json:", err));
  } else {
    console.log(".info-cards not found on this page.");
  }

  // Fallback image logic (for missing images)
  document.addEventListener(
    "error",
    function (e) {
      const target = e.target;
      if (target.tagName === "IMG") {
        target.src = `${basePath}img/default.jpg`; // Fallback image
      }
    },
    true
  );
});

// Load partials into placeholders
function loadPartial(id, url) {
  // console.log(`Loading partial: ${url}`); // Debugging line
  fetch(url)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;

      // Update nav links dynamically with the base path
      const links = document.querySelectorAll(".nav-links a");
      links.forEach((link) => {
        const href = link.getAttribute("href");

        if (href && !href.startsWith("/") && !href.startsWith("http")) {
          link.href = `${basePath}${href}`;
        }
      });

      // Update logo image dynamically, only if it's a relative path (not starting with / or http)
      const logoImage = document.querySelector(".logo img");
      if (logoImage) {
        const originalSrc = logoImage.getAttribute("src");

        if (!originalSrc.startsWith("/") && !originalSrc.startsWith("http")) {
          logoImage.src = `${basePath}${originalSrc}`;
        }
      }
      // Run JS that depends on those elements being present
      if (id === "nav-placeholder") {
        setupHamburgerMenu(); // Call hamburger logic after nav is loaded
      }
    })
    .catch((err) => console.error(`Error loading ${url}:`, err));
}

// Hamburger menu setup
function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!hamburger || !navLinks) return;

  // Set initial state of hamburger
  hamburger.innerHTML = "&#9776;";
  navLinks.classList.remove("show");
  hamburger.classList.remove("open");

  // Handle hamburger click
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    hamburger.classList.toggle("open");

    hamburger.innerHTML = hamburger.classList.contains("open")
      ? //  show close icon
        "&times;"
      : // show hamburger icon
        "&#9776;";
  });

  // Close menu when nav link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      hamburger.classList.remove("open");
      hamburger.innerHTML = "&#9776;";
    });
  });

  // Add in new recipe to hamburger bar dyamically
  const basePath = window.location.pathname.includes("/recipes/") ? "../" : "";
  fetch(`${basePath}recipes.json`)
    .then((res) => res.json())
    .then((recipes) => {
      const container = document.getElementById("dynamic-recipe-links");
      if (!container) return;

      // sorting recipes alphabetically
      recipes.sort((a, b) => a.category.localeCompare(b.category));

      recipes.forEach((recipe) => {
        const a = document.createElement("a");
        a.href = basePath + recipe.link;
        a.textContent = recipe.category;
        container.appendChild(a);
      });
    })
    .catch((err) => console.error("Failed to load recipes for nav:", err));
}

// Trying a function to add list items in
// this works but I can't keep doing it so need to take time and learn more about JSON
function renderList(items, elementId) {
  const target = document.getElementById(elementId);
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

const ingredients = [
"8 ounces cremini mushrooms",
"1/2 medium red onion",
"2 tablespoons coarsely chopped fresh rosemary leaves",
"1 pound pre-cut (1-inch) butternut squash cubes (about 4 cups)",
"1 pound fresh, shelf-stable, or frozen potato gnocchi",
"1/4 cup olive oil",
"1/2 teaspoon kosher salt",
"1/4 teaspoon freshly ground black pepper",
"8 ounces uncooked sweet or hot Italian sausage",
"Grated Parmesan cheese, for serving"
];

const instructions = [
  "Arrange 2 racks to divide the oven into thirds and heat the oven to 450°F.",
"Quarter 8 ounces cremini mushrooms and place them on a rimmed baking sheet.Cut 1/2 medium red onion into 1-inch chunks and place on the baking sheet. Chop until you have 2 tablespoons fresh rosemary leaves and sprinkle over the vegetables.",
"Add 1 pound cubed butternut squash (trim any large pieces into 1-inch pieces) and 1 pound potato gnocchi to the baking sheet. Drizzle everything with 1/4 cup olive oil, then sprinkle with 1/2 teaspoon kosher salt and 1/4 teaspoon black pepper. Toss to coat and spread the mixture into an even layer.",
"Remove the casings from 8 ounces sweet or hot Italian sausages if needed. Drop bite-sized pieces of the sausage all over the top of the gnocchi mixture.",
"Place the baking sheet on the lower rack. Roast, stirring halfway through, until the gnocchi are plump, the sausage is browned and cooked through, and the vegetables are tender, about 25 minutes total.",
"Move the baking sheet to the upper rack and turn on the broiler. Broil until the gnocchi are lightly browned and crisp, 3 to 5 minutes. Serve garnished with grated Parmesan cheese, if desired."

];

renderList(ingredients, "ingredients-list");
renderList(instructions, "instructions-list");