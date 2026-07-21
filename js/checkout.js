/* =========================================================
   CHECKOUT.JS
   - On checkout.html: shows an order summary (cart + shipping),
     validates the simulated payment form, and "places the order".
   - On order-success.html: displays the generated order number.
   ========================================================= */

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-summary');
  if (!container) return; // not on the checkout page

  const cart = getCart();
  const shippingInfo = getData('shippingInfo', null);

  if (cart.length === 0 || !shippingInfo) {
    container.innerHTML = '<p>Missing cart or shipping information. Please <a href="cart.html">start from your cart</a>.</p>';
    const form = document.getElementById('checkout-form');
    if (form) form.style.display = 'none';
    return;
  }

  let itemsHTML = '';
  cart.forEach(function (item) {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;
    itemsHTML += `
      <div class="summary-row">
        <span>${product.name} x${item.qty}</span>
        <span>${formatPrice(product.price * item.qty)}</span>
      </div>
    `;
  });

  container.innerHTML = `
    <h3>Order Summary</h3>
    ${itemsHTML}
    <div class="summary-row summary-total">
      <span>Total</span>
      <span>${formatPrice(getCartTotal())}</span>
    </div>
    <h3>Shipping To</h3>
    <p>${shippingInfo.name}<br>${shippingInfo.address}, ${shippingInfo.city} ${shippingInfo.postal}<br>${shippingInfo.phone}</p>
  `;
}

function showCheckoutMessage(text, isError) {
  const msg = document.getElementById('checkout-message');
  msg.textContent = text;
  msg.className = 'form-message ' + (isError ? 'error' : 'success');
}

function setupCheckoutForm() {
  const checkoutForm = document.getElementById('checkout-form');
  if (!checkoutForm) return;

  checkoutForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      showCheckoutMessage('Your cart is empty.', true);
      return;
    }

    // Basic simulated validation - this is NOT real payment processing
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    if (cardNumber.length < 12) {
      showCheckoutMessage('Please enter a valid card number.', true);
      return;
    }

    // Generate a simple fake order number based on the current time
    const orderNumber = 'FC-' + Date.now().toString().slice(-8);
    setData('lastOrderNumber', orderNumber);

    // The order is "placed" - empty the cart
    saveCart([]);

    window.location.href = 'order-success.html';
  });
}

/* ---------- Order Success page ---------- */
function renderOrderSuccess() {
  const orderNumberEl = document.getElementById('order-number');
  if (!orderNumberEl) return; // not on the order-success page

  const orderNumber = getData('lastOrderNumber', null);
  orderNumberEl.textContent = orderNumber ? 'Order Number: ' + orderNumber : '';
}

/* ---------- Order Rating ---------- */
function setupOrderRating() {
  const starContainer = document.getElementById('star-rating');
  if (!starContainer) return; // not on the order-success page

  const stars = starContainer.querySelectorAll('.star');
  const orderNumber = getData('lastOrderNumber', null);

  // If this order was already rated, show the saved rating instead of stars
  const ratings = getData('orderRatings', {});
  if (orderNumber && ratings[orderNumber]) {
    highlightStars(stars, ratings[orderNumber]);
    showRatingMessage('Thanks! You rated this order ' + ratings[orderNumber] + ' star(s).');
    return;
  }

  stars.forEach(function (star) {
    star.addEventListener('click', function () {
      const value = parseInt(star.dataset.value, 10);
      highlightStars(stars, value);

      if (orderNumber) {
        ratings[orderNumber] = value;
        setData('orderRatings', ratings);
      }

      showRatingMessage('Thanks for your feedback! You rated this order ' + value + ' star(s).');
    });
  });
}

function highlightStars(stars, value) {
  stars.forEach(function (star) {
    const starValue = parseInt(star.dataset.value, 10);
    star.classList.toggle('selected', starValue <= value);
  });
}

function showRatingMessage(text) {
  const msg = document.getElementById('rating-message');
  if (msg) {
    msg.textContent = text;
    msg.className = 'form-message success';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderCheckoutSummary();
  setupCheckoutForm();
  renderOrderSuccess();
  setupOrderRating();
  
});

