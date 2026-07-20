/* =========================================================
   MAIN.JS
   Loaded on EVERY page. Contains:
   - Generic localStorage helpers
   - User/auth storage functions (used by auth.js)
   - Cart storage functions (used by products.js, cart.js, checkout.js)
   - Code that updates the navbar (cart count + login/logout link)
   - The Contact form handler
   ========================================================= */

/* ---------- Generic localStorage helpers ---------- */
function getData(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- USER / AUTH storage ---------- */
// users: [{ name, email, password }, ...]
function getUsers() {
  return getData('users', []);
}

function saveUsers(users) {
  setData('users', users);
}

function getCurrentUser() {
  return getData('currentUser', null);
}

function setCurrentUser(user) {
  setData('currentUser', user);
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.reload();
}

/* ---------- CART storage ---------- */
// cart: [{ id: productId, qty: number }, ...]
function getCart() {
  return getData('cart', []);
}

function saveCart(cart) {
  setData('cart', cart);
  updateCartCountDisplay();
}

function addToCart(productId, qty) {
  qty = qty || 1;
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }

  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartItemQty(productId, newQty) {
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.qty = newQty;
  }
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.qty, 0);
}

// Relies on the PRODUCTS array defined in products.js
function getCartTotal() {
  const cart = getCart();
  let total = 0;
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) total += product.price * item.qty;
  });
  return total;
}

/* ---------- Small formatting helper ---------- */
function formatPrice(amount) {
  return '$' + amount.toFixed(2);
}

/* ---------- NAVBAR: cart count + login/logout link ---------- */
function updateCartCountDisplay() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = getCartCount();
}

function updateAuthLinkDisplay() {
  const authLinkEl = document.getElementById('auth-link');
  if (!authLinkEl) return;

  const user = getCurrentUser();
  const inPagesFolder = window.location.pathname.includes('/pages/');

  if (user) {
    authLinkEl.innerHTML = `Hi, ${user.name} <button id="logout-btn">Logout</button>`;
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
  } else {
    const loginPath = inPagesFolder ? 'login.html' : 'pages/login.html';
    const signupPath = inPagesFolder ? 'signup.html' : 'pages/signup.html';
    authLinkEl.innerHTML = `<a href="${loginPath}">Login</a> / <a href="${signupPath}">Sign Up</a>`;
  }
}

/* ---------- Contact form (simulation only, no backend to send email) ---------- */
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const msg = document.getElementById('contact-form-message');
    msg.textContent = 'Thank you! Your message has been sent (simulated - no backend).';
    msg.className = 'form-message success';
    contactForm.reset();
  });
}

/* ---------- Runs on every single page ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateCartCountDisplay();
  updateAuthLinkDisplay();
  setupContactForm();
});
