/* =========================================================
   PRODUCTS.JS
   - PRODUCTS: the master list of all products in the store.

     >>> TO ADD A NEW PRODUCT: just add a new object to the
         PRODUCTS array below, with a unique id. That's it -
         it will automatically show up on the Home page preview,
         the Products catalogue, and get its own detail page. <<<

   - Renders product cards on the Home, Products, and
     Product Details pages.
   ========================================================= */

const PRODUCTS = [
  { id: 1,  name: 'Red Apples',        category: 'fruits',     price: Ksh 200, image: 'images/apple.jpg', description: 'Crisp, sweet red apples, perfect for snacking or baking.' },
  { id: 2,  name: 'Bananas',           category: 'fruits',     price: Ksh 140, image: 'images/banana.jpg', description: 'Ripe yellow bananas, a great source of potassium.' },
  { id: 3,  name: 'Strawberries',      category: 'fruits',     price: Ksh 400, image: 'images/strawberry.jpg', description: 'Fresh, juicy strawberries picked at peak ripeness.' },
  { id: 4,  name: 'Carrots',           category: 'vegetables', price: ksh 120, image: 'images/carrots.jpg', description: 'Crunchy orange carrots, great for salads and cooking.' },
  { id: 5,  name: 'Broccoli',          category: 'vegetables', price: Ksh 400, image: 'images/broccoli.jpg', description: 'Fresh green broccoli, packed with vitamins.' },
  { id: 6,  name: 'Tomatoes',          category: 'vegetables', price: Ksh 100, image: 'images/tomatoes.jpg', description: 'Ripe red tomatoes, perfect for salads and sauces.' },
  { id: 7,  name: 'Whole Milk',        category: 'dairy',      price: Ksh 450, image: 'images/milk.jpg', description: 'Fresh whole milk, 1 gallon.' },
  { id: 8,  name: 'Cheddar Cheese',    category: 'dairy',      price: Ksh 500, image: 'images/cheese.jpg', description: 'Sharp cheddar cheese block, aged for rich flavor.' },
  { id: 9,  name: 'Eggs (Dozen)',      category: 'dairy',      price: Ksh 150, image: 'images/eggs.jpg', description: 'Farm-fresh large eggs, one dozen.' },
  { id: 10, name: 'Sourdough Bread',   category: 'bakery',     price: Ksh 350, image: 'images/bread.jpg', description: 'Freshly baked sourdough loaf with a crisp crust.' },
  { id: 11, name: 'Croissants (4pk)',  category: 'bakery',     price: Ksh 800, image: 'images/croissant.jpg', description: 'Buttery, flaky croissants, baked fresh daily.' },
  { id: 12, name: 'White Rice (2kg)',  category: 'pantry',     price: Ksh429, image: 'images/rice.jpg', description: 'Long-grain white rice, a pantry essential.' },
  { id: 13, name: 'Pasta (500g)',      category: 'pantry',     price: Ksh 600, image: 'images/spaghetti.jpg', description: 'Classic durum wheat pasta.' },
  { id: 14, name: 'Olive Oil (1L)',    category: 'pantry',     price: Ksh 1400, image: 'images/olives.jpg', description: 'Extra virgin olive oil, cold-pressed.' }
];

/* ---------- Figure out the correct relative path based on current folder ---------- */
function getPathPrefix() {
  return window.location.pathname.includes('/pages/') ? '' : 'pages/';
}

// Images always live in /images at the project root, so pages inside /pages/
// need "../" to reach them, while index.html (at the root) needs nothing.
function getImagePrefix() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

/* ---------- Build the HTML for one product card ---------- */
function createProductCardHTML(product) {
  const prefix = getPathPrefix();
  // Use a real photo if the product has one, otherwise fall back to the emoji box
  const mediaHTML = product.image
    ? `<img src="${getImagePrefix()}${product.image}" alt="${product.name}">`
    : `<div class="product-card-emoji">${product.emoji}</div>`;
  return `
    <div class="product-card">
      ${mediaHTML}
      <div class="product-card-body">
        <h3>${product.name}</h3>
        <p class="price">${formatPrice(product.price)}</p>
        <a href="${prefix}product-details.html?id=${product.id}" class="btn btn-secondary">View Details</a>
      </div>
    </div>
  `;
}

/* ---------- Render a list of products into a grid container ---------- */
function renderProductGrid(containerId, productList) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (productList.length === 0) {
    container.innerHTML = '<p>No products found in this category.</p>';
    return;
  }

  container.innerHTML = productList.map(createProductCardHTML).join('');
}

/* ---------- Product Details page ---------- */
function renderProductDetails() {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  // Read the "id" value from the URL, e.g. product-details.html?id=3
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    container.innerHTML = '<p>Product not found.</p>';
    return;
  }

  container.innerHTML = `
    ${product.image
      ? `<img class="product-detail-image" src="${getImagePrefix()}${product.image}" alt="${product.name}">`
      : `<div class="product-detail-emoji">${product.emoji}</div>`}
    <div class="product-detail-info">
      <h1>${product.name}</h1>
      <p class="price">${formatPrice(product.price)}</p>
      <p class="description">${product.description}</p>
      <div class="quantity-selector">
        <button id="qty-minus" type="button">-</button>
        <span id="qty-value">1</span>
        <button id="qty-plus" type="button">+</button>
      </div>
      <button id="add-to-cart-btn" type="button" class="btn btn-primary">Add to Cart</button>
    </div>
  `;

  let quantity = 1;
  const qtyDisplay = document.getElementById('qty-value');

  document.getElementById('qty-minus').addEventListener('click', function () {
    if (quantity > 1) {
      quantity--;
      qtyDisplay.textContent = quantity;
    }
  });

  document.getElementById('qty-plus').addEventListener('click', function () {
    quantity++;
    qtyDisplay.textContent = quantity;
  });

  document.getElementById('add-to-cart-btn').addEventListener('click', function () {
    addToCart(product.id, quantity);
    alert(quantity + ' x ' + product.name + ' added to cart!');
  });
}

/* ---------- Category filter buttons (Products page) ---------- */
function setupCategoryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.getAttribute('data-category');
      const filtered = category === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === category);

      renderProductGrid('product-list', filtered);
    });
  });
}

/* ---------- Decide what to render based on which page we're on ---------- */
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('home-product-list')) {
    renderProductGrid('home-product-list', PRODUCTS.slice(0, 4)); // just a preview
  }

  if (document.getElementById('product-list')) {
    renderProductGrid('product-list', PRODUCTS);
    setupCategoryFilter();
  }

  renderProductDetails();
});