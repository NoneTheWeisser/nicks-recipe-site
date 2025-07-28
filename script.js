// DOM ready log
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is loaded!");

  // Load partials (No need to prepend basePath)
  loadPartial("nav-placeholder", "partials/nav.html");
  loadPartial("cta-placeholder", "partials/cta.html");
  loadPartial("footer-placeholder", "partials/footer.html");

  // Check if .info-cards exists before building the recipe cards
  const container = document.querySelector(".info-cards");

  if (container) {
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
function loadPartial(id, url) {
  fetch(url)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    })
    .catch((err) => console.error(`Error loading ${url}:`, err));
}
