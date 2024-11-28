// IDs and their corresponding file mappings
const routes = {
  "home-link": "index.html",
  "clinic-link": "clinics.html",
  "about-link": "about-us.html",
  "contact-link": "contact-us.html",
};

// Load a page dynamically
function loadPage(page) {
  fetch(page)
      .then(response => response.text())
      .then(content => {
          document.getElementById('content').innerHTML = content;
      })
      .catch(error => console.error('Error loading page:', error));
}

// Add event listeners for navigation links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', event => {
      event.preventDefault();
      const pageId = event.target.id;
      if (routes[pageId]) {
          loadPage(routes[pageId]);
      }
  });
});

// Load the default page on initial load
window.addEventListener('load', () => {
  loadPage(routes["home-link"]);
});
