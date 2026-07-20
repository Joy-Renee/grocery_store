/* =========================================================
   CART.JS
   Renders the full Cart page (cart.html) and handles the
   quantity +/- and remove buttons. Only runs its logic if
   the cart page's container actually exists on the page.
   ========================================================= */

function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  if (!container) return; // not on the cart page - do nothing

  const cart = getCart();
  const subtotalEl = document.getElementById('cart-subtotal');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-message">Your cart is empty. <a href="products.html">Browse products</a></p>';
    subtotalEl.textContent = formatPrice(0);
    checkoutBtn.addEventListener('click', function (event) {
      event.preventDefault();
      alert('Your cart is empty. Add some products first!');
    });
    return;
  }

  // Build one .cart-item block per item in the cart
  container.innerHTML = cart.map(function (item) {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return ''; // safety check in case a product was removed from PRODUCTS
    const mediaHTML = product.image
      ? `<img class="cart-item-image" src="../${product.image}" alt="${product.name}">`
      : `<div class="cart-item-emoji">${product.emoji}</div>`;
    return `
      <div class="cart-item" data-id="${product.id}">
        ${mediaHTML}
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <p class="price">${formatPrice(product.price)}</p>
        </div>
        <div class="cart-item-controls">
          <button class="decrease-btn" type="button">-</button>
          <span>${item.qty}</span>
          <button class="increase-btn" type="button">+</button>
          <button class="remove-item-btn" type="button">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  subtotalEl.textContent = formatPrice(getCartTotal());

  // Attach click events to the buttons we just created for each item
  container.querySelectorAll('.cart-item').forEach(function (itemEl) {
    const productId = parseInt(itemEl.getAttribute('data-id'));
    const cartItem = cart.find(i => i.id === productId);

    itemEl.querySelector('.increase-btn').addEventListener('click', function () {
      updateCartItemQty(productId, cartItem.qty + 1);
      renderCartPage(); // re-render to reflect the new quantity/total
    });

    itemEl.querySelector('.decrease-btn').addEventListener('click', function () {
      updateCartItemQty(productId, cartItem.qty - 1);
      renderCartPage();
    });

    itemEl.querySelector('.remove-item-btn').addEventListener('click', function () {
      removeFromCart(productId);
      renderCartPage();
    });
  });
}

document.addEventListener('DOMContentLoaded', renderCartPage);