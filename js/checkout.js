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

/* ---------- Payment method toggle ---------- */
function setupPaymentToggle() {
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  if (paymentRadios.length === 0) return; // not on the checkout page

  const mpesaFields = document.getElementById('mpesa-fields');
  const cardFields = document.getElementById('card-fields');

  function updatePaymentFields() {
    const selected = document.querySelector('input[name="payment"]:checked').value;
    mpesaFields.classList.toggle('hidden', selected !== 'mpesa');
    cardFields.classList.toggle('hidden', selected !== 'card');
  }

  paymentRadios.forEach(function (radio) {
    radio.addEventListener('change', updatePaymentFields);
  });

  updatePaymentFields(); // set correct initial state on page load
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

    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    if (selectedPayment === 'card') {
      const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
      if (cardNumber.length < 12) {
        showCheckoutMessage('Please enter a valid card number.', true);
        return;
      }
    }

    if (selectedPayment === 'mpesa') {
      const mpesaPhone = document.getElementById('mpesa-phone').value.trim();
      if (mpesaPhone.length < 10) {
        showCheckoutMessage('Please enter a valid M-Pesa phone number.', true);
        return;
      }
    }

    // Generate a simple fake order number based on the current time
    const orderNumber = 'FC-' + Date.now().toString().slice(-8);
    setData('lastOrderNumber', orderNumber);
    setData('lastPaymentMethod', selectedPayment);

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

  // NEW: show which payment method was used
  const paymentMethodEl = document.getElementById('payment-method');
  const paymentMethod = getData('lastPaymentMethod', null);
  const paymentLabels = { mpesa: 'M-Pesa', card: 'Credit/Debit Card', cash: 'Cash on Delivery' };
  if (paymentMethodEl && paymentMethod) {
    paymentMethodEl.textContent = 'Paid via: ' + (paymentLabels[paymentMethod] || paymentMethod);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderCheckoutSummary();
  setupPaymentToggle();
  setupCheckoutForm();
  renderOrderSuccess();
});