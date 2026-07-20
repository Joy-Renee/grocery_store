/* =========================================================
   SHIPPING.JS
   Handles the Shipping Information form (shipping.html).
   Saves the shipping details to localStorage under the
   "shippingInfo" key, then moves on to checkout.html.
   ========================================================= */

const shippingForm = document.getElementById('shipping-form');

if (shippingForm) {
  shippingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Don't let someone go to checkout with an empty cart
    const cart = getCart();
    if (cart.length === 0) {
      const msg = document.getElementById('shipping-message');
      msg.textContent = 'Your cart is empty. Add products before checking out.';
      msg.className = 'form-message error';
      return;
    }

    const shippingInfo = {
      name: document.getElementById('ship-name').value.trim(),
      address: document.getElementById('ship-address').value.trim(),
      city: document.getElementById('ship-city').value.trim(),
      postal: document.getElementById('ship-postal').value.trim(),
      phone: document.getElementById('ship-phone').value.trim()
    };

    setData('shippingInfo', shippingInfo);
    window.location.href = 'checkout.html';
  });
}
